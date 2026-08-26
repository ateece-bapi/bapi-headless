<?php
/**
 * Inventory metadata keys for an exact Legacy WooCommerce order manifest.
 *
 * Values, order IDs, customer identifiers, and metadata samples are never exported.
 *
 * Usage:
 *   wp eval-file inventory-wordpress-order-metadata.php \
 *     /secure/order-dry-run.tsv /secure/order-metadata-inventory \
 *     --path=/path/to/legacy-wordpress
 */

if (!defined('ABSPATH') || !class_exists('WP_CLI')) {
    fwrite(STDERR, "ERROR: Run this file with wp eval-file.\n");
    exit(1);
}

const BAPI_ORDER_METADATA_INVENTORY_SCHEMA = 1;

function bapi_order_metadata_fail(string $message): void
{
    WP_CLI::error($message);
}

function bapi_order_metadata_assert_source(): void
{
    $allowed_hosts = ['bapihvac.com', 'www.bapihvac.com'];
    foreach ([(string) get_option('siteurl'), (string) get_option('home')] as $url) {
        $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
        if (!in_array($host, $allowed_hosts, true)) {
            bapi_order_metadata_fail("Refusing non-Legacy source URL: {$url}");
        }
    }
    if (!function_exists('wc_get_order')) {
        bapi_order_metadata_fail('WooCommerce is not loaded. Do not use --skip-plugins.');
    }
    if (
        class_exists('Automattic\\WooCommerce\\Utilities\\OrderUtil') &&
        Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled()
    ) {
        bapi_order_metadata_fail('HPOS is enabled; this inventory requires rehearsed classic order storage.');
    }
}

/**
 * @return array{hashes: string[], sha256: string}
 */
function bapi_order_metadata_read_manifest(string $manifest_path): array
{
    $resolved_path = realpath($manifest_path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_order_metadata_fail("Order manifest is not readable: {$manifest_path}");
    }

    $contents = file_get_contents($resolved_path);
    if (!is_string($contents)) {
        bapi_order_metadata_fail("Unable to open order manifest: {$resolved_path}");
    }
    $handle = fopen('php://temp', 'w+b');
    if ($handle === false || fwrite($handle, $contents) !== strlen($contents) || !rewind($handle)) {
        bapi_order_metadata_fail('Unable to stage the exact order manifest bytes for parsing.');
    }
    $headers = fgetcsv($handle, 0, "\t");
    $required_headers = [
        'order_key_hash',
        'post_type',
        'status',
        'created_gmt',
        'modified_gmt',
        'billing_email_hash',
        'account_resolution',
    ];
    if ($headers !== $required_headers) {
        fclose($handle);
        bapi_order_metadata_fail('Order manifest does not have the required column set.');
    }

    $hashes = [];
    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        if ($values === [null] || $values === []) {
            continue;
        }
        if (count($values) !== count($headers)) {
            fclose($handle);
            bapi_order_metadata_fail('Order manifest contains a malformed row.');
        }
        $row = array_combine($headers, $values);
        $order_key_hash = is_array($row) ? ($row['order_key_hash'] ?? '') : '';
        if (
            !is_string($order_key_hash) ||
            preg_match('/^[a-f0-9]{64}$/', $order_key_hash) !== 1 ||
            isset($hashes[$order_key_hash]) ||
            $row['post_type'] !== 'shop_order'
        ) {
            fclose($handle);
            bapi_order_metadata_fail('Order manifest contains a malformed, duplicate, or unsupported order row.');
        }
        $hashes[$order_key_hash] = true;
    }
    fclose($handle);

    if ($hashes === []) {
        bapi_order_metadata_fail('Order manifest contains no orders.');
    }
    return [
        'hashes' => array_keys($hashes),
        'sha256' => hash('sha256', $contents),
    ];
}

/**
 * @param string[] $order_key_hashes
 * @return int[]
 */
