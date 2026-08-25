#!/usr/bin/env bash

set -Eeuo pipefail

LEGACY_DIR=""
HEADLESS_DIR=""
OUTPUT_DIR=""

usage() {
  cat <<'EOF'
Usage: compare-wordpress-inventories.sh \
  --legacy-dir <inventory-directory> \
  --headless-dir <inventory-directory> \
  --output-dir <report-directory>

Compares two reports created by inventory-wordpress-migration.sh. The output contains aggregate
counts and exception queues. User exceptions contain SHA-256 email hashes, never email addresses.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --legacy-dir)
      LEGACY_DIR="${2:-}"
      shift 2
      ;;
    --headless-dir)
      HEADLESS_DIR="${2:-}"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$LEGACY_DIR" || -z "$HEADLESS_DIR" || -z "$OUTPUT_DIR" ]]; then
  echo "ERROR: --legacy-dir, --headless-dir, and --output-dir are required." >&2
  usage >&2
  exit 2
fi

REQUIRED_FILES=(
  content-manifest.tsv
  duplicate-skus.tsv
  product-sku-manifest.tsv
  taxonomy-manifest.tsv
  uploads-manifest.tsv
  user-hash-manifest.tsv
)

for inventory_dir in "$LEGACY_DIR" "$HEADLESS_DIR"; do
  for required_file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$inventory_dir/$required_file" ]]; then
      echo "ERROR: Missing $inventory_dir/$required_file" >&2
      exit 1
    fi
  done
done

mkdir -p "$OUTPUT_DIR"
chmod 700 "$OUTPUT_DIR"

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

extract_skus() {
  awk -F '\t' 'NR > 1 && $6 != "" { print $6 }' "$1/product-sku-manifest.tsv" | LC_ALL=C sort -u
}

extract_users() {
  awk -F '\t' 'NR > 1 && $2 != "" { print $2 }' "$1/user-hash-manifest.tsv" | LC_ALL=C sort -u
}

extract_content() {
  awk -F '\t' 'NR > 1 && $3 != "" { print $1 "\t" $3 }' "$1/content-manifest.tsv" | LC_ALL=C sort -u
}

extract_taxonomies() {
  awk -F '\t' 'NR > 1 && $3 != "" { print $1 "\t" $3 }' "$1/taxonomy-manifest.tsv" | LC_ALL=C sort -u
}

extract_upload_paths() {
  cut -f1 "$1/uploads-manifest.tsv" | LC_ALL=C sort -u
}

extract_skus "$LEGACY_DIR" > "$WORK_DIR/legacy-skus"
extract_skus "$HEADLESS_DIR" > "$WORK_DIR/headless-skus"
extract_users "$LEGACY_DIR" > "$WORK_DIR/legacy-users"
extract_users "$HEADLESS_DIR" > "$WORK_DIR/headless-users"
extract_content "$LEGACY_DIR" > "$WORK_DIR/legacy-content"
extract_content "$HEADLESS_DIR" > "$WORK_DIR/headless-content"
extract_taxonomies "$LEGACY_DIR" > "$WORK_DIR/legacy-taxonomies"
extract_taxonomies "$HEADLESS_DIR" > "$WORK_DIR/headless-taxonomies"
extract_upload_paths "$LEGACY_DIR" > "$WORK_DIR/legacy-uploads"
extract_upload_paths "$HEADLESS_DIR" > "$WORK_DIR/headless-uploads"

comm -23 "$WORK_DIR/legacy-skus" "$WORK_DIR/headless-skus" > "$OUTPUT_DIR/skus-only-legacy.txt"
comm -13 "$WORK_DIR/legacy-skus" "$WORK_DIR/headless-skus" > "$OUTPUT_DIR/skus-only-headless.txt"
comm -23 "$WORK_DIR/legacy-users" "$WORK_DIR/headless-users" > "$OUTPUT_DIR/users-only-legacy.sha256"
comm -13 "$WORK_DIR/legacy-users" "$WORK_DIR/headless-users" > "$OUTPUT_DIR/users-only-headless.sha256"
comm -23 "$WORK_DIR/legacy-content" "$WORK_DIR/headless-content" > "$OUTPUT_DIR/content-only-legacy.tsv"
comm -13 "$WORK_DIR/legacy-content" "$WORK_DIR/headless-content" > "$OUTPUT_DIR/content-only-headless.tsv"
comm -23 "$WORK_DIR/legacy-taxonomies" "$WORK_DIR/headless-taxonomies" > "$OUTPUT_DIR/taxonomies-only-legacy.tsv"
comm -13 "$WORK_DIR/legacy-taxonomies" "$WORK_DIR/headless-taxonomies" > "$OUTPUT_DIR/taxonomies-only-headless.tsv"
comm -23 "$WORK_DIR/legacy-uploads" "$WORK_DIR/headless-uploads" > "$OUTPUT_DIR/uploads-only-legacy.txt"
comm -13 "$WORK_DIR/legacy-uploads" "$WORK_DIR/headless-uploads" > "$OUTPUT_DIR/uploads-only-headless.txt"

