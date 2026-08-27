#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

LEGACY_DELTA=""
HEADLESS_DELTA=""
LEGACY_INVENTORY=""
HEADLESS_INVENTORY=""
LEGACY_DOCUMENT_PAIRS=""
HEADLESS_DOCUMENT_PAIRS=""
APPROVED_MEDIA_PATHS=""
ETA_SCRIPT="scripts/update-eta-prices-legacy.sh"
POLICY_FILE="scripts/wordpress-rehearsal-policy.json"
OUTPUT_DIR="migration-inventory/rehearsal-package"
DEFER_POLICY=false

usage() {
  cat <<'EOF'
Usage: prepare-wordpress-rehearsal-package.sh \
  --legacy-delta <directory> \
  --headless-delta <directory> \
  --legacy-inventory <directory> \
  --headless-inventory <directory> \
  --legacy-document-pairs <file> \
  --headless-document-pairs <file> \
  [--approved-media-paths <file>] \
  [--eta-script <path>] \
  [--policy <path>] \
  [--defer-policy] \
  [--output-dir <directory>]

Generates a local dry-run package. It does not connect to WordPress or modify data.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --legacy-delta) LEGACY_DELTA="${2:-}"; shift 2 ;;
    --headless-delta) HEADLESS_DELTA="${2:-}"; shift 2 ;;
    --legacy-inventory) LEGACY_INVENTORY="${2:-}"; shift 2 ;;
    --headless-inventory) HEADLESS_INVENTORY="${2:-}"; shift 2 ;;
    --legacy-document-pairs) LEGACY_DOCUMENT_PAIRS="${2:-}"; shift 2 ;;
    --headless-document-pairs) HEADLESS_DOCUMENT_PAIRS="${2:-}"; shift 2 ;;
    --approved-media-paths) APPROVED_MEDIA_PATHS="${2:-}"; shift 2 ;;
    --eta-script) ETA_SCRIPT="${2:-}"; shift 2 ;;
    --policy) POLICY_FILE="${2:-}"; shift 2 ;;
    --defer-policy) DEFER_POLICY=true; shift ;;
    --output-dir) OUTPUT_DIR="${2:-}"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "ERROR: Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "$LEGACY_DELTA" || -z "$HEADLESS_DELTA" || -z "$LEGACY_INVENTORY" || -z "$HEADLESS_INVENTORY" || -z "$LEGACY_DOCUMENT_PAIRS" || -z "$HEADLESS_DOCUMENT_PAIRS" ]]; then
  echo "ERROR: Both delta/inventory directories and both document pair files are required." >&2
  usage >&2
  exit 2
fi

REQUIRED=(
  "$LEGACY_DELTA/catalog-field-hashes.tsv"
  "$HEADLESS_DELTA/catalog-field-hashes.tsv"
  "$LEGACY_DELTA/order-user-relationships.tsv"
  "$LEGACY_DELTA/referenced-product-media-hashes.tsv"
  "$HEADLESS_DELTA/referenced-product-media-hashes.tsv"
  "$LEGACY_INVENTORY/user-hash-manifest.tsv"
  "$HEADLESS_INVENTORY/user-hash-manifest.tsv"
  "$ETA_SCRIPT"
  "$LEGACY_DOCUMENT_PAIRS"
  "$HEADLESS_DOCUMENT_PAIRS"
)
if [[ "$DEFER_POLICY" != true ]]; then
  REQUIRED+=("$POLICY_FILE")
fi
if [[ -n "$APPROVED_MEDIA_PATHS" ]]; then
  REQUIRED+=("$APPROVED_MEDIA_PATHS")
fi
for required_file in "${REQUIRED[@]}"; do
  if [[ ! -f "$required_file" ]]; then
    echo "ERROR: Missing required file: $required_file" >&2
    exit 1
  fi
done

assert_header() {
  local input_file="$1"
  local expected_header="$2"
  local actual_header
  IFS= read -r actual_header < "$input_file" || true
  if [[ "$actual_header" != "$expected_header" ]]; then
    echo "ERROR: Unexpected TSV header: $input_file" >&2
    exit 1
  fi
}