function bapi_order_metadata_resolve_ids(array $order_key_hashes): array
{
    global $wpdb;

    $matches_by_hash = array_fill_keys($order_key_hashes, []);
    foreach (array_chunk($order_key_hashes, 250) as $hash_chunk) {
        $placeholders = implode(',', array_fill(0, count($hash_chunk), '%s'));
        $hash_expression = "SHA2(COALESCE(order_key.meta_value, CONCAT('legacy-id:', posts.ID)), 256)";
        $query = $wpdb->prepare(
            "SELECT posts.ID, {$hash_expression} AS order_key_hash
             FROM {$wpdb->posts} posts
             LEFT JOIN {$wpdb->postmeta} order_key
               ON order_key.post_id = posts.ID AND order_key.meta_key = '_order_key'
             WHERE posts.post_type = 'shop_order'
               AND {$hash_expression} IN ({$placeholders})
             ORDER BY posts.ID",
            ...$hash_chunk
        );
        $rows = $wpdb->get_results($query, ARRAY_A);
        if ($wpdb->last_error !== '' || !is_array($rows)) {
            bapi_order_metadata_fail('Database error while resolving the order manifest.');
        }
        foreach ($rows as $row) {
            $order_key_hash = (string) ($row['order_key_hash'] ?? '');
            if (!array_key_exists($order_key_hash, $matches_by_hash)) {
                bapi_order_metadata_fail('Order resolution returned an unexpected manifest key.');
            }
            $order_id = (int) ($row['ID'] ?? 0);
            $matches_by_hash[$order_key_hash][$order_id] = $order_id;
        }
    }

    $order_ids = [];
    $seen_ids = [];
    foreach ($order_key_hashes as $order_key_hash) {
        $matches = array_values($matches_by_hash[$order_key_hash]);
        if (count($matches) !== 1) {
            bapi_order_metadata_fail(
                "Order manifest key does not resolve uniquely: {$order_key_hash}; matches=" . count($matches)
            );
        }
        $id = $matches[0];
        if (isset($seen_ids[$id])) {
            bapi_order_metadata_fail('Multiple manifest keys resolve to the same source order.');
        }
        $seen_ids[$id] = true;
        $order_ids[] = $id;
    }
    return $order_ids;
}

function bapi_order_metadata_assert_schema_label(string $value, string $context): void
{
    if ($context === 'order-item metadata key' && $value === 'Package 1') {
        return;
    }
    if (
        preg_match('/^_?[A-Za-z][A-Za-z0-9_.:-]{0,190}$/', $value) !== 1 ||
        preg_match('/\d{6,}|[a-f0-9]{16,}/i', $value) === 1
    ) {
        bapi_order_metadata_fail("Potentially dynamic or identifying {$context} rejected from key-only output.");
    }
}

function bapi_order_metadata_classify_order_key(string $meta_key): string
{
    $represented = [
        '_order_key', '_customer_user', '_order_currency', '_prices_include_tax',
        '_date_paid', '_date_completed', '_payment_method', '_payment_method_title',
        '_billing_first_name', '_billing_last_name', '_billing_company', '_billing_address_1',
        '_billing_address_2', '_billing_city', '_billing_state', '_billing_postcode',
        '_billing_country', '_billing_email', '_billing_phone', '_shipping_first_name',
        '_shipping_last_name', '_shipping_company', '_shipping_address_1', '_shipping_address_2',
        '_shipping_city', '_shipping_state', '_shipping_postcode', '_shipping_country',
        '_cart_discount', '_cart_discount_tax', '_order_shipping', '_order_shipping_tax',
        '_order_tax', '_order_total',
    ];
    $derived = [
        '_created_via', '_cart_hash', '_order_stock_reduced', '_recorded_sales',
        '_download_permissions_granted', '_edit_lock', '_edit_last', '_paid_date',
        '_completed_date',
    ];
    $sensitive = ['_customer_ip_address', '_customer_user_agent', '_transaction_id'];

    if (in_array($meta_key, $represented, true)) {
        return $meta_key === '_order_key' ? 'source-identity' : 'represented-fixed-field';
    }
    if (in_array($meta_key, $derived, true)) {
        return 'derived-do-not-transfer';
    }
    if (in_array($meta_key, $sensitive, true)) {
        return 'sensitive-do-not-transfer';
    }
    if (preg_match('/(?:wpb|visual.?composer|vc_|revslider|gateway|stripe|paypal|authorize|plugin)/i', $meta_key)) {
        return 'plugin-pattern-review';
    }
    return 'review-required';
}

function bapi_order_metadata_classify_item_key(string $meta_key): string
{
    $represented = [
        '_qty', '_tax_class', '_line_subtotal', '_line_subtotal_tax', '_line_total',
        '_line_tax', '_line_tax_data', 'method_id', 'instance_id', 'cost', 'taxes',
        '_fee_amount', '_tax_status', 'discount_amount', 'discount_amount_tax', 'rate_id',
        'label', 'compound', 'tax_amount', 'shipping_tax_amount', 'rate_percent',
    ];
    if (in_array($meta_key, ['_product_id', '_variation_id'], true)) {
        return 'source-id-do-not-transfer';
    }
    if (in_array($meta_key, $represented, true)) {
        return 'represented-fixed-field';
    }
    if (preg_match('/(?:wpb|visual.?composer|vc_|revslider|gateway|stripe|paypal|authorize|plugin)/i', $meta_key)) {
        return 'plugin-pattern-review';
    }
    return 'review-required';
}

/**
 * @param resource $handle
 * @param string[] $headers
 * @param array<int, array<string, mixed>> $rows
 */
