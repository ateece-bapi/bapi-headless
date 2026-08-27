<?php

$root = dirname(__DIR__, 2);
require_once $root . '/scripts/wordpress-order-metadata-policy.php';

function bapi_test_assert(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
}

function bapi_test_write(string $path, string $content): void
{
    if (file_put_contents($path, $content) !== strlen($content)) {
        throw new RuntimeException("Unable to write fixture: {$path}");
    }
}

function bapi_test_remove_tree(string $directory): void
{
    if (!is_dir($directory)) {
        return;
    }
    foreach (array_diff(scandir($directory), ['.', '..']) as $name) {
        $path = $directory . '/' . $name;
        is_dir($path) ? bapi_test_remove_tree($path) : unlink($path);
    }
    rmdir($directory);
}

function bapi_test_run(string $command, string $working_directory): array
{
    $output = [];
    $exit_code = 0;
    exec('cd ' . escapeshellarg($working_directory) . ' && ' . $command . ' 2>&1', $output, $exit_code);
    return ['exit_code' => $exit_code, 'output' => $output];
}

bapi_test_assert(count(BAPI_ORDER_BUSINESS_META_KEYS) === 4, 'business metadata allowlist must contain four keys');
bapi_test_assert(count(array_unique(BAPI_ORDER_BUSINESS_META_KEYS)) === 4, 'business metadata allowlist has duplicates');
bapi_test_assert(count(BAPI_ORDER_LINE_META_KEYS) === 87, 'line metadata allowlist must contain 87 keys');
bapi_test_assert(count(array_unique(BAPI_ORDER_LINE_META_KEYS)) === 87, 'line metadata allowlist has duplicates');