catalog_header=$'post_type\tsku\tslug\tparent_sku\tpost_status\tpost_modified_gmt\tprice_hash\tinventory_hash\tcustomer_group_hash\tproduct_documents_hash'
order_header=$'source_order_id\torder_key_hash\tpost_type\tpost_status\tpost_date_gmt\tpost_modified_gmt\tsource_user_id\tbilling_email_hash\tsource_user_exists\tsource_state_hash'
media_header=$'upload_path\tbytes\tsha256\tstatus'
user_header=$'user_id\temail_sha256\tuser_registered'
document_pair_header=$'product_slug\tdocument_heading_hex\tupload_path_hex'
assert_header "$LEGACY_DELTA/catalog-field-hashes.tsv" "$catalog_header"
assert_header "$HEADLESS_DELTA/catalog-field-hashes.tsv" "$catalog_header"
assert_header "$LEGACY_DELTA/order-user-relationships.tsv" "$order_header"
assert_header "$LEGACY_DELTA/referenced-product-media-hashes.tsv" "$media_header"
assert_header "$HEADLESS_DELTA/referenced-product-media-hashes.tsv" "$media_header"
assert_header "$LEGACY_INVENTORY/user-hash-manifest.tsv" "$user_header"
assert_header "$HEADLESS_INVENTORY/user-hash-manifest.tsv" "$user_header"
assert_header "$LEGACY_DOCUMENT_PAIRS" "$document_pair_header"
assert_header "$HEADLESS_DOCUMENT_PAIRS" "$document_pair_header"

if [[ ! "$OUTPUT_DIR" =~ ^migration-inventory/[[:alnum:]_.-]+(/[[:alnum:]_.-]+)*$ ]]; then
  echo "ERROR: --output-dir must be a non-symlinked path below migration-inventory/." >&2
  exit 2
fi
output_component=""
IFS='/' read -r -a output_components <<< "$OUTPUT_DIR"
for component in "${output_components[@]}"; do
  if [[ "$component" == "." || "$component" == ".." ]]; then
    echo "ERROR: --output-dir contains an unsafe path component: $component" >&2
    exit 2
  fi
  output_component="${output_component:+$output_component/}$component"
  if [[ -L "$output_component" ]]; then
    echo "ERROR: --output-dir contains a symlinked path component: $output_component" >&2
    exit 2
  fi
done

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
chmod 700 "$OUTPUT_DIR"
if [[ "$DEFER_POLICY" != true ]]; then
  cp "$POLICY_FILE" "$OUTPUT_DIR/approved-policy.json"
fi
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

# Parse only executable update_price calls. The target price is intentionally included in the
# ignored rehearsal package so Product/Sales can approve the proposed change.
awk '
  /^[[:space:]]*update_price[[:space:]]/ {
    line=$0
    sub(/^[[:space:]]*update_price[[:space:]]+/, "", line)
    if (!match(line, /[[:space:]]+"[0-9]+([.][0-9]+)?"[[:space:]]*$/)) next
    sku=substr(line, 1, RSTART-1)
    price=substr(line, RSTART, RLENGTH)
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", sku)
    gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", price)
    first=substr(sku, 1, 1)
    last=substr(sku, length(sku), 1)
    if ((first == "\"" && last == "\"") || (first == sprintf("%c", 39) && last == sprintf("%c", 39))) {
      sku=substr(sku, 2, length(sku)-2)
    }
    print sku "\t" price
  }
' "$ETA_SCRIPT" | LC_ALL=C sort -t $'\t' -k1,1 > "$WORK_DIR/eta-targets.tsv"

awk -F '\t' 'NR > 1 && $2 != "" { count[$2]++; hash[$2]=$7 } END { for (sku in count) print sku "\t" count[sku] "\t" hash[sku] }' \
  "$LEGACY_DELTA/catalog-field-hashes.tsv" | LC_ALL=C sort -t $'\t' -k1,1 > "$WORK_DIR/legacy-prices.tsv"
awk -F '\t' 'NR > 1 && $2 != "" { count[$2]++; hash[$2]=$7 } END { for (sku in count) print sku "\t" count[sku] "\t" hash[sku] }' \
  "$HEADLESS_DELTA/catalog-field-hashes.tsv" | LC_ALL=C sort -t $'\t' -k1,1 > "$WORK_DIR/headless-prices.tsv"

