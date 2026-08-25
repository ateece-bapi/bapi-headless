#!/usr/bin/env bash

set -Eeuo pipefail

LABEL=""
WP_PATH=""
OUTPUT_ROOT="migration-inventory"

usage() {
  cat <<'EOF'
Usage: inventory-wordpress-migration.sh --label <legacy|headless> --path <wordpress-path> [--output-dir <directory>]

Creates a read-only WordPress migration inventory. No database values containing passwords,
tokens, 2FA secrets, favorite contents, or email addresses are exported.
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
OUTPUT_DIR="$OUTPUT_ROOT/${SAFE_LABEL}-${TIMESTAMP}"
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

option_presence() {
  local option_name="$1"
  if "${WP[@]}" option get "$option_name" --format=json >/dev/null 2>&1; then
    printf '%s\tpresent\n' "$option_name"
  else
    printf '%s\tabsent\n' "$option_name"
  fi
}

{
  echo "label=$LABEL"
  echo "captured_at_utc=$TIMESTAMP"
  echo "wordpress_path=$WP_PATH"
  echo "site_url=$("${WP[@]}" option get siteurl)"
  echo "home_url=$("${WP[@]}" option get home)"
  echo "wordpress_version=$("${WP[@]}" core version)"
  echo "table_prefix=$TABLE_PREFIX"
  echo "database_size=$("${WP[@]}" db size --size_format=mb 2>/dev/null || echo unavailable)"
  echo "multisite=$("${WP[@]}" core is-installed --network >/dev/null 2>&1 && echo yes || echo no)"
  echo "hpos_enabled=$("${WP[@]}" option get woocommerce_custom_orders_table_enabled 2>/dev/null || echo absent)"
} > "$OUTPUT_DIR/summary.txt"

"${WP[@]}" plugin list --format=csv > "$OUTPUT_DIR/plugins.csv"
"${WP[@]}" plugin list --status=must-use --format=csv > "$OUTPUT_DIR/mu-plugins.csv"
"${WP[@]}" theme list --format=csv > "$OUTPUT_DIR/themes.csv"
"${WP[@]}" db tables --all-tables-with-prefix > "$OUTPUT_DIR/tables.txt"

query "SELECT post_type, post_status, COUNT(*) AS record_count, MIN(post_modified_gmt) AS earliest_modified_gmt, MAX(post_modified_gmt) AS latest_modified_gmt FROM ${TABLE_PREFIX}posts GROUP BY post_type, post_status ORDER BY post_type, post_status;" "post-counts.tsv"
query "SELECT post_type, ID, post_name, post_status, post_modified_gmt FROM ${TABLE_PREFIX}posts WHERE post_type NOT IN ('revision', 'nav_menu_item', 'custom_css', 'customize_changeset') ORDER BY post_type, post_name, ID;" "content-manifest.tsv"
query "SELECT tt.taxonomy, COUNT(DISTINCT tt.term_id) AS term_count, SUM(tt.count) AS relationship_count FROM ${TABLE_PREFIX}term_taxonomy tt GROUP BY tt.taxonomy ORDER BY tt.taxonomy;" "taxonomy-counts.tsv"
query "SELECT tt.taxonomy, t.term_id, t.slug, tt.parent, tt.count FROM ${TABLE_PREFIX}term_taxonomy tt INNER JOIN ${TABLE_PREFIX}terms t ON t.term_id = tt.term_id ORDER BY tt.taxonomy, t.slug, t.term_id;" "taxonomy-manifest.tsv"
query "SELECT p.ID, p.post_type, p.post_parent, p.post_status, p.post_modified_gmt, sku.meta_value AS sku FROM ${TABLE_PREFIX}posts p INNER JOIN ${TABLE_PREFIX}postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku' WHERE p.post_type IN ('product', 'product_variation') ORDER BY sku.meta_value, p.ID;" "product-sku-manifest.tsv"
query "SELECT sku.meta_value AS sku, COUNT(*) AS duplicate_count FROM ${TABLE_PREFIX}posts p INNER JOIN ${TABLE_PREFIX}postmeta sku ON sku.post_id = p.ID AND sku.meta_key = '_sku' WHERE p.post_type IN ('product', 'product_variation') AND sku.meta_value <> '' GROUP BY sku.meta_value HAVING COUNT(*) > 1 ORDER BY duplicate_count DESC, sku.meta_value;" "duplicate-skus.tsv"
query "SELECT ID AS user_id, SHA2(LOWER(TRIM(user_email)), 256) AS email_sha256, user_registered FROM ${TABLE_PREFIX}users ORDER BY email_sha256, ID;" "user-hash-manifest.tsv"
query "SELECT meta_key, COUNT(*) AS record_count, COUNT(DISTINCT user_id) AS user_count FROM ${TABLE_PREFIX}usermeta WHERE meta_key = 'bapi_favorites' OR meta_key = 'session_tokens' OR meta_key LIKE 'two_factor_%' GROUP BY meta_key ORDER BY meta_key;" "protected-usermeta-counts.tsv"
query "SELECT post_type, post_status, COUNT(*) AS order_count, MIN(post_date_gmt) AS earliest_gmt, MAX(post_date_gmt) AS latest_gmt FROM ${TABLE_PREFIX}posts WHERE post_type IN ('shop_order', 'shop_order_refund') GROUP BY post_type, post_status ORDER BY post_type, post_status;" "legacy-order-counts.tsv"

if "${WP[@]}" db query "SHOW TABLES LIKE '${TABLE_PREFIX}wc_orders';" --skip-column-names | grep -q .; then
  query "SELECT type, status, COUNT(*) AS order_count, MIN(date_created_gmt) AS earliest_gmt, MAX(date_created_gmt) AS latest_gmt FROM ${TABLE_PREFIX}wc_orders GROUP BY type, status ORDER BY type, status;" "hpos-order-counts.tsv"
else
  printf 'HPOS orders table not present\n' > "$OUTPUT_DIR/hpos-order-counts.tsv"
fi

{
  option_presence graphql_general_settings
  option_presence woocommerce_custom_orders_table_enabled
  option_presence woocommerce_feature_custom_order_tables_enabled
  option_presence permalink_structure
  option_presence wposes_settings
  option_presence redis_cache
} > "$OUTPUT_DIR/option-presence.tsv"

find "$WP_PATH/wp-content/uploads" -type f -printf '%P\t%s\t%TY-%Tm-%TdT%TH:%TM:%TSZ\n' \
  | LC_ALL=C sort > "$OUTPUT_DIR/uploads-manifest.tsv"

find "$OUTPUT_DIR" -type f -exec chmod 600 {} +

echo "Inventory complete: $OUTPUT_DIR"
echo "Review summary.txt first. Transfer this directory only through an approved secure channel."