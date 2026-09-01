#!/usr/bin/env php
<?php

declare(strict_types=1);

const BAPI_MONITOR_CLEAN = 0;
const BAPI_MONITOR_INPUT_ERROR = 2;
const BAPI_MONITOR_CATCH_UP_REQUIRED = 10;
const BAPI_MONITOR_NO_GO = 20;

function fail(string $message): never
{
    fwrite(STDERR, "ERROR: {$message}\n");
    exit(BAPI_MONITOR_INPUT_ERROR);
}

function assert_owner_only_file(string $path): void
{
    if (!is_file($path) || is_link($path)) {
        fail("Evidence must be a non-symlinked regular file: {$path}");
    }
    if ((fileperms($path) & 0777) !== 0600) {
        fail("Evidence file permissions must be 0600: {$path}");
    }
}

function parse_arguments(array $arguments): array
{
    $options = [];
    for ($index = 1; $index < count($arguments); $index += 2) {
        $name = $arguments[$index] ?? '';
        $value = $arguments[$index + 1] ?? '';
        if (!in_array($name, ['--baseline', '--current', '--output'], true) || $value === '') {
            fail('Usage: compare-wordpress-approved-scans.php --baseline <scan-dir> --current <scan-dir> --output <ledger.json>');
        }
        $options[$name] = $value;
    }

    foreach (['--baseline', '--current', '--output'] as $required) {
        if (!isset($options[$required])) {
            fail("Missing required argument: {$required}");
        }
    }

    return $options;
}

function read_summary(string $directory): array
{
    $path = $directory . '/summary.txt';
    assert_owner_only_file($path);
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        fail("Unable to read {$path}");
    }

    $summary = [];
    foreach ($lines as $line) {
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2 || $parts[0] === '') {
            fail("Malformed summary line in {$path}");
        }
        if (isset($summary[$parts[0]])) {
            fail("Duplicate summary key in {$path}: {$parts[0]}");
        }
        $summary[$parts[0]] = $parts[1];
    }

    foreach (['label', 'captured_at_utc', 'since'] as $required) {
        if (!isset($summary[$required]) || $summary[$required] === '') {
            fail("Missing {$required} in {$path}");
        }
    }

    return $summary;
}

function read_tsv(string $directory, string $filename, array $expected_header): array
{
    $path = $directory . '/' . $filename;
    assert_owner_only_file($path);
    $handle = fopen($path, 'rb');
    if ($handle === false) {
        fail("Unable to read {$path}");
    }

    $header = fgetcsv($handle, null, "\t", '"', '');
    if ($header !== $expected_header) {
        fclose($handle);
        fail("Unexpected header in {$path}");
    }

    $rows = [];
    while (($values = fgetcsv($handle, null, "\t", '"', '')) !== false) {
        if ($values === [null] || $values === []) {
            continue;
        }
        if (count($values) !== count($header)) {
            fclose($handle);
            fail("Malformed row in {$path}");
        }
        $rows[] = array_combine($header, $values);
    }
    fclose($handle);

    return $rows;
}

function index_unique(array $rows, array $key_fields, string $report): array
{
    $indexed = [];
    foreach ($rows as $row) {
        $key_parts = [];
        foreach ($key_fields as $field) {
            $key_parts[] = $row[$field];
        }
        $key = implode("\x1f", $key_parts);
        if (isset($indexed[$key])) {
            fail("Ambiguous duplicate key in {$report}: " . implode('|', $key_parts));
        }
        $indexed[$key] = $row;
    }

    ksort($indexed, SORT_STRING);
    return $indexed;
}