{
  printf 'sku\ttarget_regular_price\tlegacy_records\theadless_records\tprice_hash_equal\theadless_price_hash\tdisposition\n'
  awk -F '\t' '
    FILENAME==ARGV[1] { legacy_count[$1]=$2; legacy_hash[$1]=$3; next }
    FILENAME==ARGV[2] { headless_count[$1]=$2; headless_hash[$1]=$3; next }
    FILENAME==ARGV[3] {
      sku=$1; price=$2; lc=legacy_count[sku]+0; hc=headless_count[sku]+0
      if (lc==0 && hc<=1) disposition="reject-source-missing"
      else if (lc!=1 || hc!=1) {
        print "ERROR: Ambiguous ETA key for SKU " sku ": legacy=" lc ", headless=" hc > "/dev/stderr"
        invalid=1
        next
      }
      else disposition="candidate-update"
      equal=(lc==1 && hc==1 && legacy_hash[sku]==headless_hash[sku]) ? "yes" : "no"
      print sku "\t" price "\t" lc "\t" hc "\t" equal "\t" headless_hash[sku] "\t" disposition
    }
    END { if (invalid) exit 1 }
  ' "$WORK_DIR/legacy-prices.tsv" "$WORK_DIR/headless-prices.tsv" "$WORK_DIR/eta-targets.tsv"
} > "$OUTPUT_DIR/eta-price-dry-run.tsv"

awk -F '\t' 'NR > 1 && $1 != "" { print $1 "\t" $2 "\t" $3 "\t" $4 }' \
  "$LEGACY_DELTA/referenced-product-media-hashes.tsv" | LC_ALL=C sort -t $'\t' -k1,1 > "$WORK_DIR/legacy-media.tsv"
awk -F '\t' 'NR > 1 && $1 != "" { print $1 "\t" $2 "\t" $3 "\t" $4 }' \
  "$HEADLESS_DELTA/referenced-product-media-hashes.tsv" | LC_ALL=C sort -t $'\t' -k1,1 > "$WORK_DIR/headless-media.tsv"

{
  printf 'upload_path\tlegacy_bytes\tlegacy_sha256\theadless_bytes\theadless_sha256\tdisposition\n'
  awk -F '\t' '
    FILENAME==ARGV[1] { hb[$1]=$2; hh[$1]=$3; hs[$1]=$4; next }
    FILENAME==ARGV[2] {
      path=$1
      if ($4!="present") disposition="reject-source-missing"
      else if (!(path in hh)) disposition="candidate-add"
      else if (hs[path]!="present") disposition="candidate-repair-target"
      else if ($3!=hh[path]) disposition="candidate-replace"
      else disposition="no-op"
      if (disposition!="no-op") print path "\t" $2 "\t" $3 "\t" hb[path] "\t" hh[path] "\t" disposition
    }
  ' "$WORK_DIR/headless-media.tsv" "$WORK_DIR/legacy-media.tsv"
} > "$WORK_DIR/product-document-media-all.tsv"

if [[ -n "$APPROVED_MEDIA_PATHS" ]]; then
  {
    head -n 1 "$WORK_DIR/product-document-media-all.tsv"
    awk -F '\t' 'FILENAME==ARGV[1] { approved[$1]=1; next } FNR>1 && ($1 in approved)' \
      "$APPROVED_MEDIA_PATHS" "$WORK_DIR/product-document-media-all.tsv"
  } > "$OUTPUT_DIR/product-document-media-dry-run.tsv"
else
  cp "$WORK_DIR/product-document-media-all.tsv" "$OUTPUT_DIR/product-document-media-dry-run.tsv"
fi

{
  printf 'product_slug\tdocument_heading_hex\tupload_path_hex\n'
  comm -23 \
  <(tail -n +2 "$LEGACY_DOCUMENT_PAIRS" | LC_ALL=C sort -u) \
  <(tail -n +2 "$HEADLESS_DOCUMENT_PAIRS" | LC_ALL=C sort -u)
} > "$OUTPUT_DIR/product-document-mapping-additions.tsv"

awk -F '\t' 'NR > 1 && $2 != "" { print $2 }' "$LEGACY_INVENTORY/user-hash-manifest.tsv" | LC_ALL=C sort -u > "$WORK_DIR/legacy-users"
awk -F '\t' 'NR > 1 && $2 != "" { print $2 }' "$HEADLESS_INVENTORY/user-hash-manifest.tsv" | LC_ALL=C sort -u > "$WORK_DIR/headless-users"

