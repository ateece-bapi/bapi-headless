<?php
/**
 * Export approved classic WooCommerce orders from Legacy as permission-restricted JSONL.
 *
 * Usage:
 *   wp eval-file export-wordpress-rehearsal-orders.php \
 *     /secure/order-dry-run.tsv /secure/orders.jsonl --path=/path/to/legacy-wordpress
 */

if (!defined('ABSPATH') || !class_exists('WP_CLI')) {
    fwrite(STDERR, "ERROR: Run this file with wp eval-file.\n");
    exit(1);
}

require_once __DIR__ . '/wordpress-order-metadata-policy.php';

if (!defined('BAPI_ORDER_EXPORT_SCHEMA')) {
    define('BAPI_ORDER_EXPORT_SCHEMA', 1);
}
if (!defined('BAPI_ORDER_EXPORT_POLICY_SHA256')) {
    define('BAPI_ORDER_EXPORT_POLICY_SHA256', 'bf835b6166f6df76110fdd91a62175a422cea1e63584b19f03ee22a0df385470');
}

function bapi_order_export_fail(string $message): void
{
    WP_CLI::error($message);
}

function bapi_order_export_assert_source(): void
{
    $allowed_hosts = ['bapihvac.com', 'www.bapihvac.com'];
    foreach ([(string) get_option('siteurl'), (string) get_option('home')] as $url) {
        $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
        if (!in_array($host, $allowed_hosts, true)) {
            bapi_order_export_fail("Refusing non-Legacy source URL: {$url}");
        }
    }
    if (!function_exists('wc_get_order')) {
        bapi_order_export_fail('WooCommerce is not loaded. Do not use --skip-plugins.');
    }
}

/**
 * @return array{rows: array<int, array<string, string>>, policy: array<string, mixed>}
 */
function bapi_order_export_read_manifest(string $manifest_path): array
{
    $resolved_path = realpath($manifest_path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_order_export_fail("Order manifest is not readable: {$manifest_path}");
    }

    $policy_path = dirname($resolved_path) . '/approved-policy.json';
    if (!is_readable($policy_path) || hash_file('sha256', $policy_path) !== BAPI_ORDER_EXPORT_POLICY_SHA256) {
        bapi_order_export_fail('Approved policy beside the order manifest is absent or modified.');
    }
    $policy = json_decode((string) file_get_contents($policy_path), true);
    $expected_schema = BAPI_ORDER_EXPORT_SCHEMA >= 2 ? 2 : 1;
    if (
        !is_array($policy) ||
        ($policy['schemaVersion'] ?? null) !== $expected_schema ||
        !isset($policy['orders']) ||
        !is_array($policy['orders'])
    ) {
        bapi_order_export_fail('Approved order policy is malformed or has an unsupported schema or count.');
    }
    $approved_candidate_count = $policy['orders']['approvedCandidateCount'] ?? null;
    if (
        !is_int($approved_candidate_count) ||
        $approved_candidate_count < 1
    ) {
        bapi_order_export_fail('Approved order policy is malformed or has an unsupported schema or count.');
    }
    $approved_manifest_hash = $policy['orders']['manifestSha256'] ?? null;
    if (
        !is_string($approved_manifest_hash) ||
        !preg_match('/^[a-f0-9]{64}$/', $approved_manifest_hash) ||
        hash_file('sha256', $resolved_path) !== $approved_manifest_hash
    ) {
        bapi_order_export_fail('Order manifest SHA-256 does not match the reviewed fresh manifest.');
    }

    $handle = fopen($resolved_path, 'rb');
    if ($handle === false) {
        bapi_order_export_fail("Unable to open order manifest: {$resolved_path}");
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
    if (BAPI_ORDER_EXPORT_SCHEMA >= 2) {
        $required_headers[] = 'source_state_hash';
    }
    if ($headers !== $required_headers) {
        fclose($handle);
        bapi_order_export_fail('Order manifest does not have the approved column set.');
    }

    $rows = [];
    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        if ($values === [null] || $values === []) {
            continue;
        }
        if (count($values) !== count($headers)) {
            fclose($handle);
            bapi_order_export_fail('Order manifest contains a malformed row.');
        }
        $row = array_combine($headers, $values);
        if ($row === false) {
            fclose($handle);
            bapi_order_export_fail('Order manifest columns could not be combined.');
        }
        $rows[] = $row;
    }
    fclose($handle);

    if (count($rows) !== $approved_candidate_count) {
        bapi_order_export_fail('Order manifest count does not match the approved policy.');
    }
    return ['rows' => $rows, 'policy' => $policy];
}