function canonical_rows_hash(array $rows): string
{
    $encoded = array_map(
        static fn(array $row): string => json_encode($row, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
        $rows
    );
    sort($encoded, SORT_STRING);
    return hash('sha256', implode("\n", $encoded));
}

function scan_manifest(string $directory, array $filenames): array
{
    $manifest = [];
    foreach ($filenames as $filename) {
        $path = $directory . '/' . $filename;
        assert_owner_only_file($path);
        $checksum = hash_file('sha256', $path);
        if ($checksum === false) {
            fail("Unable to hash {$path}");
        }
        $manifest[$filename] = $checksum;
    }

    return $manifest;
}

function compare_orders(array $baseline_rows, array $current_rows): array
{
    $baseline = index_unique($baseline_rows, ['order_key_hash'], 'order-user-relationships.tsv');
    $current = index_unique($current_rows, ['order_key_hash'], 'order-user-relationships.tsv');
    $added = [];
    $modified = [];
    $removed = [];

    foreach ($current as $key => $row) {
        if (!isset($baseline[$key])) {
            $added[] = $row['order_key_hash'];
        } elseif ($baseline[$key]['source_state_hash'] !== $row['source_state_hash']) {
            $modified[] = $row['order_key_hash'];
        }
    }
    foreach ($baseline as $key => $row) {
        if (!isset($current[$key])) {
            $removed[] = $row['order_key_hash'];
        }
    }

    return ['added' => $added, 'modified' => $modified, 'removed' => $removed];
}

function compare_catalog(array $baseline_rows, array $current_rows): array
{
    $key_fields = ['post_type', 'sku', 'slug'];
    $baseline = index_unique($baseline_rows, $key_fields, 'catalog-field-hashes.tsv');
    $current = index_unique($current_rows, $key_fields, 'catalog-field-hashes.tsv');
    $changes = [
        'added_records' => [],
        'removed_records' => [],
        'identity_or_status' => [],
        'price' => [],
        'inventory' => [],
        'customer_groups' => [],
        'product_documents' => [],
    ];

    foreach ($current as $key => $row) {
        $display_key = implode('|', array_map(static fn(string $field): string => $row[$field], $key_fields));
        if (!isset($baseline[$key])) {
            $changes['added_records'][] = $display_key;
            continue;
        }
        $before = $baseline[$key];
        if (
            $before['parent_sku'] !== $row['parent_sku']
            || $before['post_status'] !== $row['post_status']
            || $before['post_modified_gmt'] !== $row['post_modified_gmt']
        ) {
            $changes['identity_or_status'][] = $display_key;
        }
        foreach ([
            'price_hash' => 'price',
            'inventory_hash' => 'inventory',
            'customer_group_hash' => 'customer_groups',
            'product_documents_hash' => 'product_documents',
        ] as $hash_field => $category) {
            if ($before[$hash_field] !== $row[$hash_field]) {
                $changes[$category][] = $display_key;
            }
        }
    }
    foreach ($baseline as $key => $row) {
        if (!isset($current[$key])) {
            $changes['removed_records'][] = implode('|', array_map(static fn(string $field): string => $row[$field], $key_fields));
        }
    }

    return $changes;
}

function count_changes(array $groups): int
{
    return array_sum(array_map('count', $groups));
}

$options = parse_arguments($argv);
$baseline_directory = rtrim($options['--baseline'], '/');
$current_directory = rtrim($options['--current'], '/');
$output_path = $options['--output'];

foreach ([$baseline_directory, $current_directory] as $directory) {
    if (!is_dir($directory) || is_link($directory)) {
        fail("Scan directory must be a non-symlinked directory: {$directory}");
    }
    if ((fileperms($directory) & 0777) !== 0700) {
        fail("Scan directory permissions must be 0700: {$directory}");
    }
}

$baseline_summary = read_summary($baseline_directory);
$current_summary = read_summary($current_directory);
if ($baseline_summary['label'] !== $current_summary['label']) {
    fail('Baseline and current scan labels do not match');
}
if ($baseline_summary['since'] !== $current_summary['since']) {
    fail('Baseline and current scans must use the same immutable --since floor');
}
if (
    !preg_match('/^\d{8}T\d{6}Z$/D', $baseline_summary['captured_at_utc'])
    || !preg_match('/^\d{8}T\d{6}Z$/D', $current_summary['captured_at_utc'])
) {
    fail('Scan timestamps must use YYYYMMDDTHHMMSSZ');
}
if (strcmp($baseline_summary['captured_at_utc'], $current_summary['captured_at_utc']) >= 0) {
    fail('Current scan timestamp must be later than baseline scan timestamp');
}

$catalog_header = ['post_type', 'sku', 'slug', 'parent_sku', 'post_status', 'post_modified_gmt', 'price_hash', 'inventory_hash', 'customer_group_hash', 'product_documents_hash'];
$order_header = ['source_order_id', 'order_key_hash', 'post_type', 'post_status', 'post_date_gmt', 'post_modified_gmt', 'source_user_id', 'billing_email_hash', 'source_user_exists', 'source_state_hash'];
$exact_reports = [
    'referenced-product-media.tsv' => ['product_source_id', 'sku', 'product_slug', 'attachment_source_id', 'upload_path', 'post_mime_type', 'post_modified_gmt'],
    'product-document-metadata.tsv' => ['product_slug', 'meta_key', 'normalized_value_hex'],
    'product-document-resolved-pairs.tsv' => ['product_slug', 'document_heading_hex', 'upload_path_hex'],
    'referenced-product-media-hashes.tsv' => ['upload_path', 'bytes', 'sha256', 'status'],
];

$baseline_orders = read_tsv($baseline_directory, 'order-user-relationships.tsv', $order_header);
$current_orders = read_tsv($current_directory, 'order-user-relationships.tsv', $order_header);
$order_changes = compare_orders($baseline_orders, $current_orders);
$catalog_changes = compare_catalog(
    read_tsv($baseline_directory, 'catalog-field-hashes.tsv', $catalog_header),
    read_tsv($current_directory, 'catalog-field-hashes.tsv', $catalog_header)
);

$document_reports = [];
foreach ($exact_reports as $filename => $header) {
    $before_rows = read_tsv($baseline_directory, $filename, $header);
    $after_rows = read_tsv($current_directory, $filename, $header);
    $before_hash = canonical_rows_hash($before_rows);
    $after_hash = canonical_rows_hash($after_rows);
    $document_reports[$filename] = [
        'changed' => !hash_equals($before_hash, $after_hash),
        'baseline_rows' => count($before_rows),
        'current_rows' => count($after_rows),
        'baseline_sha256' => $before_hash,
        'current_sha256' => $after_hash,
    ];
}

$catch_up_count = count($order_changes['added']) + count($order_changes['modified']);
$no_go_reasons = [];
if ($order_changes['removed'] !== []) {
    $no_go_reasons[] = 'source_orders_removed';
}
foreach ($catalog_changes as $category => $keys) {
    if ($keys !== []) {
        $no_go_reasons[] = "catalog_{$category}_changed";
    }
}
foreach ($document_reports as $filename => $comparison) {
    if ($comparison['changed']) {
        $no_go_reasons[] = "{$filename}_changed";
    }
}

$status = $no_go_reasons !== [] ? 'no-go' : ($catch_up_count > 0 ? 'catch-up-required' : 'clean');
$exit_code = $status === 'no-go'
    ? BAPI_MONITOR_NO_GO
    : ($status === 'catch-up-required' ? BAPI_MONITOR_CATCH_UP_REQUIRED : BAPI_MONITOR_CLEAN);
$ledger = [
    'schema_version' => 1,
    'status' => $status,
    'exit_code' => $exit_code,
    'generated_at_utc' => gmdate('Y-m-d\TH:i:s\Z'),
    'scan_label' => $current_summary['label'],
    'immutable_since_floor' => $current_summary['since'],
    'baseline_captured_at_utc' => $baseline_summary['captured_at_utc'],
    'current_captured_at_utc' => $current_summary['captured_at_utc'],
    'baseline_manifest' => scan_manifest($baseline_directory, array_merge(['summary.txt', 'catalog-field-hashes.tsv', 'order-user-relationships.tsv'], array_keys($exact_reports))),
    'current_manifest' => scan_manifest($current_directory, array_merge(['summary.txt', 'catalog-field-hashes.tsv', 'order-user-relationships.tsv'], array_keys($exact_reports))),
    'orders' => $order_changes,
    'catalog' => $catalog_changes,
    'document_reports' => $document_reports,
    'no_go_reasons' => $no_go_reasons,
];

$output_directory = dirname($output_path);
if (!is_dir($output_directory) || is_link($output_directory)) {
    fail("Output parent must be an existing non-symlinked directory: {$output_directory}");
}
if ((fileperms($output_directory) & 0777) !== 0700) {
    fail("Output parent permissions must be 0700: {$output_directory}");
}
if (file_exists($output_path) || is_link($output_path)) {
    fail("Refusing to overwrite existing ledger: {$output_path}");
}
$encoded = json_encode($ledger, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
$output_handle = fopen($output_path, 'x+b');
if ($output_handle === false || !chmod($output_path, 0600)) {
    is_resource($output_handle) && fclose($output_handle);
    @unlink($output_path);
    fail("Unable to create owner-only ledger: {$output_path}");
}
$bytes_written = fwrite($output_handle, $encoded);
if ($bytes_written !== strlen($encoded) || !fflush($output_handle)) {
    fclose($output_handle);
    @unlink($output_path);
    fail("Unable to write complete ledger: {$output_path}");
}
fclose($output_handle);

printf("%s: %s\n", strtoupper($status), $output_path);
exit($exit_code);