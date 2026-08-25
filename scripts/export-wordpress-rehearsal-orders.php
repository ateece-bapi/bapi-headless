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

const BAPI_ORDER_EXPORT_SCHEMA = 1;
const BAPI_ORDER_EXPORT_POLICY_SHA256 = 'bf835b6166f6df76110fdd91a62175a422cea1e63584b19f03ee22a0df385470';

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
 * @return array<int, array<string, string>>
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
    if (!is_array($policy) || ($policy['orders']['approvedCandidateCount'] ?? null) !== 669) {
        bapi_order_export_fail('Approved order policy is malformed or has an unexpected candidate count.');
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

    if (count($rows) !== 669) {
        bapi_order_export_fail('Order manifest no longer contains exactly 669 approved rows.');
    }
    return $rows;
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

function bapi_order_export_date($date): ?string
{
    return $date instanceof WC_DateTime ? $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z') : null;
}

function bapi_order_export_assert_clean_text(string $value, string $context): void
{
    if (preg_match('/\[\/?(?:vc_|wpb_)|visual.?composer|wpbakery|js_composer|revslider|ess_grid/i', $value)) {
        bapi_order_export_fail("Page-builder marker rejected in {$context}.");
    }
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

    $customer_note = (string) $order->get_customer_note();
    bapi_order_export_assert_clean_text($customer_note, "order {$order->get_id()} customer note");

    return [
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
$rows = bapi_order_export_read_manifest($manifest_path);
$output_dir = realpath(dirname($output_path));
if ($output_dir === false || !is_dir($output_dir) || is_file($output_path)) {
    bapi_order_export_fail('Output directory must exist and output file must not already exist.');
}
$temporary_path = $output_dir . '/.' . basename($output_path) . '.' . wp_generate_password(12, false) . '.tmp';
$handle = fopen($temporary_path, 'xb');
if ($handle === false) {
    bapi_order_export_fail('Unable to create temporary order payload.');
}
chmod($temporary_path, 0600);
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
    $json = wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (!is_string($json) || fwrite($handle, $json . "\n") === false) {
        fclose($handle);
        @unlink($temporary_path);
        bapi_order_export_fail('Unable to write order payload.');
    }
    $counts['exported']++;
}

if (!fclose($handle) || !rename($temporary_path, $output_path)) {
    @unlink($temporary_path);
    bapi_order_export_fail('Unable to finalize order payload.');
}
$cleanup_path = '';
chmod($output_path, 0600);
WP_CLI::log('summary\t' . wp_json_encode($counts));
WP_CLI::success("Exported {$counts['exported']} approved orders; no WordPress writes were performed.");