/**
 * @return int[]
 */
function bapi_order_export_ids_by_key_hash(string $order_key_hash): array
{
    global $wpdb;

    if (preg_match('/^[a-f0-9]{64}$/', $order_key_hash) !== 1) {
        bapi_order_export_fail("Malformed order-key hash: {$order_key_hash}");
    }
    $query = $wpdb->prepare(
        "SELECT posts.ID
         FROM {$wpdb->posts} posts
         LEFT JOIN {$wpdb->postmeta} order_key
           ON order_key.post_id = posts.ID AND order_key.meta_key = '_order_key'
         WHERE posts.post_type IN ('shop_order', 'shop_order_refund')
           AND SHA2(COALESCE(order_key.meta_value, CONCAT('legacy-id:', posts.ID)), 256) = %s
         ORDER BY posts.ID",
        $order_key_hash
    );
    return array_map('intval', $wpdb->get_col($query));
}

function bapi_order_export_source_state_hash(int $order_id): string
{
        global $wpdb;

    if ($wpdb->query('SET SESSION group_concat_max_len = 1048576') === false) {
        bapi_order_export_fail('Unable to configure source-state hash aggregation.');
    }
        $order_items = $wpdb->prefix . 'woocommerce_order_items';
        $order_itemmeta = $wpdb->prefix . 'woocommerce_order_itemmeta';
        $sql = "SELECT SHA2(CONCAT_WS('|',
                CONCAT('post=', o.ID, ':', o.post_type, ':', o.post_status, ':', o.post_date_gmt, ':', o.post_modified_gmt, ':', o.post_author),
                CONCAT('postmeta=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(pm.meta_id, ':', HEX(pm.meta_key), ':', HEX(pm.meta_value)) ORDER BY pm.meta_id SEPARATOR '|')
                    FROM {$wpdb->postmeta} pm WHERE pm.post_id = o.ID
                ), ''), 256)),
                CONCAT('items=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(oi.order_item_id, ':', HEX(oi.order_item_name), ':', oi.order_item_type) ORDER BY oi.order_item_id SEPARATOR '|')
                    FROM {$order_items} oi WHERE oi.order_id = o.ID
                ), ''), 256)),
                CONCAT('itemmeta=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(oim.meta_id, ':', oim.order_item_id, ':', HEX(oim.meta_key), ':', HEX(oim.meta_value)) ORDER BY oim.meta_id SEPARATOR '|')
                    FROM {$order_itemmeta} oim INNER JOIN {$order_items} oi ON oi.order_item_id = oim.order_item_id
                    WHERE oi.order_id = o.ID
                ), ''), 256)),
                CONCAT('notes=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(c.comment_ID, ':', HEX(c.comment_author), ':', HEX(c.comment_content), ':', c.comment_date_gmt, ':', c.comment_approved, ':', c.comment_type) ORDER BY c.comment_ID SEPARATOR '|')
                    FROM {$wpdb->comments} c WHERE c.comment_post_ID = o.ID AND c.comment_type = 'order_note'
                ), ''), 256)),
                CONCAT('notemeta=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(cm.meta_id, ':', cm.comment_id, ':', HEX(cm.meta_key), ':', HEX(cm.meta_value)) ORDER BY cm.meta_id SEPARATOR '|')
                    FROM {$wpdb->commentmeta} cm INNER JOIN {$wpdb->comments} c ON c.comment_ID = cm.comment_id
                    WHERE c.comment_post_ID = o.ID AND c.comment_type = 'order_note'
                ), ''), 256)),
                CONCAT('line-skus=', SHA2(COALESCE((
                    SELECT GROUP_CONCAT(CONCAT(oi.order_item_id, ':', COALESCE(product_id.meta_value, ''), ':', COALESCE(variation_id.meta_value, ''), ':', HEX(COALESCE(sku.meta_value, ''))) ORDER BY oi.order_item_id SEPARATOR '|')
                    FROM {$order_items} oi
                    LEFT JOIN {$order_itemmeta} product_id ON product_id.order_item_id = oi.order_item_id AND product_id.meta_key = '_product_id'
                    LEFT JOIN {$order_itemmeta} variation_id ON variation_id.order_item_id = oi.order_item_id AND variation_id.meta_key = '_variation_id'
                    LEFT JOIN {$wpdb->postmeta} sku ON sku.post_id = IF(CAST(COALESCE(variation_id.meta_value, '0') AS UNSIGNED) > 0, CAST(variation_id.meta_value AS UNSIGNED), CAST(COALESCE(product_id.meta_value, '0') AS UNSIGNED)) AND sku.meta_key = '_sku'
                    WHERE oi.order_id = o.ID AND oi.order_item_type = 'line_item'
                ), ''), 256))
            ), 256)
            FROM {$wpdb->posts} o WHERE o.ID = %d AND o.post_type = 'shop_order'";
        $hash = $wpdb->get_var($wpdb->prepare($sql, $order_id));
        if (!is_string($hash) || preg_match('/^[a-f0-9]{64}$/i', $hash) !== 1 || $wpdb->last_error !== '') {
                bapi_order_export_fail("Unable to calculate source-state hash for order {$order_id}.");
        }
        return strtolower($hash);
}