function bapi_order_metadata_write_tsv($handle, array $headers, array $rows): void
{
    if (fputcsv($handle, $headers, "\t", '"', '\\') === false) {
        bapi_order_metadata_fail('Unable to write inventory header.');
    }
    foreach ($rows as $row) {
        if (fputcsv($handle, array_values($row), "\t", '"', '\\') === false) {
            bapi_order_metadata_fail('Unable to write inventory row.');
        }
    }
}

$manifest_path = $args[0] ?? '';
$output_dir = $args[1] ?? '';
if ($manifest_path === '' || $output_dir === '') {
    bapi_order_metadata_fail(
        'Usage: wp eval-file inventory-wordpress-order-metadata.php ' .
        '<order-dry-run.tsv> <new-output-directory> --path=<legacy-wordpress-path>'
    );
}

bapi_order_metadata_assert_source();
$manifest = bapi_order_metadata_read_manifest($manifest_path);
$order_key_hashes = $manifest['hashes'];
$order_ids = bapi_order_metadata_resolve_ids($order_key_hashes);

$output_parent = realpath(dirname($output_dir));
if ($output_parent === false || !is_dir($output_parent)) {
    bapi_order_metadata_fail('Output parent directory must exist.');
}
$output_name = basename($output_dir);
if ($output_name === '' || $output_name === '.' || $output_name === '..') {
    bapi_order_metadata_fail('Output directory must have a safe final path component.');
}
$output_path = $output_parent . '/' . $output_name;
if (file_exists($output_path) || is_link($output_path)) {
    bapi_order_metadata_fail('Canonical output directory must not already exist.');
}
if (!mkdir($output_path, 0700)) {
    bapi_order_metadata_fail('Unable to create output directory.');
}
$cleanup_output = true;
register_shutdown_function(
    static function () use (&$cleanup_output, $output_path): void {
        if (!$cleanup_output || !is_dir($output_path)) {
            return;
        }
        foreach (['order-meta-keys.tsv', 'order-item-meta-keys.tsv', 'summary.json'] as $output_file) {
            $file_path = $output_path . '/' . $output_file;
            @unlink($file_path);
        }
        @rmdir($output_path);
    }
);
if (!chmod($output_path, 0700)) {
    bapi_order_metadata_fail('Unable to restrict output directory permissions.');
}

global $wpdb;
$order_totals = [];
$item_totals = [];
foreach (array_chunk($order_ids, 250) as $id_chunk) {
    $ids_sql = implode(',', array_map('intval', $id_chunk));
    $blank_order_key_count = $wpdb->get_var(
        "SELECT COUNT(*)
         FROM {$wpdb->postmeta}
         WHERE post_id IN ({$ids_sql}) AND (meta_key IS NULL OR meta_key = '')"
    );
    if ($wpdb->last_error !== '' || !is_numeric($blank_order_key_count)) {
        bapi_order_metadata_fail('Database error while checking blank order metadata keys.');
    }
    if ((int) $blank_order_key_count !== 0) {
        bapi_order_metadata_fail('Selected orders contain blank metadata keys.');
    }
    $blank_item_key_count = $wpdb->get_var(
        "SELECT COUNT(*)
         FROM {$wpdb->prefix}woocommerce_order_items items
         INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta itemmeta
           ON itemmeta.order_item_id = items.order_item_id
         WHERE items.order_id IN ({$ids_sql}) AND (itemmeta.meta_key IS NULL OR itemmeta.meta_key = '')"
    );
    if ($wpdb->last_error !== '' || !is_numeric($blank_item_key_count)) {
        bapi_order_metadata_fail('Database error while checking blank order-item metadata keys.');
    }
    if ((int) $blank_item_key_count !== 0) {
        bapi_order_metadata_fail('Selected order items contain blank metadata keys.');
    }
    $order_chunk_rows = $wpdb->get_results(
        "SELECT meta_key, COUNT(*) AS row_count, COUNT(DISTINCT post_id) AS order_count
         FROM {$wpdb->postmeta}
         WHERE post_id IN ({$ids_sql}) AND meta_key <> ''
         GROUP BY meta_key",
        ARRAY_A
    );
    if ($wpdb->last_error !== '' || !is_array($order_chunk_rows)) {
        bapi_order_metadata_fail('Database error while aggregating order metadata keys.');
    }
    foreach ($order_chunk_rows as $row) {
        $meta_key = (string) $row['meta_key'];
        $order_totals[$meta_key]['row_count'] = ($order_totals[$meta_key]['row_count'] ?? 0) + (int) $row['row_count'];
        $order_totals[$meta_key]['order_count'] = ($order_totals[$meta_key]['order_count'] ?? 0) + (int) $row['order_count'];
    }
    $item_chunk_rows = $wpdb->get_results(
        "SELECT items.order_item_type, itemmeta.meta_key, COUNT(*) AS row_count,
                COUNT(DISTINCT itemmeta.order_item_id) AS item_count,
                COUNT(DISTINCT items.order_id) AS order_count
         FROM {$wpdb->prefix}woocommerce_order_items items
         INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta itemmeta
           ON itemmeta.order_item_id = items.order_item_id
         WHERE items.order_id IN ({$ids_sql}) AND itemmeta.meta_key <> ''
         GROUP BY items.order_item_type, itemmeta.meta_key",
        ARRAY_A
    );
    if ($wpdb->last_error !== '' || !is_array($item_chunk_rows)) {
        bapi_order_metadata_fail('Database error while aggregating order-item metadata keys.');
    }
    foreach ($item_chunk_rows as $row) {
        $item_key = (string) $row['order_item_type'] . "\0" . (string) $row['meta_key'];
        $item_totals[$item_key]['order_item_type'] = (string) $row['order_item_type'];
        $item_totals[$item_key]['meta_key'] = (string) $row['meta_key'];
        foreach (['row_count', 'item_count', 'order_count'] as $count_key) {
            $item_totals[$item_key][$count_key] = ($item_totals[$item_key][$count_key] ?? 0) + (int) $row[$count_key];
        }
    }
}
ksort($order_totals);
$order_rows = [];
foreach ($order_totals as $meta_key => $counts) {
    $order_rows[] = ['meta_key' => $meta_key] + $counts;
}
ksort($item_totals);
$item_rows = array_values($item_totals);

