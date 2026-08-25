#!/usr/bin/env bash

set -Eeuo pipefail

LABEL=""
WP_PATH=""
OUTPUT_ROOT="migration-inventory"
FAIL_ON_FINDINGS=false

usage() {
  cat <<'EOF'
Usage: scan-wordpress-content-contamination.sh \
  --label <site-label> \
  --path <wordpress-path> \
  [--output-dir <directory>] \
  [--fail-on-findings]

Creates a read-only report of Visual Composer/WPBakery and related page-builder contamination.
Content bodies, metadata values, and option values are never exported.
With --fail-on-findings, exits nonzero after writing the report if any marker is found.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --label)
      LABEL="${2:-}"
      shift 2
      ;;
    --path)
      WP_PATH="${2:-}"
      shift 2
      ;;
    --output-dir)
      OUTPUT_ROOT="${2:-}"
      shift 2
      ;;
    --fail-on-findings)
      FAIL_ON_FINDINGS=true
      shift
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

if [[ -z "$LABEL" || -z "$WP_PATH" ]]; then
  echo "ERROR: --label and --path are required." >&2
  usage >&2
  exit 2
fi

if ! command -v wp >/dev/null 2>&1; then
  echo "ERROR: wp was not found in PATH." >&2
  exit 1
fi

if [[ ! -f "$WP_PATH/wp-config.php" ]]; then
  echo "ERROR: wp-config.php not found under $WP_PATH." >&2
  exit 1
fi

SAFE_LABEL=$(printf '%s' "$LABEL" | tr -cd '[:alnum:]_-')
if [[ -z "$SAFE_LABEL" ]]; then
  echo "ERROR: --label must contain a letter, number, underscore, or hyphen." >&2
  exit 2
fi

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
OUTPUT_DIR="$OUTPUT_ROOT/${SAFE_LABEL}-contamination-${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR"
chmod 700 "$OUTPUT_DIR"

WP=(wp --path="$WP_PATH" --skip-plugins --skip-themes)
TABLE_PREFIX=$("${WP[@]}" db prefix)
if [[ ! "$TABLE_PREFIX" =~ ^[[:alnum:]_]+$ ]]; then
  echo "ERROR: Unsafe WordPress table prefix returned: $TABLE_PREFIX" >&2
  exit 1
fi

query() {
  local sql="$1"
  local destination="$2"
  "${WP[@]}" db query "$sql" --batch --raw > "$OUTPUT_DIR/$destination"
}

CONTENT_PREDICATE="
  INSTR(LOWER(post_content), '[vc_') > 0
  OR INSTR(LOWER(post_content), '[/vc_') > 0
  OR INSTR(LOWER(post_content), '[wpb_') > 0
  OR INSTR(LOWER(post_content), '[/wpb_') > 0
  OR INSTR(LOWER(post_content), '[rev_slider') > 0
  OR INSTR(LOWER(post_content), '[ess_grid') > 0
  OR INSTR(LOWER(post_content), '[layerslider') > 0
  OR INSTR(LOWER(post_content), 'class=\"vc_') > 0
  OR INSTR(LOWER(post_content), 'class=\"wpb_') > 0
  OR INSTR(LOWER(post_excerpt), '[vc_') > 0
  OR INSTR(LOWER(post_excerpt), '[wpb_') > 0
"

query "SELECT ID, post_type, post_name, post_status, post_modified_gmt FROM ${TABLE_PREFIX}posts WHERE ${CONTENT_PREDICATE} ORDER BY post_type, post_name, ID;" "builder-content-records.tsv"
query "SELECT post_type, post_status, COUNT(*) AS affected_records FROM ${TABLE_PREFIX}posts WHERE ${CONTENT_PREDICATE} GROUP BY post_type, post_status ORDER BY post_type, post_status;" "builder-content-counts.tsv"
query "SELECT meta_key, COUNT(*) AS affected_rows, COUNT(DISTINCT post_id) AS affected_records FROM ${TABLE_PREFIX}postmeta WHERE LOWER(meta_key) REGEXP '^_?(vc|wpb|js_composer|revslider|ess_grid|layerslider)' GROUP BY meta_key ORDER BY meta_key;" "builder-meta-keys.tsv"
query "SELECT meta_key, COUNT(*) AS affected_rows, COUNT(DISTINCT post_id) AS affected_records FROM ${TABLE_PREFIX}postmeta WHERE LOWER(meta_value) REGEXP '(\\[/?(vc_|wpb_)|visual.?composer|wpbakery|js_composer|revslider|ess_grid|layerslider|class=\"(vc_|wpb_))' GROUP BY meta_key ORDER BY meta_key;" "builder-meta-values.tsv"
query "SELECT option_name FROM ${TABLE_PREFIX}options WHERE LOWER(option_name) REGEXP '(vc_|wpb_|js_composer|wpbakery|revslider|ess_grid|layerslider)' ORDER BY option_name;" "builder-option-names.tsv"
query "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND LOWER(table_name) REGEXP '(vc_|wpb_|js_composer|wpbakery|revslider|ess_grid|layerslider)' ORDER BY table_name;" "builder-table-names.tsv"

find "$WP_PATH/wp-content/uploads" -type f -printf '%P\t%s\n' \
  | awk -F '\t' '
      BEGIN { IGNORECASE = 1 }
      $1 ~ /(^|\/)(js_composer|visual-composer|wpbakery|vc_grid|revslider|revslider-templates|ess_grid|layerslider)(\/|$)/ { print }
    ' \
  | LC_ALL=C sort > "$OUTPUT_DIR/builder-upload-files.tsv"

builder_content_records=$(( $(wc -l < "$OUTPUT_DIR/builder-content-records.tsv") - 1 ))
builder_meta_keys=$(( $(wc -l < "$OUTPUT_DIR/builder-meta-keys.tsv") - 1 ))
builder_meta_values=$(( $(wc -l < "$OUTPUT_DIR/builder-meta-values.tsv") - 1 ))
builder_option_names=$(( $(wc -l < "$OUTPUT_DIR/builder-option-names.tsv") - 1 ))
builder_table_names=$(( $(wc -l < "$OUTPUT_DIR/builder-table-names.tsv") - 1 ))
builder_upload_files=$(wc -l < "$OUTPUT_DIR/builder-upload-files.tsv" | tr -d '[:space:]')

{
  echo "label=$LABEL"
  echo "captured_at_utc=$TIMESTAMP"
  echo "wordpress_path=$WP_PATH"
  echo "builder_content_records=$builder_content_records"
  echo "builder_meta_keys=$builder_meta_keys"
  echo "builder_meta_values=$builder_meta_values"
  echo "builder_option_names=$builder_option_names"
  echo "builder_table_names=$builder_table_names"
  echo "builder_upload_files=$builder_upload_files"
} > "$OUTPUT_DIR/summary.txt"

find "$OUTPUT_DIR" -type f -exec chmod 600 {} +

echo "Contamination scan complete: $OUTPUT_DIR"
echo "Records in this report are reject-by-default until converted or explicitly excluded."

if [[ "$FAIL_ON_FINDINGS" == true ]] && ((
  builder_content_records > 0 ||
  builder_meta_keys > 0 ||
  builder_meta_values > 0 ||
  builder_option_names > 0 ||
  builder_table_names > 0 ||
  builder_upload_files > 0
)); then
  echo "ERROR: Contamination findings present; acceptance gate failed." >&2
  exit 1
fi