function bapi_order_export_date($date): ?string
{
    return $date instanceof WC_DateTime ? $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z') : null;
}

function bapi_order_export_manifest_date($date): string
{
    return $date instanceof WC_DateTime
        ? $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s')
        : '';
}

function bapi_order_export_assert_clean_text(string $value, string $context): void
{
    $shortcode_pattern = get_shortcode_regex();
    if (
        trim($value) !== trim(wp_strip_all_tags($value)) ||
        ($shortcode_pattern !== '' && preg_match('/' . $shortcode_pattern . '/s', $value)) ||
        preg_match('/\[\/?(?:vc_|wpb_)|visual.?composer|wpbakery|js_composer|revslider|ess_grid/i', $value)
    ) {
        bapi_order_export_fail("Markup, shortcode, or page-builder marker rejected in {$context}.");
    }
}

function bapi_order_export_meta_value($value, string $context): string
{
    if (!is_scalar($value) && $value !== null) {
        bapi_order_export_fail("Non-scalar metadata rejected in {$context}.");
    }
    $text = (string) $value;
    if (is_serialized($text)) {
        bapi_order_export_fail("Serialized metadata rejected in {$context}.");
    }
    bapi_order_export_assert_clean_text($text, $context);
    return $text;
}

/**
 * @return array<int, mixed>
 */
function bapi_order_export_raw_post_meta_values(int $post_id, string $meta_key): array
{
    global $wpdb;

    return $wpdb->get_col($wpdb->prepare(
        "SELECT meta_value FROM {$wpdb->postmeta}
         WHERE post_id = %d AND meta_key = %s
         ORDER BY meta_id",
        $post_id,
        $meta_key
    ));
}

/**
 * @return array<string, string>
 */
function bapi_order_export_business_meta(WC_Order $order): array
{
    $metadata = [];
    foreach (BAPI_ORDER_BUSINESS_META_KEYS as $meta_key) {
        $raw_values = bapi_order_export_raw_post_meta_values($order->get_id(), $meta_key);
        if ($raw_values === []) {
            continue;
        }
        if (count($raw_values) !== 1) {
            bapi_order_export_fail("Duplicate approved order metadata rejected: {$meta_key}");
        }
        if (is_string($raw_values[0]) && is_serialized($raw_values[0])) {
            bapi_order_export_fail("Serialized metadata rejected for order {$order->get_id()} metadata {$meta_key}.");
        }
        $metadata[$meta_key] = bapi_order_export_meta_value(
            $raw_values[0],
            "order {$order->get_id()} metadata {$meta_key}"
        );
    }
    ksort($metadata);
    return $metadata;
}

/**
 * @return array<string, string>
 */
function bapi_order_export_line_meta(WC_Order_Item_Product $item, int $order_id): array
{
    $metadata = [];
    foreach ($item->get_meta_data() as $meta) {
        $meta_data = $meta->get_data();
        $meta_key = $meta_data['key'] ?? null;
        if (!is_string($meta_key) || !in_array($meta_key, BAPI_ORDER_LINE_META_KEYS, true)) {
            continue;
        }
        if (array_key_exists($meta_key, $metadata)) {
            bapi_order_export_fail("Duplicate approved line metadata rejected for order {$order_id}: {$meta_key}");
        }
        $raw_value = $meta_data['value'] ?? null;
        if (is_string($raw_value) && is_serialized($raw_value)) {
            bapi_order_export_fail("Serialized metadata rejected for order {$order_id} line metadata {$meta_key}.");
        }
        $metadata[$meta_key] = bapi_order_export_meta_value(
            $raw_value,
            "order {$order_id} line metadata {$meta_key}"
        );
    }
    ksort($metadata);
    return $metadata;
}

