#!/usr/bin/env bash

set -Eeuo pipefail

LABEL=""
WP_PATH=""
OUTPUT_ROOT="migration-inventory"
SINCE_DATE="2025-11-01 00:00:00"

usage() {
  cat <<'EOF'
Usage: scan-wordpress-approved-deltas.sh \
  --label <site-label> \
  --path <wordpress-path> \
  [--since <YYYY-MM-DD HH:MM:SS>] \
  [--output-dir <directory>]

Creates read-only reports for the explicitly approved migration surfaces:
- hashes of price, inventory, customer-group, and product-document fields keyed by SKU/slug
- classic WooCommerce order/user relationships with SHA-256 billing-email hashes
- SHA-256 hashes for media referenced by product_documents

Raw prices, stock values, customer groups, billing emails, and document metadata are not exported.
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
    --since)
      SINCE_DATE="${2:-}"
      shift 2
      ;;
    --output-dir)
      OUTPUT_ROOT="${2:-}"
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

if [[ -z "$LABEL" || -z "$WP_PATH" ]]; then
  echo "ERROR: --label and --path are required." >&2
  usage >&2
  exit 2
fi

if [[ ! "$SINCE_DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}([[:space:]][0-9]{2}:[0-9]{2}:[0-9]{2})?$ ]]; then
  echo "ERROR: --since must use YYYY-MM-DD or YYYY-MM-DD HH:MM:SS." >&2
  exit 2
fi

if ! command -v wp >/dev/null 2>&1; then
  echo "ERROR: wp was not found in PATH." >&2
  exit 1
fi

if ! command -v sha256sum >/dev/null 2>&1; then
  echo "ERROR: sha256sum was not found in PATH." >&2
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
OUTPUT_DIR="$OUTPUT_ROOT/${SAFE_LABEL}-approved-deltas-${TIMESTAMP}"
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
  "${WP[@]}" db query "SET SESSION group_concat_max_len = 1048576;" --batch --raw >/dev/null
  "${WP[@]}" db query "$sql" --batch --raw > "$OUTPUT_DIR/$destination"
}

# Record keys intentionally include post type, SKU, and slug. SKU alone is not unique in this data.
# Hashes remain separate so an approved importer can update one field family without copying all meta.
query "
SELECT
  p.post_type,
  sku.meta_value AS sku,
  p.post_name AS slug,
  COALESCE(parent_sku.meta_value, '') AS parent_sku,
  p.post_status,
  p.post_modified_gmt,
  SHA2(COALESCE((
    SELECT GROUP_CONCAT(CONCAT(pm.meta_key, '=', pm.meta_value) ORDER BY pm.meta_key, pm.meta_id SEPARATOR '|')
    FROM ${TABLE_PREFIX}postmeta pm
    WHERE pm.post_id = p.ID
      AND pm.meta_key IN ('_price', '_regular_price', '_sale_price', '_sale_price_dates_from', '_sale_price_dates_to')
  ), ''), 256) AS price_hash,
  SHA2(COALESCE((
    SELECT GROUP_CONCAT(CONCAT(pm.meta_key, '=', pm.meta_value) ORDER BY pm.meta_key, pm.meta_id SEPARATOR '|')
    FROM ${TABLE_PREFIX}postmeta pm
    WHERE pm.post_id = p.ID
      AND pm.meta_key IN ('_manage_stock', '_stock', '_stock_status', '_backorders', '_sold_individually')
  ), ''), 256) AS inventory_hash,
  SHA2(COALESCE((
    SELECT GROUP_CONCAT(CONCAT(pm.meta_key, '=', pm.meta_value) ORDER BY pm.meta_key, pm.meta_id SEPARATOR '|')
    FROM ${TABLE_PREFIX}postmeta pm
    WHERE pm.post_id = p.ID
      AND pm.meta_key IN ('customer_group1', 'customer_group2', 'customer_group3')
  ), ''), 256) AS customer_group_hash,
  SHA2(COALESCE((
    SELECT GROUP_CONCAT(
      CONCAT(
        pm.meta_key,
        '=',
        CASE
          WHEN pm.meta_key REGEXP '^product_documents_[0-9]+_document_file_repeater_[0-9]+_document_file$'
            THEN COALESCE(attached.meta_value, CONCAT('[missing-attachment:', pm.meta_value, ']'))
          ELSE pm.meta_value
        END
      )
      ORDER BY pm.meta_key, pm.meta_id SEPARATOR '|'
    )
    FROM ${TABLE_PREFIX}postmeta pm
    LEFT JOIN ${TABLE_PREFIX}postmeta attached
      ON attached.post_id = CAST(pm.meta_value AS UNSIGNED)
      AND attached.meta_key = '_wp_attached_file'
    WHERE pm.post_id = p.ID
      AND (pm.meta_key = 'product_documents' OR pm.meta_key LIKE 'product_documents\\_%')
  ), ''), 256) AS product_documents_hash
FROM ${TABLE_PREFIX}posts p
INNER JOIN ${TABLE_PREFIX}postmeta sku
  ON sku.post_id = p.ID AND sku.meta_key = '_sku'
LEFT JOIN ${TABLE_PREFIX}postmeta parent_sku
  ON parent_sku.post_id = p.post_parent AND parent_sku.meta_key = '_sku'
WHERE p.post_type IN ('product', 'product_variation')
  AND sku.meta_value <> ''
ORDER BY sku.meta_value, p.post_type, p.post_name, p.ID;
" "catalog-field-hashes.tsv"

# Classic WooCommerce order report. The numeric ID is provenance for this shared database lineage;
# order_key_hash is the comparison key and billing identities remain one-way hashes.
query "
SELECT
  o.ID AS source_order_id,
  SHA2(COALESCE(order_key.meta_value, CONCAT('legacy-id:', o.ID)), 256) AS order_key_hash,
  o.post_type,
  o.post_status,
  o.post_date_gmt,
  o.post_modified_gmt,
  o.post_author AS source_user_id,
  CASE
    WHEN billing_email.meta_value IS NULL OR TRIM(billing_email.meta_value) = '' THEN ''
    ELSE SHA2(LOWER(TRIM(billing_email.meta_value)), 256)
  END AS billing_email_hash,
  CASE WHEN u.ID IS NULL THEN 0 ELSE 1 END AS source_user_exists
FROM ${TABLE_PREFIX}posts o
LEFT JOIN ${TABLE_PREFIX}postmeta order_key
  ON order_key.post_id = o.ID AND order_key.meta_key = '_order_key'
LEFT JOIN ${TABLE_PREFIX}postmeta billing_email
  ON billing_email.post_id = o.ID AND billing_email.meta_key = '_billing_email'
LEFT JOIN ${TABLE_PREFIX}users u ON u.ID = o.post_author
WHERE o.post_type IN ('shop_order', 'shop_order_refund')
  AND (o.post_date_gmt >= '${SINCE_DATE}' OR o.post_modified_gmt >= '${SINCE_DATE}')
ORDER BY o.post_date_gmt, o.ID;
" "order-user-relationships.tsv"

query "
SELECT
  p.ID AS product_source_id,
  COALESCE(sku.meta_value, '') AS sku,
  p.post_name AS product_slug,
  attachment.ID AS attachment_source_id,
  attached.meta_value AS upload_path,
  attachment.post_mime_type,
  attachment.post_modified_gmt
FROM ${TABLE_PREFIX}posts p
LEFT JOIN ${TABLE_PREFIX}postmeta sku
  ON sku.post_id = p.ID AND sku.meta_key = '_sku'
INNER JOIN ${TABLE_PREFIX}postmeta document_ref
  ON document_ref.post_id = p.ID
  AND document_ref.meta_key REGEXP '^product_documents_[0-9]+_document_file_repeater_[0-9]+_document_file$'
INNER JOIN ${TABLE_PREFIX}posts attachment
  ON attachment.ID = CAST(document_ref.meta_value AS UNSIGNED)
  AND attachment.post_type = 'attachment'
INNER JOIN ${TABLE_PREFIX}postmeta attached
  ON attached.post_id = attachment.ID
  AND attached.meta_key = '_wp_attached_file'
WHERE p.post_type IN ('product', 'product_variation')
ORDER BY sku.meta_value, attached.meta_value, attachment.ID;
" "referenced-product-media.tsv"

# Export only the allowlisted parent-product ACF rows. Attachment IDs are normalized to upload
# paths and values are hex-encoded so tabs/newlines cannot corrupt the TSV transport format.
query "
SELECT
  p.post_name AS product_slug,
  pm.meta_key,
  HEX(
    CASE
      WHEN pm.meta_key REGEXP '^product_documents_[0-9]+_document_file_repeater_[0-9]+_document_file$'
        THEN COALESCE(attached.meta_value, '')
      ELSE pm.meta_value
    END
  ) AS normalized_value_hex
FROM ${TABLE_PREFIX}posts p
INNER JOIN ${TABLE_PREFIX}postmeta pm
  ON pm.post_id = p.ID
LEFT JOIN ${TABLE_PREFIX}postmeta attached
  ON attached.post_id = CAST(pm.meta_value AS UNSIGNED)
  AND attached.meta_key = '_wp_attached_file'
WHERE p.post_type = 'product'
  AND p.post_name <> ''
  AND (
    pm.meta_key = 'product_documents'
    OR pm.meta_key LIKE 'product_documents\\_%'
    OR pm.meta_key = '_product_documents'
    OR pm.meta_key LIKE '_product_documents\\_%'
  )
ORDER BY p.post_name, pm.meta_key, pm.meta_id;
" "product-document-metadata.tsv"

# A separate relational view supports additive mapping. Only resolved attachment paths are emitted;
# stale or blank source attachment IDs are rejected by omission and existing target rows are kept.
query "
SELECT DISTINCT
  p.post_name AS product_slug,
  HEX(heading.meta_value) AS document_heading_hex,
  HEX(attached.meta_value) AS upload_path_hex
FROM ${TABLE_PREFIX}posts p
INNER JOIN ${TABLE_PREFIX}postmeta document_ref
  ON document_ref.post_id = p.ID
  AND document_ref.meta_key REGEXP '^product_documents_[0-9]+_document_file_repeater_[0-9]+_document_file$'
INNER JOIN ${TABLE_PREFIX}postmeta heading
  ON heading.post_id = p.ID
  AND heading.meta_key = CONCAT(
    SUBSTRING_INDEX(document_ref.meta_key, '_document_file_repeater_', 1),
    '_document_heading'
  )
INNER JOIN ${TABLE_PREFIX}posts attachment
  ON attachment.ID = CAST(document_ref.meta_value AS UNSIGNED)
  AND attachment.post_type = 'attachment'
INNER JOIN ${TABLE_PREFIX}postmeta attached
  ON attached.post_id = attachment.ID
  AND attached.meta_key = '_wp_attached_file'
WHERE p.post_type = 'product'
  AND p.post_name <> ''
ORDER BY p.post_name, heading.meta_value, attached.meta_value;
" "product-document-resolved-pairs.tsv"

{
  printf 'upload_path\tbytes\tsha256\tstatus\n'
  tail -n +2 "$OUTPUT_DIR/referenced-product-media.tsv" \
    | cut -f5 \
    | LC_ALL=C sort -u \
    | while IFS= read -r upload_path; do
        [[ -z "$upload_path" ]] && continue
        media_file="$WP_PATH/wp-content/uploads/$upload_path"
        if [[ -f "$media_file" ]]; then
          bytes=$(stat -c '%s' "$media_file")
          checksum=$(sha256sum "$media_file" | cut -d ' ' -f1)
          printf '%s\t%s\t%s\tpresent\n' "$upload_path" "$bytes" "$checksum"
        else
          printf '%s\t0\t\tmissing\n' "$upload_path"
        fi
      done
} > "$OUTPUT_DIR/referenced-product-media-hashes.tsv"

{
  echo "label=$LABEL"
  echo "captured_at_utc=$TIMESTAMP"
  echo "wordpress_path=$WP_PATH"
  echo "since=$SINCE_DATE"
  echo "catalog_records=$(awk -F '\t' 'NR > 1 && $2 != "" { count++ } END { print count+0 }' "$OUTPUT_DIR/catalog-field-hashes.tsv")"
  echo "delta_orders=$(awk -F '\t' 'NR > 1 && $2 != "" { count++ } END { print count+0 }' "$OUTPUT_DIR/order-user-relationships.tsv")"
  echo "product_media_references=$(awk -F '\t' 'NR > 1 && $2 != "" { count++ } END { print count+0 }' "$OUTPUT_DIR/referenced-product-media.tsv")"
  echo "unique_referenced_media=$(awk -F '\t' 'NR > 1 && $1 != "" { count++ } END { print count+0 }' "$OUTPUT_DIR/referenced-product-media-hashes.tsv")"
  echo "missing_referenced_media=$(awk -F '\t' 'NR > 1 && $4 == "missing" { count++ } END { print count+0 }' "$OUTPUT_DIR/referenced-product-media-hashes.tsv")"
} > "$OUTPUT_DIR/summary.txt"

find "$OUTPUT_DIR" -type f -exec chmod 600 {} +

echo "Approved-delta scan complete: $OUTPUT_DIR"
echo "Reports contain hashes and provenance only; no migration writes were performed."