{
  printf 'path\tlegacy_size\theadless_size\tlegacy_modified\theadless_modified\n'
  join -t $'\t' -1 1 -2 1 \
    <(LC_ALL=C sort -t $'\t' -k1,1 "$LEGACY_DIR/uploads-manifest.tsv") \
    <(LC_ALL=C sort -t $'\t' -k1,1 "$HEADLESS_DIR/uploads-manifest.tsv") \
    | awk -F '\t' '$2 != $4 { print $1 "\t" $2 "\t" $4 "\t" $3 "\t" $5 }'
} > "$OUTPUT_DIR/shared-upload-size-differences.tsv"

cp "$LEGACY_DIR/duplicate-skus.tsv" "$OUTPUT_DIR/duplicate-skus-legacy.tsv"
cp "$HEADLESS_DIR/duplicate-skus.tsv" "$OUTPUT_DIR/duplicate-skus-headless.tsv"

count_lines() {
  wc -l < "$1" | tr -d '[:space:]'
}

content_breakdown() {
  local input_file="$1"
  if [[ ! -s "$input_file" ]]; then
    echo "- None"
    return
  fi
  awk -F '\t' '{ count[$1]++ } END { for (type in count) print "- `" type "`: " count[type] }' "$input_file" | LC_ALL=C sort
}

{
  echo "# WordPress Inventory Reconciliation"
  echo
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "## Stable-Key Coverage"
  echo
  echo "| Dataset | Legacy only | Headless only | Shared |"
  echo "|---|---:|---:|---:|"
  echo "| Nonblank SKU values | $(count_lines "$OUTPUT_DIR/skus-only-legacy.txt") | $(count_lines "$OUTPUT_DIR/skus-only-headless.txt") | $(comm -12 "$WORK_DIR/legacy-skus" "$WORK_DIR/headless-skus" | wc -l | tr -d '[:space:]') |"
  echo "| User email hashes | $(count_lines "$OUTPUT_DIR/users-only-legacy.sha256") | $(count_lines "$OUTPUT_DIR/users-only-headless.sha256") | $(comm -12 "$WORK_DIR/legacy-users" "$WORK_DIR/headless-users" | wc -l | tr -d '[:space:]') |"
  echo "| Post type + slug | $(count_lines "$OUTPUT_DIR/content-only-legacy.tsv") | $(count_lines "$OUTPUT_DIR/content-only-headless.tsv") | $(comm -12 "$WORK_DIR/legacy-content" "$WORK_DIR/headless-content" | wc -l | tr -d '[:space:]') |"
  echo "| Taxonomy + slug | $(count_lines "$OUTPUT_DIR/taxonomies-only-legacy.tsv") | $(count_lines "$OUTPUT_DIR/taxonomies-only-headless.tsv") | $(comm -12 "$WORK_DIR/legacy-taxonomies" "$WORK_DIR/headless-taxonomies" | wc -l | tr -d '[:space:]') |"
  echo "| Upload path | $(count_lines "$OUTPUT_DIR/uploads-only-legacy.txt") | $(count_lines "$OUTPUT_DIR/uploads-only-headless.txt") | $(comm -12 "$WORK_DIR/legacy-uploads" "$WORK_DIR/headless-uploads" | wc -l | tr -d '[:space:]') |"
  echo
  echo "Shared upload paths with different byte sizes: $(( $(count_lines "$OUTPUT_DIR/shared-upload-size-differences.tsv") - 1 ))"
  echo
  echo "Duplicate nonblank SKU groups:"
  echo "- Legacy: $(( $(count_lines "$OUTPUT_DIR/duplicate-skus-legacy.tsv") - 1 ))"
  echo "- Headless: $(( $(count_lines "$OUTPUT_DIR/duplicate-skus-headless.tsv") - 1 ))"
  echo
  echo "## Legacy-Only Content"
  echo
  content_breakdown "$OUTPUT_DIR/content-only-legacy.tsv"
  echo
  echo "## Headless-Only Content"
  echo
  content_breakdown "$OUTPUT_DIR/content-only-headless.tsv"
  echo
  echo "## Interpretation"
  echo
  echo "- Empty SKU set differences do not prove product field equality; a field-level hash pass is still required."
  echo "- Duplicate SKU groups require an exception key before product or variation writes are allowed."
  echo "- User exception files contain hashes only and must be resolved on the source hosts."
  echo "- Upload size differences are collision candidates, not permission to overwrite either file."
  echo "- Content and taxonomy exceptions require ownership review before merge rules are implemented."
} > "$OUTPUT_DIR/summary.md"

find "$OUTPUT_DIR" -type f -exec chmod 600 {} +

echo "Comparison complete: $OUTPUT_DIR"
echo "Review summary.md, then resolve the generated exception queues."