/**
 * @return array<string, string>
 */
function bapi_order_export_address(WC_Order $order, string $type): array
{
    $fields = ['first_name', 'last_name', 'company', 'address_1', 'address_2', 'city', 'state', 'postcode', 'country'];
    if ($type === 'billing') {
        $fields[] = 'email';
        $fields[] = 'phone';
    }

    $address = [];
    foreach ($fields as $field) {
        $getter = "get_{$type}_{$field}";
        $value = (string) $order->{$getter}('edit');
        bapi_order_export_assert_clean_text($value, "{$type}.{$field}");
        $address[$field] = $value;
    }
    return $address;
}

/**
 * @return array<int, array<string, mixed>>
 */
function bapi_order_export_items(WC_Order $order, string $type): array
{
    $items = [];
    foreach ($order->get_items($type) as $item) {
        $name = (string) $item->get_name();
        bapi_order_export_assert_clean_text($name, "{$type} item name");
        $data = ['name' => $name];

        if ($item instanceof WC_Order_Item_Product) {
            $product = $item->get_product();
            $sku = $product ? (string) $product->get_sku('edit') : '';
            if ($sku === '') {
                bapi_order_export_fail("Order {$order->get_order_number()} has a line without a stable SKU.");
            }
            $data += [
                'sku' => $sku,
                'quantity' => (int) $item->get_quantity(),
                'subtotal' => (string) $item->get_subtotal('edit'),
                'subtotal_tax' => (string) $item->get_subtotal_tax('edit'),
                'total' => (string) $item->get_total('edit'),
                'total_tax' => (string) $item->get_total_tax('edit'),
                'taxes' => $item->get_taxes(),
            ];
            if (BAPI_ORDER_EXPORT_SCHEMA >= 2) {
                $data['configuration'] = bapi_order_export_line_meta($item, $order->get_id());
            }
        } elseif ($item instanceof WC_Order_Item_Shipping) {
            $data += [
                'method_id' => (string) $item->get_method_id(),
                'instance_id' => (string) $item->get_instance_id(),
                'total' => (string) $item->get_total('edit'),
                'total_tax' => (string) $item->get_total_tax('edit'),
                'taxes' => $item->get_taxes(),
            ];
        } elseif ($item instanceof WC_Order_Item_Fee) {
            $data += [
                'tax_class' => (string) $item->get_tax_class(),
                'tax_status' => (string) $item->get_tax_status(),
                'amount' => (string) $item->get_amount(),
                'total' => (string) $item->get_total('edit'),
                'total_tax' => (string) $item->get_total_tax('edit'),
                'taxes' => $item->get_taxes(),
            ];
        } elseif ($item instanceof WC_Order_Item_Coupon) {
            $data += [
                'code' => (string) $item->get_code(),
                'discount' => (string) $item->get_discount(),
                'discount_tax' => (string) $item->get_discount_tax(),
            ];
        } elseif ($item instanceof WC_Order_Item_Tax) {
            $data += [
                'rate_code' => (string) $item->get_rate_code(),
                'label' => (string) $item->get_label(),
                'compound' => (bool) $item->get_compound(),
                'tax_total' => (string) $item->get_tax_total(),
                'shipping_tax_total' => (string) $item->get_shipping_tax_total(),
            ];
        }
        $items[] = $data;
    }
    return $items;
}

/**
 * @return array<int, array<string, mixed>>
 */
function bapi_order_export_notes(int $order_id): array
{
    $notes = [];
    foreach (wc_get_order_notes(['order_id' => $order_id, 'limit' => 0]) as $note) {
        $content = (string) $note->content;
        bapi_order_export_assert_clean_text($content, "order {$order_id} note");
        $notes[] = [
            'content' => $content,
            'customer_note' => (bool) $note->customer_note,
            'added_by' => (string) $note->added_by,
            'date_created_gmt' => bapi_order_export_date($note->date_created ?? null),
        ];
    }
    return $notes;
}

