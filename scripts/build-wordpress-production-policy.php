<?php
/**
 * Build a schema-v2 production policy from exact package manifests and restricted metadata reports.
 *
 * Usage:
 *   php build-wordpress-production-policy.php \
 *     <package-directory> <order-meta-keys.tsv> <order-item-meta-keys.tsv> <approved-at-utc>
 */

require_once __DIR__ . '/wordpress-order-metadata-policy.php';

function bapi_policy_fail(string $message): never
{
    fwrite(STDERR, "ERROR: {$message}\n");
    exit(1);
}

/**
 * @return array<int, array<string, string>>
 */
function bapi_policy_read_tsv(string $path, array $expected_headers): array
{
    $resolved_path = realpath($path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_policy_fail("TSV is not readable: {$path}");
    }
    $handle = fopen($resolved_path, 'rb');
    if ($handle === false) {
        bapi_policy_fail("Unable to open TSV: {$path}");
    }
    $headers = fgetcsv($handle, 0, "\t");
    if ($headers !== $expected_headers) {
        fclose($handle);
        bapi_policy_fail("TSV has an unexpected header: {$path}");
    }
    $rows = [];
    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        if ($values === [null] || $values === []) {
            continue;
        }
        if (count($values) !== count($headers)) {
            fclose($handle);
            bapi_policy_fail("TSV contains a malformed row: {$path}");
        }
        $row = array_combine($headers, $values);
        if ($row === false) {
            fclose($handle);
            bapi_policy_fail("TSV columns could not be combined: {$path}");
        }
        $rows[] = $row;
    }
    fclose($handle);
    return $rows;
}

function bapi_policy_positive_count(string $value, string $context): int
{
    if (preg_match('/^[1-9][0-9]*$/', $value) !== 1) {
        bapi_policy_fail("Invalid positive count for {$context}.");
    }
    return (int) $value;
}

function bapi_policy_file_hash(string $path): string
{
    $resolved_path = realpath($path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_policy_fail("Package file is not readable: {$path}");
    }
    return hash_file('sha256', $resolved_path);
}

if ($argc !== 5) {
    bapi_policy_fail(
        'Usage: php build-wordpress-production-policy.php ' .
        '<package-directory> <order-meta-keys.tsv> <order-item-meta-keys.tsv> <approved-at-utc>'
    );
}

$package_dir = realpath($argv[1]);
if ($package_dir === false || !is_dir($package_dir)) {
    bapi_policy_fail('Package directory does not exist.');
}
$approved_at_utc = $argv[4];
$approved_at = DateTimeImmutable::createFromFormat('!Y-m-d\TH:i:s\Z', $approved_at_utc, new DateTimeZone('UTC'));
$date_errors = DateTimeImmutable::getLastErrors();
if (
    !$approved_at instanceof DateTimeImmutable ||
    ($date_errors !== false && ($date_errors['warning_count'] > 0 || $date_errors['error_count'] > 0)) ||
    $approved_at->format('Y-m-d\TH:i:s\Z') !== $approved_at_utc
) {
    bapi_policy_fail('Approval time must be an explicit UTC timestamp such as 2026-08-27T14:00:00Z.');
}
$output_path = $package_dir . '/approved-policy.json';
if (file_exists($output_path)) {
    bapi_policy_fail('Refusing to replace an existing approved-policy.json.');
}

$eta_path = $package_dir . '/eta-price-dry-run.tsv';
$media_path = $package_dir . '/product-document-media-dry-run.tsv';
$mapping_path = $package_dir . '/product-document-mapping-additions.tsv';
$order_path = $package_dir . '/order-dry-run.tsv';

$eta_rows = bapi_policy_read_tsv($eta_path, [
    'sku', 'target_regular_price', 'legacy_records', 'headless_records', 'price_hash_equal',
    'headless_price_hash', 'disposition',
]);
$eta_counts = ['candidate-update' => 0, 'reject-source-missing' => 0];
foreach ($eta_rows as $row) {
    if (!array_key_exists($row['disposition'], $eta_counts)) {
        bapi_policy_fail("Unsupported ETA disposition: {$row['disposition']}");
    }
    $eta_counts[$row['disposition']]++;
}