$production_runner = file_get_contents($root . '/scripts/run-wordpress-production-etl.php');
$contract_rehearsal_runner = file_get_contents($root . '/scripts/run-wordpress-production-contract-rehearsal.php');
$contract_rehearsal_apply_runner = file_get_contents($root . '/scripts/run-wordpress-production-contract-rehearsal-apply.php');
$rehearsal_runner = file_get_contents($root . '/scripts/run-wordpress-rehearsal-etl.php');
$guard = file_get_contents($root . '/scripts/bapi-production-refresh-guard.php');
$contract_rehearsal_guard = file_get_contents($root . '/scripts/bapi-production-contract-rehearsal-guard.php');
$scanner = file_get_contents($root . '/scripts/scan-wordpress-approved-deltas.sh');
$package_builder = file_get_contents($root . '/scripts/prepare-wordpress-rehearsal-package.sh');
$order_exporter = file_get_contents($root . '/scripts/export-wordpress-rehearsal-orders.php');
bapi_test_assert(str_contains($production_runner, "define('BAPI_ETL_APPROVED_HOST', 'bapiheadlessstaging.kinsta.cloud')"), 'production host is not exact');
bapi_test_assert(!str_contains($production_runner, 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud'), 'production wrapper references the rehearsal host');
bapi_test_assert(str_contains($rehearsal_runner, "define('BAPI_ETL_APPROVED_HOST', 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud')"), 'rehearsal default host changed');
bapi_test_assert(str_contains($production_runner, 'BAPI_PRODUCTION_APPLY'), 'production wrapper does not document distinct apply confirmation');
bapi_test_assert(str_contains($contract_rehearsal_runner, "'stg-bapiheadlessstaging-refresh0826.kinsta.cloud'"), 'contract rehearsal host is not exact');
bapi_test_assert(str_contains($contract_rehearsal_runner, "permits dry-run mode only"), 'contract rehearsal wrapper does not reject apply mode');
bapi_test_assert(!str_contains($contract_rehearsal_runner, "'bapiheadlessstaging.kinsta.cloud'"), 'contract rehearsal wrapper references production host');
bapi_test_assert(str_contains($contract_rehearsal_apply_runner, "'BAPI_REHEARSAL_APPLY'"), 'contract rehearsal apply does not require distinct confirmation');
bapi_test_assert(!str_contains($contract_rehearsal_apply_runner, "'bapiheadlessstaging.kinsta.cloud'"), 'contract rehearsal apply references production host');
bapi_test_assert(str_contains($contract_rehearsal_guard, "'bapi_production_contract_rehearsal_guard_enabled'"), 'contract rehearsal guard option is not isolated');
bapi_test_assert(!str_contains($contract_rehearsal_guard, "'bapiheadlessstaging.kinsta.cloud'"), 'contract rehearsal guard references production host');
bapi_test_assert(str_contains($rehearsal_runner, 'BAPI_ETL_POLICY_MARKER_VALUE'), 'policy and target markers cannot be independently pinned');
bapi_test_assert(str_contains($rehearsal_runner, ": 'BAPI_PRODUCTION_APPLY'"), 'production apply confirmation default changed');
bapi_test_assert(str_contains($rehearsal_runner, 'getenv($apply_confirmation_name)'), 'configured apply confirmation is not enforced');
bapi_test_assert(str_contains($rehearsal_runner, "function_exists('bapi_production_refresh_guard_status')"), 'production guard is not enforced');
bapi_test_assert(str_contains($rehearsal_runner, 'bapi_rehearsal_product_price_hash'), 'ETA target before-state is not enforced');
bapi_test_assert(strpos($rehearsal_runner, "get_regular_price('edit') === \$target_price") < strpos($rehearsal_runner, 'bapi_rehearsal_product_price_hash($product_ids[0])'), 'ETA approved after-state is not checked before the original before-state hash');
bapi_test_assert(str_contains($rehearsal_runner, "get_date_on_sale_to('edit') === null"), 'ETA unchanged state does not verify the complete sale schedule');
bapi_test_assert(str_contains($rehearsal_runner, 'bapi_rehearsal_assert_queues_unchanged'), 'queue state is not verified before commit');
bapi_test_assert(substr_count($rehearsal_runner, "try {\n        \$queue_snapshot = bapi_rehearsal_guard_queue_snapshot();") === 3, 'queue snapshot failures are not covered by all transaction rollback handlers');
bapi_test_assert(str_contains($rehearsal_runner, 'bapi_rehearsal_assert_inert_meta_value($heading'), 'product-document headings are not checked for markup or registered shortcodes');
bapi_test_assert(str_contains($rehearsal_runner, 'is_string($value) ? wp_slash($value) : $value'), 'literal backslashes are not preserved in approved metadata');
bapi_test_assert(str_contains($rehearsal_runner, 'bapi_rehearsal_assert_upload_target'), 'PDF destinations are not canonically confined');
bapi_test_assert(str_contains($rehearsal_runner, 'bapi_rehearsal_assert_transactional_storage'), 'production transaction tables are not verified');
bapi_test_assert(str_contains($rehearsal_runner, "DateTimeImmutable::createFromFormat('!Y-m-d\\TH:i:s\\Z'"), 'order UTC dates are not strictly parsed');
bapi_test_assert(str_contains($rehearsal_runner, 'trim($value) !== trim(wp_strip_all_tags($value))'), 'runner does not allow harmless metadata whitespace');
bapi_test_assert(!str_contains($rehearsal_runner, '/\[[^\]]+\]|'), 'runner still rejects all bracketed metadata text');
bapi_test_assert(str_contains($rehearsal_runner, "'payload_sha256' => get_post_meta"), 'order idempotency marker is not reconstructed');
bapi_test_assert(str_contains($rehearsal_runner, 'must be a non-symlinked owner-only file'), 'production package permissions are not enforced');
bapi_test_assert(str_contains($rehearsal_runner, 'BAPI_PRODUCTION_FILESYSTEM_LOCK'), 'production document filesystem lock is not required');
bapi_test_assert(str_contains($rehearsal_runner, "wc_product_meta_lookup'"), 'ETA lookup table is absent from transaction preflight');
bapi_test_assert(str_contains($scanner, 'AS source_state_hash'), 'source scanner does not freeze complete order state');
bapi_test_assert(str_contains($package_builder, 'source_state_hash'), 'package builder drops the source-state hash');
bapi_test_assert(str_contains($package_builder, 'assert_header'), 'package builder does not validate positional TSV headers');
bapi_test_assert(str_contains($order_exporter, 'bapi_order_export_source_state_hash'), 'order exporter does not revalidate complete source state');
bapi_test_assert(str_contains($order_exporter, 'Source order changed during payload extraction'), 'order exporter does not revalidate source state after payload extraction');
bapi_test_assert(str_contains($order_exporter, "!isset(\$policy['orders'])"), 'order exporter dereferences malformed policy JSON before validating its shape');
bapi_test_assert(str_contains($order_exporter, 'get_shortcode_regex()'), 'order exporter does not use registered shortcode detection');
bapi_test_assert(!str_contains($order_exporter, '/\[[^\]]+\]|'), 'order exporter still rejects all bracketed product text');
bapi_test_assert(str_contains($order_exporter, 'trim($value) !== trim(wp_strip_all_tags($value))'), 'order exporter does not allow harmless surrounding whitespace');
bapi_test_assert(str_contains($guard, "define('BAPI_PRODUCTION_REFRESH_GUARD_OPTION', 'bapi_data_refresh_guard_enabled')"), 'guard enable option changed');
bapi_test_assert(str_contains($guard, "define('BAPI_PRODUCTION_REFRESH_HOST', 'bapiheadlessstaging.kinsta.cloud')"), 'guard host does not match production');
bapi_test_assert(str_contains($guard, "add_filter('pre_schedule_event'"), 'cron enqueueing is not blocked');
bapi_test_assert(str_contains($guard, "add_filter('pre_as_enqueue_async_action'"), 'Action Scheduler enqueueing is not blocked');
bapi_test_assert(str_contains($guard, 'SELECT * FROM {$actions_table} ORDER BY action_id'), 'complete Action Scheduler actions are not snapshotted');
bapi_test_assert(str_contains($guard, "['pending', 'in-progress']"), 'active scheduler claims are not distinguished from historical rows');
bapi_test_assert(str_contains($guard, "'claim_rows' => count(\$claims)"), 'complete scheduler claim-row count is not retained');
bapi_test_assert(str_contains($guard, 'bapi_production_refresh_guard_queues_quiescent'), 'active scheduler claims are not rejected');

$temporary_dir = sys_get_temp_dir() . '/bapi-production-policy-test-' . bin2hex(random_bytes(8));
$package_output = $root . '/migration-inventory/production-package-test-' . bin2hex(random_bytes(8));
if (!mkdir($temporary_dir, 0700)) {
    throw new RuntimeException('Unable to create temporary test directory.');
}
try {
    foreach (['legacy-delta', 'headless-delta', 'legacy-inventory', 'headless-inventory'] as $fixture_dir) {
        if (!mkdir($temporary_dir . '/' . $fixture_dir, 0700)) {
            throw new RuntimeException("Unable to create fixture directory: {$fixture_dir}");
        }
    }
    $catalog_header = "post_type\tsku\tslug\tparent_sku\tpost_status\tpost_modified_gmt\tprice_hash\tinventory_hash\tcustomer_group_hash\tproduct_documents_hash\n";
    $legacy_price_hash = str_repeat('3', 64);
    $headless_price_hash = str_repeat('4', 64);
    bapi_test_write(
        $temporary_dir . '/legacy-delta/catalog-field-hashes.tsv',
        $catalog_header . "product\tETA-1\teta-1\t\tpublish\t2026-08-27 00:00:00\t{$legacy_price_hash}\t" .
        str_repeat('5', 64) . "\t" . str_repeat('6', 64) . "\t" . str_repeat('7', 64) . "\n"
    );
    $headless_catalog = $catalog_header .
        "product\tETA-1\teta-1\t\tpublish\t2026-08-27 00:00:00\t{$headless_price_hash}\t" .
        str_repeat('5', 64) . "\t" . str_repeat('6', 64) . "\t" . str_repeat('7', 64) . "\n" .
        "product\tETA-TARGET-ONLY\teta-target-only\t\tpublish\t2026-08-27 00:00:00\t" . str_repeat('a', 64) . "\t" .
        str_repeat('5', 64) . "\t" . str_repeat('6', 64) . "\t" . str_repeat('7', 64) . "\n";
    bapi_test_write($temporary_dir . '/headless-delta/catalog-field-hashes.tsv', $headless_catalog);
    $source_state_hash = str_repeat('8', 64);
    bapi_test_write(
        $temporary_dir . '/legacy-delta/order-user-relationships.tsv',
        "source_order_id\torder_key_hash\tpost_type\tpost_status\tpost_date_gmt\tpost_modified_gmt\tsource_user_id\tbilling_email_hash\tsource_user_exists\tsource_state_hash\n" .
        "1\t" . str_repeat('9', 64) . "\tshop_order\twc-processing\t2026-08-27 00:00:00\t2026-08-27 00:00:00\t0\t\t0\t{$source_state_hash}\n"
    );
    $media_fixture = "upload_path\tbytes\tsha256\tstatus\nWireless_QuantumSlim-v17.pdf\t0\t\tmissing\n";
    bapi_test_write($temporary_dir . '/legacy-delta/referenced-product-media-hashes.tsv', $media_fixture);
    bapi_test_write($temporary_dir . '/headless-delta/referenced-product-media-hashes.tsv', $media_fixture);
    $user_fixture = "user_id\temail_sha256\tuser_registered\n";
    bapi_test_write($temporary_dir . '/legacy-inventory/user-hash-manifest.tsv', $user_fixture);
    bapi_test_write($temporary_dir . '/headless-inventory/user-hash-manifest.tsv', $user_fixture);
    $document_fixture = "product_slug\tdocument_heading_hex\tupload_path_hex\n";
    bapi_test_write($temporary_dir . '/legacy-document-pairs.tsv', $document_fixture);
    bapi_test_write($temporary_dir . '/headless-document-pairs.tsv', $document_fixture);
    bapi_test_write(
        $temporary_dir . '/eta.sh',
        "update_price 'ETA-1' \"10.00\"\n" .
        "update_price 'ETA-MISSING' \"20.00\"\n" .
        "update_price 'ETA-TARGET-ONLY' \"30.00\"\n"
    );

    $package_command = implode(' ', array_map('escapeshellarg', [
        'bash',
        'scripts/prepare-wordpress-rehearsal-package.sh',
        '--legacy-delta', $temporary_dir . '/legacy-delta',
        '--headless-delta', $temporary_dir . '/headless-delta',
        '--legacy-inventory', $temporary_dir . '/legacy-inventory',
        '--headless-inventory', $temporary_dir . '/headless-inventory',
        '--legacy-document-pairs', $temporary_dir . '/legacy-document-pairs.tsv',
        '--headless-document-pairs', $temporary_dir . '/headless-document-pairs.tsv',
        '--eta-script', $temporary_dir . '/eta.sh',
        '--defer-policy',
        '--output-dir', substr($package_output, strlen($root) + 1),
    ]));
    $package_result = bapi_test_run($package_command, $root);
    bapi_test_assert(
        $package_result['exit_code'] === 0,
        'schema-v2 package generation failed: ' . implode("\n", $package_result['output'])
    );
    $order_lines = file($package_output . '/order-dry-run.tsv', FILE_IGNORE_NEW_LINES);
    bapi_test_assert(
        $order_lines === [
            "order_key_hash\tpost_type\tstatus\tcreated_gmt\tmodified_gmt\tbilling_email_hash\taccount_resolution\tsource_state_hash",
            str_repeat('9', 64) . "\tshop_order\twc-processing\t2026-08-27 00:00:00\t2026-08-27 00:00:00\t\tguest-order\t{$source_state_hash}",
        ],
        'schema-v2 order package did not preserve the approved source hash and guest disposition'
    );
    $eta_lines = file($package_output . '/eta-price-dry-run.tsv', FILE_IGNORE_NEW_LINES);
    bapi_test_assert(
        isset($eta_lines[1]) && str_contains($eta_lines[1], "\t{$headless_price_hash}\tcandidate-update"),
        'schema-v2 ETA package did not preserve the target before-state hash'
    );
    bapi_test_assert(
        isset($eta_lines[2]) && str_contains($eta_lines[2], "ETA-MISSING\t20.00\t0\t0\tno\t\treject-source-missing"),
        'schema-v2 ETA package did not reject an SKU absent from both systems as source-missing'
    );
    bapi_test_assert(
        isset($eta_lines[3]) && str_contains($eta_lines[3], "ETA-TARGET-ONLY\t30.00\t0\t1\tno\t" . str_repeat('a', 64) . "\treject-source-missing"),
        'schema-v2 ETA package did not reject a target-only SKU as source-missing'
    );

    $duplicate_target_row = "product\tETA-DUPLICATE\teta-duplicate\t\tpublish\t2026-08-27 00:00:00\t" .
        str_repeat('b', 64) . "\t" . str_repeat('5', 64) . "\t" . str_repeat('6', 64) . "\t" . str_repeat('7', 64) . "\n";
    bapi_test_write(
        $temporary_dir . '/headless-delta/catalog-field-hashes.tsv',
        $headless_catalog . $duplicate_target_row . $duplicate_target_row
    );
    bapi_test_write(
        $temporary_dir . '/eta.sh',
        "update_price 'ETA-1' \"10.00\"\nupdate_price 'ETA-DUPLICATE' \"40.00\"\n"
    );
    $duplicate_result = bapi_test_run($package_command, $root);
    bapi_test_assert($duplicate_result['exit_code'] !== 0, 'schema-v2 package accepted a duplicated target ETA key');
    bapi_test_assert(
        str_contains(implode("\n", $duplicate_result['output']), 'Ambiguous ETA key for SKU ETA-DUPLICATE: legacy=0, headless=2'),
        'schema-v2 package did not report the duplicated target ETA cardinality'
    );
    bapi_test_write($temporary_dir . '/headless-delta/catalog-field-hashes.tsv', $headless_catalog);
    bapi_test_write(
        $temporary_dir . '/eta.sh',
        "update_price 'ETA-1' \"10.00\"\nupdate_price 'ETA-MISSING' \"20.00\"\n"
    );

    bapi_test_write(
        $temporary_dir . '/legacy-delta/order-user-relationships.tsv',
        "source_order_id\torder_key_hash\tpost_type\tpost_status\tpost_date_gmt\tpost_modified_gmt\tsource_user_id\tbilling_email_hash\tsource_user_exists\n"
    );
    $stale_result = bapi_test_run($package_command, $root);
    bapi_test_assert($stale_result['exit_code'] !== 0, 'schema-v2 package accepted stale nine-column order evidence');

    bapi_test_write(
        $temporary_dir . '/eta-price-dry-run.tsv',
        "sku\ttarget_regular_price\tlegacy_records\theadless_records\tprice_hash_equal\theadless_price_hash\tdisposition\n" .
        "ETA-1\t10.00\t1\t1\tno\t" . str_repeat('1', 64) . "\tcandidate-update\n" .
        "ETA-2\t20.00\t0\t1\tno\t" . str_repeat('2', 64) . "\treject-source-missing\n"
    );
    bapi_test_write(
        $temporary_dir . '/product-document-media-dry-run.tsv',
        "upload_path\tlegacy_bytes\tlegacy_sha256\theadless_bytes\theadless_sha256\tdisposition\n" .
        "new.pdf\t1\t" . str_repeat('a', 64) . "\t\t\tcandidate-add\n" .
        "changed.pdf\t1\t" . str_repeat('b', 64) . "\t1\t" . str_repeat('c', 64) . "\tcandidate-replace\n" .
        "Wireless_QuantumSlim-v17.pdf\t\t\t\t\treject-source-missing\n"
    );
    bapi_test_write(
        $temporary_dir . '/product-document-mapping-additions.tsv',
        "product_slug\tdocument_heading_hex\tupload_path_hex\nproduct-one\t446174617368656574\t6e65772e706466\n"
    );
    bapi_test_write(
        $temporary_dir . '/order-dry-run.tsv',
        "order_key_hash\tpost_type\tstatus\tcreated_gmt\tmodified_gmt\tbilling_email_hash\taccount_resolution\tsource_state_hash\n" .
        str_repeat('d', 64) . "\tshop_order\twc-processing\t2026-01-01 00:00:00\t2026-01-01 00:00:00\t" .
        str_repeat('e', 64) . "\tlink-existing-headless-user\t" . str_repeat('f', 64) . "\n"
    );

    $order_meta_path = $temporary_dir . '/order-meta-keys.tsv';
    $order_meta = "meta_key\trow_count\torder_count\tclassification\n";
    foreach (BAPI_ORDER_BUSINESS_META_KEYS as $meta_key) {
        $order_meta .= "{$meta_key}\t1\t1\treview-required\n";
    }
    bapi_test_write($order_meta_path, $order_meta);

    $item_meta_path = $temporary_dir . '/order-item-meta-keys.tsv';
    $item_meta = "order_item_type\tmeta_key\trow_count\titem_count\torder_count\tclassification\n";
    foreach (BAPI_ORDER_LINE_META_KEYS as $meta_key) {
        $item_meta .= "line_item\t{$meta_key}\t1\t1\t1\treview-required\n";
    }
    bapi_test_write($item_meta_path, $item_meta);

    $command = implode(' ', array_map('escapeshellarg', [
        PHP_BINARY,
        $root . '/scripts/build-wordpress-production-policy.php',
        $temporary_dir,
        $order_meta_path,
        $item_meta_path,
        '2026-02-31T14:00:00Z',
    ]));
    exec($command . ' 2>&1', $output, $exit_code);
    bapi_test_assert($exit_code !== 0, 'schema-v2 policy builder accepted an impossible UTC timestamp');

    $command = implode(' ', array_map('escapeshellarg', [
        PHP_BINARY,
        $root . '/scripts/build-wordpress-production-policy.php',
        $temporary_dir,
        $order_meta_path,
        $item_meta_path,
        '2026-08-27T14:00:00Z',
    ]));
    $output = [];
    exec($command . ' 2>&1', $output, $exit_code);
    bapi_test_assert($exit_code === 0, 'schema-v2 policy builder failed: ' . implode("\n", $output));

    $policy_path = $temporary_dir . '/approved-policy.json';
    $policy = json_decode(file_get_contents($policy_path), true, 512, JSON_THROW_ON_ERROR);
    bapi_test_assert($policy['schemaVersion'] === 2, 'production policy schema is not version 2');
    bapi_test_assert($policy['orders']['approvedCandidateCount'] === 1, 'order count was not derived');
    bapi_test_assert(count($policy['orders']['businessMetaCounts']) === 4, 'business metadata counts are incomplete');
    bapi_test_assert(count($policy['orders']['lineMetaCounts']) === 87, 'line metadata counts are incomplete');
    bapi_test_assert($policy['prices']['approvedCandidateCount'] === 1, 'ETA count was not derived');
    bapi_test_assert($policy['productDocuments']['approvedMappingAddCount'] === 1, 'document mapping count was not derived');
    bapi_test_assert((fileperms($policy_path) & 0777) === 0600, 'production policy permissions are not 0600');
} finally {
    bapi_test_remove_tree($temporary_dir);
    bapi_test_remove_tree($package_output);
}

fwrite(STDOUT, "Production data-refresh safety tests passed.\n");