/**
 * @return array<string, mixed>
 */
function bapi_order_export_payload(WC_Order $order, array $manifest_row): array
{
    $order_key = (string) $order->get_order_key();
    $billing_email = strtolower(trim((string) $order->get_billing_email('edit')));
    if (hash('sha256', $order_key) !== $manifest_row['order_key_hash']) {
        bapi_order_export_fail("Order-key hash changed for source order {$order->get_id()}.");
    }
    $billing_hash = $billing_email === '' ? '' : hash('sha256', $billing_email);
    if ($billing_hash !== $manifest_row['billing_email_hash']) {
        bapi_order_export_fail("Billing identity changed for source order {$order->get_id()}.");
    }
    if ('wc-' . $order->get_status() !== $manifest_row['status']) {
        bapi_order_export_fail("Status changed for source order {$order->get_id()}.");
    }
    if (
        bapi_order_export_manifest_date($order->get_date_created()) !== $manifest_row['created_gmt'] ||
        bapi_order_export_manifest_date($order->get_date_modified()) !== $manifest_row['modified_gmt']
    ) {
        bapi_order_export_fail("Source order changed after manifest approval: {$order->get_id()}.");
    }
    if (
        BAPI_ORDER_EXPORT_SCHEMA >= 2 &&
        bapi_order_export_source_state_hash($order->get_id()) !== $manifest_row['source_state_hash']
    ) {
        bapi_order_export_fail("Source order body changed after manifest approval: {$order->get_id()}.");
    }

    $customer_note = (string) $order->get_customer_note();
    bapi_order_export_assert_clean_text($customer_note, "order {$order->get_id()} customer note");

    $payload = [
        'schema_version' => BAPI_ORDER_EXPORT_SCHEMA,
        'order_key' => $order_key,
        'order_key_hash' => $manifest_row['order_key_hash'],
        'account_resolution' => $manifest_row['account_resolution'],
        'status' => $order->get_status(),
        'currency' => (string) $order->get_currency(),
        'prices_include_tax' => (bool) $order->get_prices_include_tax(),
        'date_created_gmt' => bapi_order_export_date($order->get_date_created()),
        'date_modified_gmt' => bapi_order_export_date($order->get_date_modified()),
        'date_paid_gmt' => bapi_order_export_date($order->get_date_paid()),
        'date_completed_gmt' => bapi_order_export_date($order->get_date_completed()),
        'customer_note' => $customer_note,
        'payment_method' => (string) $order->get_payment_method(),
        'payment_method_title' => (string) $order->get_payment_method_title(),
        'billing' => bapi_order_export_address($order, 'billing'),
        'shipping' => bapi_order_export_address($order, 'shipping'),
        'totals' => [
            'discount_total' => (string) $order->get_discount_total(),
            'discount_tax' => (string) $order->get_discount_tax(),
            'shipping_total' => (string) $order->get_shipping_total(),
            'shipping_tax' => (string) $order->get_shipping_tax(),
            'cart_tax' => (string) $order->get_cart_tax(),
            'total' => (string) $order->get_total(),
            'total_tax' => (string) $order->get_total_tax(),
        ],
        'line_items' => bapi_order_export_items($order, 'line_item'),
        'shipping_items' => bapi_order_export_items($order, 'shipping'),
        'fee_items' => bapi_order_export_items($order, 'fee'),
        'coupon_items' => bapi_order_export_items($order, 'coupon'),
        'tax_items' => bapi_order_export_items($order, 'tax'),
        'notes' => bapi_order_export_notes($order->get_id()),
    ];
    if (BAPI_ORDER_EXPORT_SCHEMA >= 2) {
        $payload['business_fields'] = bapi_order_export_business_meta($order);
        if (bapi_order_export_source_state_hash($order->get_id()) !== $manifest_row['source_state_hash']) {
            bapi_order_export_fail("Source order changed during payload extraction: {$order->get_id()}.");
        }
    }
    return $payload;
}

$manifest_path = $args[0] ?? '';
$output_path = $args[1] ?? '';
if ($manifest_path === '' || $output_path === '') {
    bapi_order_export_fail(
        'Usage: wp eval-file export-wordpress-rehearsal-orders.php ' .
        '<order-dry-run.tsv> <orders.jsonl> --path=<legacy-wordpress-path>'
    );
}