$media_rows = bapi_policy_read_tsv($media_path, [
    'upload_path', 'legacy_bytes', 'legacy_sha256', 'headless_bytes', 'headless_sha256', 'disposition',
]);
$media_counts = ['candidate-add' => 0, 'candidate-replace' => 0, 'reject-source-missing' => 0];
$excluded_paths = [];
foreach ($media_rows as $row) {
    if (!array_key_exists($row['disposition'], $media_counts)) {
        bapi_policy_fail("Unsupported product-document disposition: {$row['disposition']}");
    }
    $media_counts[$row['disposition']]++;
    if ($row['disposition'] === 'reject-source-missing') {
        $excluded_paths[] = $row['upload_path'];
    }
}
if ($excluded_paths !== ['Wireless_QuantumSlim-v17.pdf']) {
    bapi_policy_fail('The approved missing product-document exclusion changed.');
}

$mapping_rows = bapi_policy_read_tsv($mapping_path, [
    'product_slug', 'document_heading_hex', 'upload_path_hex',
]);
$mapping_parents = [];
foreach ($mapping_rows as $row) {
    if ($row['product_slug'] === '') {
        bapi_policy_fail('Product-document mapping contains a blank product slug.');
    }
    $mapping_parents[$row['product_slug']] = true;
}

$order_rows = bapi_policy_read_tsv($order_path, [
    'order_key_hash', 'post_type', 'status', 'created_gmt', 'modified_gmt',
    'billing_email_hash', 'account_resolution', 'source_state_hash',
]);
$status_counts = [];
$resolution_counts = [];
$allowed_statuses = ['wc-processing', 'wc-pending', 'wc-failed'];
$allowed_resolutions = ['link-existing-headless-user', 'legacy-account-review', 'guest-order'];
foreach ($order_rows as $row) {
    if ($row['post_type'] !== 'shop_order' || !in_array($row['status'], $allowed_statuses, true)) {
        bapi_policy_fail('Order manifest contains an unsupported type or status.');
    }
    if (!in_array($row['account_resolution'], $allowed_resolutions, true)) {
        bapi_policy_fail("Unsupported account resolution: {$row['account_resolution']}");
    }
    if (preg_match('/^[a-f0-9]{64}$/', $row['source_state_hash']) !== 1) {
        bapi_policy_fail('Order manifest contains a malformed source-state hash.');
    }
    $status = substr($row['status'], 3);
    $status_counts[$status] = ($status_counts[$status] ?? 0) + 1;
    $resolution_counts[$row['account_resolution']] = ($resolution_counts[$row['account_resolution']] ?? 0) + 1;
}
ksort($status_counts);
ksort($resolution_counts);

$order_meta_rows = bapi_policy_read_tsv($argv[2], [
    'meta_key', 'row_count', 'order_count', 'classification',
]);
$order_meta_by_key = [];
foreach ($order_meta_rows as $row) {
    if (isset($order_meta_by_key[$row['meta_key']])) {
        bapi_policy_fail("Duplicate order metadata inventory key: {$row['meta_key']}");
    }
    $order_meta_by_key[$row['meta_key']] = $row;
}
$business_meta_counts = [];
foreach (BAPI_ORDER_BUSINESS_META_KEYS as $meta_key) {
    $row = $order_meta_by_key[$meta_key] ?? null;
    if (!is_array($row) || $row['classification'] !== 'review-required') {
        bapi_policy_fail("Approved order metadata key is absent or reclassified: {$meta_key}");
    }
    $business_meta_counts[$meta_key] = bapi_policy_positive_count($row['row_count'], $meta_key);
}
ksort($business_meta_counts);