$order_review_count = 0;
foreach ($order_rows as &$row) {
    bapi_order_metadata_assert_schema_label((string) $row['meta_key'], 'order metadata key');
    $row['classification'] = bapi_order_metadata_classify_order_key((string) $row['meta_key']);
    if (str_contains($row['classification'], 'review')) {
        $order_review_count++;
    }
}
unset($row);
$item_review_count = 0;
foreach ($item_rows as &$row) {
    bapi_order_metadata_assert_schema_label((string) $row['order_item_type'], 'order item type');
    bapi_order_metadata_assert_schema_label((string) $row['meta_key'], 'order-item metadata key');
    $row['classification'] = bapi_order_metadata_classify_item_key((string) $row['meta_key']);
    if (str_contains($row['classification'], 'review')) {
        $item_review_count++;
    }
}
unset($row);

$order_file = fopen($output_path . '/order-meta-keys.tsv', 'xb');
$item_file = fopen($output_path . '/order-item-meta-keys.tsv', 'xb');
if ($order_file === false || $item_file === false) {
    bapi_order_metadata_fail('Unable to create metadata inventory files.');
}
bapi_order_metadata_write_tsv(
    $order_file,
    ['meta_key', 'row_count', 'order_count', 'classification'],
    $order_rows
);
bapi_order_metadata_write_tsv(
    $item_file,
    ['order_item_type', 'meta_key', 'row_count', 'item_count', 'order_count', 'classification'],
    $item_rows
);
if (!fclose($order_file) || !fclose($item_file)) {
    bapi_order_metadata_fail('Unable to finalize metadata inventory files.');
}

$summary = [
    'schema_version' => BAPI_ORDER_METADATA_INVENTORY_SCHEMA,
    'generated_at_utc' => gmdate('Y-m-d\TH:i:s\Z'),
    'source_hosts' => [
        strtolower((string) wp_parse_url((string) get_option('siteurl'), PHP_URL_HOST)),
        strtolower((string) wp_parse_url((string) get_option('home'), PHP_URL_HOST)),
    ],
    'storage' => 'classic',
    'manifest_sha256' => $manifest['sha256'],
    'manifest_order_count' => count($order_key_hashes),
    'resolved_order_count' => count($order_ids),
    'order_meta_key_count' => count($order_rows),
    'order_item_meta_key_count' => count($item_rows),
    'order_meta_review_key_count' => $order_review_count,
    'order_item_meta_review_key_count' => $item_review_count,
    'contains_metadata_values' => false,
    'contains_order_ids' => false,
    'report_sensitivity' => 'restricted-schema-inventory',
];
$summary_json = wp_json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if (!is_string($summary_json)) {
    bapi_order_metadata_fail('Unable to write metadata inventory summary.');
}
$summary_file = fopen($output_path . '/summary.json', 'xb');
if (
    $summary_file === false ||
    fwrite($summary_file, $summary_json . "\n") === false ||
    !fclose($summary_file)
) {
    bapi_order_metadata_fail('Unable to write metadata inventory summary.');
}
foreach (['order-meta-keys.tsv', 'order-item-meta-keys.tsv', 'summary.json'] as $output_file) {
    if (!chmod($output_path . '/' . $output_file, 0600)) {
        bapi_order_metadata_fail("Unable to restrict output permissions: {$output_file}");
    }
}
$cleanup_output = false;
WP_CLI::log('summary\t' . wp_json_encode($summary));
WP_CLI::success('Order metadata key inventory complete; no WordPress writes were performed.');