bapi_order_export_assert_source();
$manifest = bapi_order_export_read_manifest($manifest_path);
$rows = $manifest['rows'];
$policy = $manifest['policy'];
$output_dir = realpath(dirname($output_path));
if ($output_dir === false || !is_dir($output_dir) || is_file($output_path)) {
    bapi_order_export_fail('Output directory must exist and output file must not already exist.');
}
$temporary_path = $output_dir . '/.' . basename($output_path) . '.' . wp_generate_password(12, false) . '.tmp';
$previous_umask = umask(0077);
$handle = fopen($temporary_path, 'xb');
if ($handle === false) {
    bapi_order_export_fail('Unable to create temporary order payload.');
}
if (!chmod($temporary_path, 0600)) {
    fclose($handle);
    @unlink($temporary_path);
    bapi_order_export_fail('Unable to restrict temporary order payload permissions.');
}
$cleanup_path = $temporary_path;
register_shutdown_function(
    static function () use (&$cleanup_path): void {
        if ($cleanup_path !== '' && is_file($cleanup_path) && !unlink($cleanup_path)) {
            fwrite(STDERR, "ERROR: Unable to remove temporary order payload: {$cleanup_path}\n");
            exit(1);
        }
    }
);

$counts = ['exported' => 0, 'conflict' => 0];
$business_meta_counts = [];
$line_meta_counts = [];
foreach ($rows as $row) {
    if ($row['post_type'] !== 'shop_order') {
        fclose($handle);
        @unlink($temporary_path);
        bapi_order_export_fail("Unsupported order post type: {$row['post_type']}");
    }
    $order_ids = bapi_order_export_ids_by_key_hash($row['order_key_hash']);
    if (count($order_ids) !== 1) {
        fclose($handle);
        @unlink($temporary_path);
        bapi_order_export_fail("Order key is no longer unique: {$row['order_key_hash']}");
    }
    $order = wc_get_order($order_ids[0]);
    if (!$order instanceof WC_Order || $order instanceof WC_Order_Refund) {
        fclose($handle);
        @unlink($temporary_path);
        bapi_order_export_fail("Source order is unavailable: {$row['order_key_hash']}");
    }
    $payload = bapi_order_export_payload($order, $row);
    if (BAPI_ORDER_EXPORT_SCHEMA >= 2) {
        foreach (array_keys($payload['business_fields']) as $meta_key) {
            $business_meta_counts[$meta_key] = ($business_meta_counts[$meta_key] ?? 0) + 1;
        }
        foreach ($payload['line_items'] as $line_item) {
            foreach (array_keys($line_item['configuration']) as $meta_key) {
                $line_meta_counts[$meta_key] = ($line_meta_counts[$meta_key] ?? 0) + 1;
            }
        }
    }
    $json = wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (!is_string($json) || fwrite($handle, $json . "\n") === false) {
        fclose($handle);
        @unlink($temporary_path);
        bapi_order_export_fail('Unable to write order payload.');
    }
    $counts['exported']++;
}

ksort($business_meta_counts);
ksort($line_meta_counts);
if (
    BAPI_ORDER_EXPORT_SCHEMA >= 2 &&
    (
        $business_meta_counts !== ($policy['orders']['businessMetaCounts'] ?? null) ||
        $line_meta_counts !== ($policy['orders']['lineMetaCounts'] ?? null)
    )
) {
    fclose($handle);
    @unlink($temporary_path);
    bapi_order_export_fail('Exported metadata counts do not match the approved inventory.');
}
if (!fclose($handle) || !rename($temporary_path, $output_path)) {
    @unlink($temporary_path);
    bapi_order_export_fail('Unable to finalize order payload.');
}
$cleanup_path = '';
if (!chmod($output_path, 0600)) {
    @unlink($output_path);
    bapi_order_export_fail('Unable to restrict finalized order payload permissions.');
}
umask($previous_umask);
WP_CLI::log('summary\t' . wp_json_encode($counts));
if (BAPI_ORDER_EXPORT_SCHEMA >= 2) {
    WP_CLI::log('business-meta-counts\t' . wp_json_encode($business_meta_counts));
    WP_CLI::log('line-meta-counts\t' . wp_json_encode($line_meta_counts));
}
WP_CLI::success("Exported {$counts['exported']} approved orders; no WordPress writes were performed.");