{
  if [[ "$DEFER_POLICY" == true ]]; then
    printf 'order_key_hash\tpost_type\tstatus\tcreated_gmt\tmodified_gmt\tbilling_email_hash\taccount_resolution\tsource_state_hash\n'
  else
    printf 'order_key_hash\tpost_type\tstatus\tcreated_gmt\tmodified_gmt\tbilling_email_hash\taccount_resolution\n'
  fi
  awk -F '\t' -v include_source_hash="$DEFER_POLICY" '
    FILENAME==ARGV[1] { legacy_user[$1]=1; next }
    FILENAME==ARGV[2] { headless_user[$1]=1; next }
    FILENAME==ARGV[3] && FNR > 1 && $2!="" {
      billing=$8
      if (billing=="") resolution="guest-order"
      else if (billing in headless_user) resolution="link-existing-headless-user"
      else if (billing in legacy_user) resolution="legacy-account-review"
      else resolution="guest-order"
      output=$2 "\t" $3 "\t" $4 "\t" $5 "\t" $6 "\t" billing "\t" resolution
      if (include_source_hash=="true") output=output "\t" $10
      print output
    }
  ' "$WORK_DIR/legacy-users" "$WORK_DIR/headless-users" "$LEGACY_DELTA/order-user-relationships.tsv"
} > "$OUTPUT_DIR/order-dry-run.tsv"

eta_attempted=$(awk 'END { print NR+0 }' "$OUTPUT_DIR/eta-price-dry-run.tsv")
eta_attempted=$((eta_attempted - 1))
eta_candidates=$(awk -F '\t' 'NR > 1 && $7 == "candidate-update" { count++ } END { print count+0 }' "$OUTPUT_DIR/eta-price-dry-run.tsv")
eta_missing=$(awk -F '\t' 'NR > 1 && $7 == "reject-source-missing" { count++ } END { print count+0 }' "$OUTPUT_DIR/eta-price-dry-run.tsv")
media_add=$(awk -F '\t' 'NR > 1 && $6 == "candidate-add" { count++ } END { print count+0 }' "$OUTPUT_DIR/product-document-media-dry-run.tsv")
media_replace=$(awk -F '\t' 'NR > 1 && $6 == "candidate-replace" { count++ } END { print count+0 }' "$OUTPUT_DIR/product-document-media-dry-run.tsv")
document_mapping_adds=$(awk 'END { print NR-1 }' "$OUTPUT_DIR/product-document-mapping-additions.tsv")
document_parents=$(awk -F '\t' 'NR > 1 && $1 != "" { seen[$1]=1 } END { print length(seen) }' "$OUTPUT_DIR/product-document-mapping-additions.tsv")
order_count=$(awk -F '\t' 'NR > 1 && $1 != "" { count++ } END { print count+0 }' "$OUTPUT_DIR/order-dry-run.tsv")

{
  echo "# WordPress Rehearsal Package"
  echo
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "This package is a dry run. It contains no WordPress write commands."
  if [[ "$DEFER_POLICY" == true ]]; then
    echo "Approved policy SHA-256: pending schema-v2 policy generation and review"
  else
    echo "Approved policy SHA-256: $(sha256sum "$OUTPUT_DIR/approved-policy.json" | cut -d ' ' -f1)"
  fi
  echo
  echo "## ETA Prices"
  echo
  echo "- Scripted attempts: $eta_attempted"
  echo "- Candidate updates: $eta_candidates"
  echo "- Missing on Legacy and rejected: $eta_missing"
  echo '- Any ambiguous SKU is rejected. Only `_regular_price` and conditional `_price` are in scope.'
  echo
  echo "## Product Documents"
  echo
  echo "- Candidate PDF additions: $media_add"
  echo "- Candidate same-path PDF replacements: $media_replace"
  echo "- Candidate additive document mappings: $document_mapping_adds across $document_parents parents"
  echo "- Hash equality is required after transfer; no directory-level copy is allowed."
  echo
  echo "## Orders"
  echo
  echo "- Legacy delta candidates: $order_count"
  awk -F '\t' 'NR > 1 { status[$3]++; resolution[$7]++ } END { for (key in status) print "- Status `" key "`: " status[key]; for (key in resolution) print "- Account resolution `" key "`: " resolution[key] }' "$OUTPUT_DIR/order-dry-run.tsv" | LC_ALL=C sort
  echo "- WordPress author IDs are ignored. Billing-email hashes are used only for account reconciliation."
  echo
  echo "## Explicit Exclusions"
  echo
  echo "- Legacy plugins, themes, options, plugin tables, page-builder data, and generated files"
  echo "- Customer-group differences, inventory fields, and variation-level document metadata"
  echo "- Products missing from Legacy and all price differences outside the approved ETA source list"
} > "$OUTPUT_DIR/summary.md"

find "$OUTPUT_DIR" -type f -exec chmod 600 {} +
echo "Rehearsal package complete: $OUTPUT_DIR"