$item_meta_rows = bapi_policy_read_tsv($argv[3], [
    'order_item_type', 'meta_key', 'row_count', 'item_count', 'order_count', 'classification',
]);
$line_meta_by_key = [];
foreach ($item_meta_rows as $row) {
    if ($row['order_item_type'] !== 'line_item') {
        continue;
    }
    if (isset($line_meta_by_key[$row['meta_key']])) {
        bapi_policy_fail("Duplicate line metadata inventory key: {$row['meta_key']}");
    }
    $line_meta_by_key[$row['meta_key']] = $row;
}
$line_meta_counts = [];
foreach (BAPI_ORDER_LINE_META_KEYS as $meta_key) {
    $row = $line_meta_by_key[$meta_key] ?? null;
    if (!is_array($row) || $row['classification'] !== 'review-required') {
        bapi_policy_fail("Approved line metadata key is absent or reclassified: {$meta_key}");
    }
    $line_meta_counts[$meta_key] = bapi_policy_positive_count($row['row_count'], $meta_key);
}
ksort($line_meta_counts);

$policy = [
    'schemaVersion' => 2,
    'approvedAtUtc' => $approved_at_utc,
    'productionMarker' => 'bapi-production-data-refresh-20260827',
    'newProducts' => [
        'approvedCandidateCount' => 0,
        'rule' => 'insert-only-when-unique-nonblank-sku-is-absent-from-headless',
    ],
    'prices' => [
        'approvedCandidateCount' => $eta_counts['candidate-update'],
        'rejectedMissingCount' => $eta_counts['reject-source-missing'],
        'manifestSha256' => bapi_policy_file_hash($eta_path),
        'fields' => ['_regular_price', '_price'],
        'activePriceRule' => 'update-only-when-sale-price-empty',
    ],
    'orders' => [
        'approvedCandidateCount' => count($order_rows),
        'manifestSha256' => bapi_policy_file_hash($order_path),
        'statusCounts' => $status_counts,
        'accountResolutionCounts' => $resolution_counts,
        'businessMetaCounts' => $business_meta_counts,
        'lineMetaCounts' => $line_meta_counts,
        'existingHeadlessCustomer' => 'link-by-normalized-email',
        'legacyOnlyCustomer' => 'import-as-guest',
        'existingGuest' => 'preserve-as-guest',
        'failedOrders' => 'include-with-source-status',
        'sourceUserIds' => 'reject',
    ],
    'productDocuments' => [
        'approvedAddCount' => $media_counts['candidate-add'],
        'approvedReplaceCount' => $media_counts['candidate-replace'],
        'approvedMappingAddCount' => count($mapping_rows),
        'approvedMappingParentCount' => count($mapping_parents),
        'mediaManifestSha256' => bapi_policy_file_hash($media_path),
        'mappingManifestSha256' => bapi_policy_file_hash($mapping_path),
        'requireSourceAndDestinationSha256' => true,
        'missingSource' => 'reject-until-recovered',
        'excludedPath' => 'Wireless_QuantumSlim-v17.pdf',
    ],
    'excluded' => [
        'plugins',
        'themes',
        'mu-plugins',
        'options',
        'plugin-tables',
        'visual-composer',
        'wpbakery',
        'generated-builder-files',
        'customer-groups',
        'inventory',
        'variation-product-documents',
        'stripe-metadata',
        'analytics-metadata',
        'derived-order-metadata',
    ],
];

$json = json_encode($policy, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
$temporary_path = $package_dir . '/.approved-policy.' . bin2hex(random_bytes(8)) . '.tmp';
$previous_umask = umask(0077);
if (file_put_contents($temporary_path, $json, LOCK_EX) !== strlen($json)) {
    @unlink($temporary_path);
    bapi_policy_fail('Unable to write the temporary production policy.');
}
if (!chmod($temporary_path, 0600) || !rename($temporary_path, $output_path)) {
    @unlink($temporary_path);
    bapi_policy_fail('Unable to finalize the production policy.');
}
umask($previous_umask);

fwrite(STDOUT, "policy_sha256=" . hash_file('sha256', $output_path) . "\n");
fwrite(STDOUT, "order_count=" . count($order_rows) . "\n");
fwrite(STDOUT, "business_meta_keys=" . count($business_meta_counts) . "\n");
fwrite(STDOUT, "line_meta_keys=" . count($line_meta_counts) . "\n");
