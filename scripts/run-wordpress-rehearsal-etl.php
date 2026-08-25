<?php
/**
 * Run an approved WordPress data-refresh stage through WordPress/WooCommerce APIs.
 *
 * Usage:
 *   wp eval-file run-wordpress-rehearsal-etl.php eta-prices /secure/eta-price-dry-run.tsv dry-run \
 *     --path=/path/to/wordpress
 *
 * Apply mode additionally requires:
 *   BAPI_REHEARSAL_APPLY=YES wp eval-file run-wordpress-rehearsal-etl.php \
 *     eta-prices /secure/eta-price-dry-run.tsv apply --path=/path/to/wordpress
 */

if (!defined('ABSPATH') || !class_exists('WP_CLI')) {
    fwrite(STDERR, "ERROR: Run this file with wp eval-file.\n");
    exit(1);
}

const BAPI_REHEARSAL_OPTION = 'bapi_data_refresh_rehearsal';
const BAPI_APPROVED_POLICY_SHA256 = 'bf835b6166f6df76110fdd91a62175a422cea1e63584b19f03ee22a0df385470';
const BAPI_APPROVED_ORDER_PAYLOAD_SHA256 = '5c1752c80e045875c3772562f375a855dfdf987f0fc07bcd90cb5709db3e12ca';
const BAPI_ORDER_PAYLOAD_META = '_bapi_legacy_payload_sha256';

function bapi_rehearsal_fail(string $message): void
{
    WP_CLI::error($message);
}

function bapi_rehearsal_normalize_url(string $url): string
{
    return strtolower(rtrim($url, '/'));
}

function bapi_rehearsal_assert_target(string $rehearsal_marker): void
{
    $site_url = bapi_rehearsal_normalize_url((string) get_option('siteurl'));
    $home_url = bapi_rehearsal_normalize_url((string) get_option('home'));
    $approved_host = 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud';

    foreach ([$site_url, $home_url] as $candidate_url) {
        $host = strtolower((string) wp_parse_url($candidate_url, PHP_URL_HOST));
        if ($host !== $approved_host) {
            bapi_rehearsal_fail("Refusing target outside the approved rehearsal clone: {$candidate_url}");
        }
    }

    if (get_option(BAPI_REHEARSAL_OPTION) !== $rehearsal_marker) {
        bapi_rehearsal_fail(
            'Target is not marked as the disposable rehearsal clone. ' .
            'Set the bapi_data_refresh_rehearsal option only on the isolated clone.'
        );
    }
}

/**
 * @return array<string, mixed>
 */
function bapi_rehearsal_read_policy(string $manifest_path): array
{
    $policy_path = dirname($manifest_path) . '/approved-policy.json';
    $resolved_path = realpath($policy_path);
    if ($resolved_path === false || !is_readable($resolved_path)) {
        bapi_rehearsal_fail("Approved policy is not readable beside the manifest: {$policy_path}");
    }
    if (hash_file('sha256', $resolved_path) !== BAPI_APPROVED_POLICY_SHA256) {
        bapi_rehearsal_fail('Approved policy SHA-256 does not match the reviewed policy.');
    }

    $policy = json_decode((string) file_get_contents($resolved_path), true);
    if (!is_array($policy) || ($policy['schemaVersion'] ?? null) !== 1) {
        bapi_rehearsal_fail('Approved policy is malformed or has an unsupported schema.');
    }

    return $policy;
}

function bapi_rehearsal_assert_file_hash(string $path, $approved_hash, string $label): void
{
    if (!is_string($approved_hash) || !preg_match('/^[a-f0-9]{64}$/', $approved_hash)) {
        bapi_rehearsal_fail("Approved {$label} SHA-256 is missing or malformed.");
    }
    $resolved_path = realpath($path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_rehearsal_fail("{$label} is not a readable file: {$path}");
    }
    if (hash_file('sha256', $resolved_path) !== $approved_hash) {
        bapi_rehearsal_fail("{$label} SHA-256 does not match the reviewed manifest.");
    }
}

/**
 * @return array<int, array<string, string>>
 */
function bapi_rehearsal_read_tsv(string $manifest_path): array
{
    $resolved_path = realpath($manifest_path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_rehearsal_fail("Manifest is not a readable file: {$manifest_path}");
    }

    $handle = fopen($resolved_path, 'rb');
    if ($handle === false) {
        bapi_rehearsal_fail("Unable to open manifest: {$resolved_path}");
    }

    $headers = fgetcsv($handle, 0, "\t");
    if (!is_array($headers) || $headers === []) {
        fclose($handle);
        bapi_rehearsal_fail('Manifest header is missing.');
    }

    $rows = [];
    while (($values = fgetcsv($handle, 0, "\t")) !== false) {
        if ($values === [null] || $values === []) {
            continue;
        }
        if (count($values) !== count($headers)) {
            fclose($handle);
            bapi_rehearsal_fail('Manifest contains a malformed row.');
        }
        $row = array_combine($headers, $values);
        if ($row === false) {
            fclose($handle);
            bapi_rehearsal_fail('Manifest columns could not be combined.');
        }
        $rows[] = $row;
    }
    fclose($handle);

    return $rows;
}

/**
 * @return int[]
 */
function bapi_rehearsal_product_ids_by_sku(string $sku): array
{
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT DISTINCT posts.ID
         FROM {$wpdb->posts} posts
         INNER JOIN {$wpdb->postmeta} sku
           ON sku.post_id = posts.ID AND sku.meta_key = '_sku'
         WHERE posts.post_type IN ('product', 'product_variation')
           AND sku.meta_value = %s
         ORDER BY posts.ID",
        $sku
    );

    return array_map('intval', $wpdb->get_col($query));
}

/**
 * @return int[]
 */
function bapi_rehearsal_product_ids_by_slug(string $slug): array
{
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts}
         WHERE post_type = 'product' AND post_name = %s
         ORDER BY ID",
        $slug
    );

    return array_map('intval', $wpdb->get_col($query));
}

/**
 * @return int[]
 */
function bapi_rehearsal_order_ids_by_key(string $order_key): array
{
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT DISTINCT posts.ID
         FROM {$wpdb->posts} posts
         INNER JOIN {$wpdb->postmeta} order_key
           ON order_key.post_id = posts.ID AND order_key.meta_key = '_order_key'
         WHERE posts.post_type = 'shop_order'
           AND order_key.meta_value = %s
         ORDER BY posts.ID",
        $order_key
    );
    return array_map('intval', $wpdb->get_col($query));
}

/**
 * @return int[]
 */
function bapi_rehearsal_user_ids_by_email(string $email): array
{
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT ID FROM {$wpdb->users}
         WHERE LOWER(user_email) = LOWER(%s)
         ORDER BY ID",
        $email
    );
    return array_map('intval', $wpdb->get_col($query));
}

/**
 * @return int[]
 */
function bapi_rehearsal_attachment_ids_by_path(string $upload_path): array
{
    global $wpdb;

    $query = $wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta}
         WHERE meta_key = '_wp_attached_file' AND meta_value = %s
         ORDER BY post_id",
        $upload_path
    );

    return array_map('intval', $wpdb->get_col($query));
}

function bapi_rehearsal_assert_pdf_path(string $upload_path): void
{
    if (
        $upload_path === '' ||
        str_starts_with($upload_path, '/') ||
        preg_match('#(^|/)\.\.($|/)#', $upload_path) ||
        strtolower(pathinfo($upload_path, PATHINFO_EXTENSION)) !== 'pdf'
    ) {
        bapi_rehearsal_fail("Unsafe or non-PDF upload path: {$upload_path}");
    }
}

function bapi_rehearsal_is_document_meta_key(string $meta_key): bool
{
    return preg_match(
        '/^_?product_documents(?:_[0-9]+_(?:document_heading|document_file_repeater)(?:_[0-9]+_document_file)?)?$/',
        $meta_key
    ) === 1;
}

function bapi_rehearsal_is_document_file_key(string $meta_key): bool
{
    return $meta_key[0] !== '_' && preg_match(
        '/^product_documents_[0-9]+_document_file_repeater_[0-9]+_document_file$/',
        $meta_key
    ) === 1;
}

function bapi_rehearsal_update_post_meta(int $post_id, string $key, $value, string $context): void
{
    update_post_meta($post_id, $key, $value);
    $stored_value = get_post_meta($post_id, $key, true);
    if ((string) $stored_value !== (string) $value) {
        throw new RuntimeException("Unable to write {$context}.");
    }
}

/**
 * @param array<int, array<string, string>> $rows
 */
function bapi_rehearsal_run_eta_prices(array $rows, array $policy, bool $apply): void
{
    if (!function_exists('wc_get_product')) {
        bapi_rehearsal_fail('WooCommerce is not loaded. Do not use --skip-plugins for this stage.');
    }

    $required_columns = [
        'sku',
        'target_regular_price',
        'legacy_records',
        'headless_records',
        'price_hash_equal',
        'disposition',
    ];
    if ($rows === [] || array_diff($required_columns, array_keys($rows[0])) !== []) {
        bapi_rehearsal_fail('ETA manifest does not have the approved column set.');
    }

    $candidate_count = 0;
    $rejected_count = 0;
    foreach ($rows as $row) {
        if ($row['disposition'] === 'candidate-update') {
            $candidate_count++;
        } elseif ($row['disposition'] === 'reject-source-missing') {
            $rejected_count++;
        } else {
            bapi_rehearsal_fail("Unexpected ETA disposition for SKU {$row['sku']}: {$row['disposition']}");
        }
    }
    $approved_candidate_count = $policy['prices']['approvedCandidateCount'] ?? null;
    $approved_rejected_count = $policy['prices']['rejectedMissingCount'] ?? null;
    $approved_price_rule = $policy['prices']['activePriceRule'] ?? null;
    if ($approved_price_rule !== 'update-only-when-sale-price-empty') {
        bapi_rehearsal_fail('Approved ETA active-price rule is missing or unsupported.');
    }
    if ($candidate_count !== $approved_candidate_count || $rejected_count !== $approved_rejected_count) {
        bapi_rehearsal_fail(
            "ETA manifest totals changed: {$candidate_count} candidates, {$rejected_count} rejected."
        );
    }

    $counts = ['update' => 0, 'unchanged' => 0, 'rejected' => 0, 'conflict' => 0];
    $update_plan = [];
    foreach ($rows as $row) {
        $sku = trim($row['sku']);
        if ($row['disposition'] === 'reject-source-missing') {
            $counts['rejected']++;
            WP_CLI::log("rejected\t{$sku}\tsource-missing");
            continue;
        }

        if ($sku === '' || !preg_match('/^\d+(?:\.\d+)?$/', $row['target_regular_price'])) {
            bapi_rehearsal_fail("Invalid SKU or price in candidate row: {$sku}");
        }
        if ($row['legacy_records'] !== '1' || $row['headless_records'] !== '1') {
            bapi_rehearsal_fail("Approved candidate is no longer uniquely keyed: {$sku}");
        }

        $product_ids = bapi_rehearsal_product_ids_by_sku($sku);
        if (count($product_ids) !== 1) {
            $counts['conflict']++;
            WP_CLI::log("conflict\t{$sku}\ttarget-records=" . count($product_ids));
            continue;
        }

        $product = wc_get_product($product_ids[0]);
        if (!$product) {
            $counts['conflict']++;
            WP_CLI::log("conflict\t{$sku}\twoocommerce-product-unavailable");
            continue;
        }

        $target_price = wc_format_decimal($row['target_regular_price']);
        if ($product->get_regular_price('edit') === $target_price) {
            $counts['unchanged']++;
            WP_CLI::log("unchanged\t{$sku}\t{$target_price}");
            continue;
        }

        $counts['update']++;
        WP_CLI::log(
            ($apply ? 'update' : 'would-update') .
            "\t{$sku}\t{$product->get_regular_price('edit')}\t{$target_price}"
        );
        $update_plan[] = compact('product', 'target_price');
    }

    WP_CLI::log('summary\t' . wp_json_encode($counts));
    if ($counts['conflict'] > 0) {
        bapi_rehearsal_fail('ETA stage has conflicts; no writes were performed.');
    }
    if (!$apply) {
        return;
    }

    global $wpdb;
    if ($wpdb->query('START TRANSACTION') === false) {
        bapi_rehearsal_fail('Unable to start database transaction for ETA prices.');
    }
    try {
        foreach ($update_plan as $item) {
            $product = $item['product'];
            $target_price = $item['target_price'];
            $product->set_regular_price($target_price);
            if ($product->get_sale_price('edit') === '') {
                $product->set_price($target_price);
            }
            if (!$product->save()) {
                throw new RuntimeException('WooCommerce could not save an approved ETA price.');
            }
        }
        if ($wpdb->query('COMMIT') === false) {
            throw new RuntimeException('Database commit failed for ETA prices.');
        }
    } catch (Throwable $error) {
        $rollback_result = $wpdb->query('ROLLBACK');
        $rollback_message = $rollback_result === false ? ' Database rollback also failed.' : '';
        bapi_rehearsal_fail('ETA apply rolled back: ' . $error->getMessage() . $rollback_message);
    }
}

/**
 * @param array<int, array<string, string>> $media_rows
 * @param array<int, array<string, string>> $mapping_rows
 */
function bapi_rehearsal_run_product_documents(
    string $package_dir,
    array $media_rows,
    array $mapping_rows,
    array $policy,
    bool $apply
): void {
    $approved_adds = $policy['productDocuments']['approvedAddCount'] ?? null;
    $approved_replacements = $policy['productDocuments']['approvedReplaceCount'] ?? null;
    $approved_mapping_adds = $policy['productDocuments']['approvedMappingAddCount'] ?? null;
    $approved_mapping_parents = $policy['productDocuments']['approvedMappingParentCount'] ?? null;
    $excluded_path = $policy['productDocuments']['excludedPath'] ?? null;

    $media_counts = ['candidate-add' => 0, 'candidate-replace' => 0, 'reject-source-missing' => 0];
    foreach ($media_rows as $row) {
        if (!isset($media_counts[$row['disposition']])) {
            bapi_rehearsal_fail("Unexpected PDF disposition for {$row['upload_path']}: {$row['disposition']}");
        }
        $media_counts[$row['disposition']]++;
    }
    if (
        $media_counts['candidate-add'] !== $approved_adds ||
        $media_counts['candidate-replace'] !== $approved_replacements ||
        $media_counts['reject-source-missing'] !== 1
    ) {
        bapi_rehearsal_fail('PDF manifest totals do not match the approved policy.');
    }

    $mappings_by_slug = [];
    $mapping_keys = [];
    foreach ($mapping_rows as $row) {
        $slug = $row['product_slug'];
        $heading_hex = $row['document_heading_hex'];
        $upload_path_hex = $row['upload_path_hex'];
        if ($slug === '' || $heading_hex === '' || $upload_path_hex === '') {
            bapi_rehearsal_fail("Incomplete product-document mapping row for {$slug}");
        }
        foreach ([$heading_hex, $upload_path_hex] as $value_hex) {
            if (!ctype_xdigit($value_hex) || strlen($value_hex) % 2 !== 0) {
                bapi_rehearsal_fail("Malformed product-document mapping for {$slug}");
            }
        }
        $heading = hex2bin($heading_hex);
        $upload_path = hex2bin($upload_path_hex);
        if ($heading === false || $upload_path === false || $heading === '') {
            bapi_rehearsal_fail("Unable to decode product-document mapping for {$slug}");
        }
        if (preg_match('/\[\/?(?:vc_|wpb_)|visual.?composer|wpbakery|js_composer|revslider|ess_grid/i', $heading)) {
            bapi_rehearsal_fail("Page-builder marker rejected for {$slug}");
        }
        bapi_rehearsal_assert_pdf_path($upload_path);
        $mapping_key = $slug . "\0" . $heading . "\0" . $upload_path;
        if (isset($mapping_keys[$mapping_key])) {
            bapi_rehearsal_fail("Duplicate product-document mapping for {$slug}: {$upload_path}");
        }
        $mapping_keys[$mapping_key] = true;
        $mappings_by_slug[$slug][] = compact('heading', 'upload_path');
    }
    if (count($mapping_rows) !== $approved_mapping_adds || count($mappings_by_slug) !== $approved_mapping_parents) {
        bapi_rehearsal_fail('Additive product-document mapping totals do not match the approved policy.');
    }

    $uploads = wp_upload_dir();
    if (!empty($uploads['error']) || empty($uploads['basedir'])) {
        bapi_rehearsal_fail('WordPress uploads directory is unavailable.');
    }
    $uploads_dir = rtrim($uploads['basedir'], '/');
    $quarantine_dir = realpath($package_dir . '/media-quarantine');
    if ($quarantine_dir === false || !is_dir($quarantine_dir)) {
        bapi_rehearsal_fail('Verified media quarantine directory is missing.');
    }

    $approved_paths = [];
    $manifest_paths = [];
    $media_plan = [];
    $media_summary = ['add' => 0, 'replace' => 0, 'unchanged' => 0, 'rejected' => 0, 'conflict' => 0];
    foreach ($media_rows as $row) {
        $upload_path = $row['upload_path'];
        if (isset($manifest_paths[$upload_path])) {
            bapi_rehearsal_fail("Duplicate PDF manifest path: {$upload_path}");
        }
        $manifest_paths[$upload_path] = true;
        if ($row['disposition'] === 'reject-source-missing') {
            if ($upload_path !== $excluded_path) {
                bapi_rehearsal_fail("Unexpected rejected PDF path: {$upload_path}");
            }
            $media_summary['rejected']++;
            continue;
        }

        bapi_rehearsal_assert_pdf_path($upload_path);
        $approved_paths[$upload_path] = true;
        $source_file = realpath($quarantine_dir . '/' . $upload_path);
        if ($source_file === false || !str_starts_with($source_file, $quarantine_dir . DIRECTORY_SEPARATOR)) {
            bapi_rehearsal_fail("Approved source PDF is absent from quarantine: {$upload_path}");
        }
        if (hash_file('sha256', $source_file) !== $row['legacy_sha256']) {
            bapi_rehearsal_fail("Source PDF hash mismatch: {$upload_path}");
        }

        $target_file = $uploads_dir . '/' . $upload_path;
        $target_hash = is_file($target_file) ? hash_file('sha256', $target_file) : '';
        $attachment_ids = bapi_rehearsal_attachment_ids_by_path($upload_path);
        $action = '';
        if ($target_hash === $row['legacy_sha256'] && count($attachment_ids) === 1) {
            $action = 'unchanged';
        } elseif (
            $row['disposition'] === 'candidate-add' &&
            count($attachment_ids) === 0 &&
            in_array($target_hash, ['', $row['legacy_sha256']], true)
        ) {
            $action = 'add';
        } elseif (
            $row['disposition'] === 'candidate-replace' &&
            $target_hash === $row['headless_sha256'] &&
            count($attachment_ids) === 1
        ) {
            $action = 'replace';
        } else {
            $action = 'conflict';
            WP_CLI::log(
                "media-conflict\t{$upload_path}\ttarget-hash={$target_hash}\tattachments=" .
                count($attachment_ids)
            );
        }
        $media_summary[$action]++;
        $install_file = $target_hash !== $row['legacy_sha256'];
        $media_plan[] = compact('upload_path', 'source_file', 'target_file', 'action', 'install_file');
    }

    $mapping_plan = [];
    $mapping_summary = ['add' => 0, 'unchanged' => 0, 'conflict' => 0];
    foreach ($mappings_by_slug as $slug => $mappings) {
        $product_ids = bapi_rehearsal_product_ids_by_slug($slug);
        if (count($product_ids) !== 1) {
            $mapping_summary['conflict'] += count($mappings);
            WP_CLI::log("mapping-conflict\t{$slug}\ttarget-products=" . count($product_ids));
            continue;
        }

        $product_id = $product_ids[0];
        $group_count = (int) get_post_meta($product_id, 'product_documents', true);
        $heading_indexes = [];
        $current_pairs = [];
        for ($group_index = 0; $group_index < $group_count; $group_index++) {
            $heading = (string) get_post_meta(
                $product_id,
                "product_documents_{$group_index}_document_heading",
                true
            );
            $heading_indexes[$heading] = $group_index;
            $file_count = (int) get_post_meta(
                $product_id,
                "product_documents_{$group_index}_document_file_repeater",
                true
            );
            for ($file_index = 0; $file_index < $file_count; $file_index++) {
                $attachment_id = (int) get_post_meta(
                    $product_id,
                    "product_documents_{$group_index}_document_file_repeater_{$file_index}_document_file",
                    true
                );
                $path = (string) get_post_meta($attachment_id, '_wp_attached_file', true);
                if ($path !== '') {
                    $current_pairs[$heading . "\0" . $path] = true;
                }
            }
        }

        foreach ($mappings as $mapping) {
            $pair_key = $mapping['heading'] . "\0" . $mapping['upload_path'];
            $attachment_count = count(bapi_rehearsal_attachment_ids_by_path($mapping['upload_path']));
            if (
                $attachment_count > 1 ||
                ($attachment_count === 0 && !isset($approved_paths[$mapping['upload_path']]))
            ) {
                $mapping_summary['conflict']++;
                WP_CLI::log(
                    "mapping-conflict\t{$slug}\t{$mapping['upload_path']}\tattachments={$attachment_count}"
                );
                continue;
            }
            if (isset($current_pairs[$pair_key])) {
                $mapping_summary['unchanged']++;
                continue;
            }
            $mapping_summary['add']++;
            $mapping_plan[] = [
                'product_id' => $product_id,
                'slug' => $slug,
                'heading' => $mapping['heading'],
                'upload_path' => $mapping['upload_path'],
                'group_index' => $heading_indexes[$mapping['heading']] ?? null,
            ];
        }
    }

    WP_CLI::log('media-summary\t' . wp_json_encode($media_summary));
    WP_CLI::log('mapping-summary\t' . wp_json_encode($mapping_summary));
    if ($media_summary['conflict'] > 0 || $mapping_summary['conflict'] > 0) {
        bapi_rehearsal_fail('Product-document preflight has conflicts; no writes were performed.');
    }
    if (!$apply) {
        return;
    }

    global $wpdb;
    $file_rollbacks = [];
    if ($wpdb->query('START TRANSACTION') === false) {
        bapi_rehearsal_fail('Unable to start database transaction for product documents.');
    }
    try {
        foreach ($media_plan as $item) {
            if (!in_array($item['action'], ['add', 'replace'], true)) {
                continue;
            }
            if ($item['install_file']) {
                if (!wp_mkdir_p(dirname($item['target_file']))) {
                    throw new RuntimeException("Unable to create PDF directory: {$item['upload_path']}");
                }
                $backup_file = null;
                if (is_file($item['target_file'])) {
                    $backup_file = $item['target_file'] . '.bapi-backup-' . wp_generate_password(12, false);
                    if (!copy($item['target_file'], $backup_file)) {
                        throw new RuntimeException("Unable to back up target PDF: {$item['upload_path']}");
                    }
                }
                $file_rollbacks[] = ['target_file' => $item['target_file'], 'backup_file' => $backup_file];
                $temporary_file = $item['target_file'] . '.bapi-rehearsal-' . wp_generate_password(12, false);
                if (!copy($item['source_file'], $temporary_file) || !rename($temporary_file, $item['target_file'])) {
                    @unlink($temporary_file);
                    throw new RuntimeException("Unable to install approved PDF: {$item['upload_path']}");
                }
                if (hash_file('sha256', $item['target_file']) !== hash_file('sha256', $item['source_file'])) {
                    throw new RuntimeException("Installed PDF hash mismatch: {$item['upload_path']}");
                }
            }
            if ($item['action'] === 'add') {
                $attachment_id = wp_insert_attachment(
                    [
                        'post_mime_type' => 'application/pdf',
                        'post_title' => pathinfo($item['upload_path'], PATHINFO_FILENAME),
                        'post_status' => 'inherit',
                    ],
                    $item['target_file']
                );
                if (is_wp_error($attachment_id)) {
                    throw new RuntimeException("Unable to create attachment for {$item['upload_path']}");
                }
                if (!update_attached_file($attachment_id, $item['target_file'])) {
                    throw new RuntimeException("Unable to attach approved PDF path: {$item['upload_path']}");
                }
            }
        }

        foreach ($mapping_plan as $item) {
            $attachment_ids = bapi_rehearsal_attachment_ids_by_path($item['upload_path']);
            if (count($attachment_ids) !== 1) {
                throw new RuntimeException("Attachment mapping failed after PDF install: {$item['upload_path']}");
            }

            $group_index = $item['group_index'];
            if ($group_index === null) {
                $group_index = (int) get_post_meta($item['product_id'], 'product_documents', true);
                bapi_rehearsal_update_post_meta(
                    $item['product_id'],
                    'product_documents',
                    $group_index + 1,
                    "product-document group for {$item['slug']}"
                );
                bapi_rehearsal_update_post_meta(
                    $item['product_id'],
                    '_product_documents',
                    'field_5b36662c0ea5c',
                    "product-document field key for {$item['slug']}"
                );
                bapi_rehearsal_update_post_meta(
                    $item['product_id'],
                    "product_documents_{$group_index}_document_heading",
                    $item['heading'],
                    "product-document heading for {$item['slug']}"
                );
                bapi_rehearsal_update_post_meta(
                    $item['product_id'],
                    "_product_documents_{$group_index}_document_heading",
                    'field_5b3668d50ea5d',
                    "product-document heading key for {$item['slug']}"
                );
                bapi_rehearsal_update_post_meta(
                    $item['product_id'],
                    "_product_documents_{$group_index}_document_file_repeater",
                    'field_5b3669070ea5e',
                    "product-document repeater key for {$item['slug']}"
                );
            }

            $repeater_key = "product_documents_{$group_index}_document_file_repeater";
            $file_index = (int) get_post_meta($item['product_id'], $repeater_key, true);
            bapi_rehearsal_update_post_meta(
                $item['product_id'],
                $repeater_key,
                $file_index + 1,
                "product-document repeater for {$item['slug']}"
            );
            bapi_rehearsal_update_post_meta(
                $item['product_id'],
                "_{$repeater_key}_{$file_index}_document_file",
                'field_5b36760f19e3d',
                "product-document file key for {$item['slug']}"
            );
            bapi_rehearsal_update_post_meta(
                $item['product_id'],
                "{$repeater_key}_{$file_index}_document_file",
                (string) $attachment_ids[0],
                "product-document file for {$item['slug']}"
            );
        }
        if ($wpdb->query('COMMIT') === false) {
            throw new RuntimeException('Database commit failed for product documents.');
        }
        foreach ($file_rollbacks as $rollback) {
            if (is_string($rollback['backup_file'])) {
                if (!unlink($rollback['backup_file'])) {
                    WP_CLI::warning("Unable to remove PDF backup after commit: {$rollback['backup_file']}");
                }
            }
        }
    } catch (Throwable $error) {
        $rollback_errors = [];
        if ($wpdb->query('ROLLBACK') === false) {
            $rollback_errors[] = 'database rollback failed';
        }
        foreach (array_reverse($file_rollbacks) as $rollback) {
            if (is_string($rollback['backup_file']) && is_file($rollback['backup_file'])) {
                if (!rename($rollback['backup_file'], $rollback['target_file'])) {
                    $rollback_errors[] = "could not restore {$rollback['target_file']}";
                }
            } elseif (is_file($rollback['target_file']) && !unlink($rollback['target_file'])) {
                $rollback_errors[] = "could not remove {$rollback['target_file']}";
            }
        }
        $rollback_message = $rollback_errors === []
            ? 'Rollback completed.'
            : 'ROLLBACK INCOMPLETE: ' . implode('; ', $rollback_errors) . '.';
        bapi_rehearsal_fail(
            'Product-document apply failed: ' . $error->getMessage() . ' ' . $rollback_message
        );
    }
}

/**
 * @return array<int, array<string, mixed>>
 */
function bapi_rehearsal_read_orders(string $payload_path, array $policy): array
{
    $resolved_path = realpath($payload_path);
    if ($resolved_path === false || !is_file($resolved_path) || !is_readable($resolved_path)) {
        bapi_rehearsal_fail("Order payload is not readable: {$payload_path}");
    }
    if (hash_file('sha256', $resolved_path) !== BAPI_APPROVED_ORDER_PAYLOAD_SHA256) {
        bapi_rehearsal_fail('Order payload SHA-256 does not match the approved fresh export.');
    }

    $handle = fopen($resolved_path, 'rb');
    if ($handle === false) {
        bapi_rehearsal_fail("Unable to open order payload: {$resolved_path}");
    }
    $orders = [];
    $keys = [];
    $statuses = [];
    $resolutions = [];
    while (($line = fgets($handle)) !== false) {
        try {
            $order = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $error) {
            fclose($handle);
            bapi_rehearsal_fail('Order payload contains malformed JSON.');
        }
        if (!is_array($order) || ($order['schema_version'] ?? null) !== 1) {
            fclose($handle);
            bapi_rehearsal_fail('Order payload contains an unsupported schema.');
        }
        $order_key = $order['order_key'] ?? '';
        $order_key_hash = $order['order_key_hash'] ?? '';
        if (
            !is_string($order_key) || $order_key === '' ||
            !is_string($order_key_hash) || hash('sha256', $order_key) !== $order_key_hash ||
            isset($keys[$order_key_hash])
        ) {
            fclose($handle);
            bapi_rehearsal_fail('Order payload contains a malformed or duplicate order key.');
        }
        $encoded = wp_json_encode($order, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (!is_string($encoded) || preg_match('/\[\/?(?:vc_|wpb_)|visual.?composer|wpbakery|js_composer|revslider|ess_grid/i', $encoded)) {
            fclose($handle);
            bapi_rehearsal_fail("Page-builder marker rejected for order {$order_key_hash}.");
        }
        foreach (['billing', 'shipping', 'totals', 'line_items', 'shipping_items', 'fee_items', 'coupon_items', 'tax_items', 'notes'] as $field) {
            if (!isset($order[$field]) || !is_array($order[$field])) {
                fclose($handle);
                bapi_rehearsal_fail("Order payload field is missing or malformed: {$field}");
            }
        }
        $status = $order['status'] ?? '';
        $resolution = $order['account_resolution'] ?? '';
        if (!in_array($status, ['processing', 'pending', 'failed'], true)) {
            fclose($handle);
            bapi_rehearsal_fail("Unsupported source order status: {$status}");
        }
        if (!in_array($resolution, ['link-existing-headless-user', 'legacy-account-review', 'guest-order'], true)) {
            fclose($handle);
            bapi_rehearsal_fail("Unsupported account resolution: {$resolution}");
        }
        if (($order['currency'] ?? '') !== 'USD' || $order['line_items'] === []) {
            fclose($handle);
            bapi_rehearsal_fail("Unsupported currency or empty order: {$order_key_hash}");
        }

        $keys[$order_key_hash] = true;
        $statuses[$status] = ($statuses[$status] ?? 0) + 1;
        $resolutions[$resolution] = ($resolutions[$resolution] ?? 0) + 1;
        $order['_payload_sha256'] = hash('sha256', $encoded);
        $orders[] = $order;
    }
    fclose($handle);

    $expected_count = $policy['orders']['approvedCandidateCount'] ?? null;
    $expected_statuses = ['processing' => 358, 'pending' => 308, 'failed' => 3];
    $expected_resolutions = [
        'link-existing-headless-user' => 216,
        'legacy-account-review' => 123,
        'guest-order' => 330,
    ];
    ksort($statuses);
    ksort($resolutions);
    ksort($expected_statuses);
    ksort($expected_resolutions);
    if (
        count($orders) !== $expected_count ||
        $statuses !== $expected_statuses ||
        $resolutions !== $expected_resolutions
    ) {
        bapi_rehearsal_fail('Order payload totals do not match the approved policy and fresh manifest.');
    }
    return $orders;
}

function bapi_rehearsal_order_date($value): ?WC_DateTime
{
    if ($value === null || $value === '') {
        return null;
    }
    if (!is_string($value) || preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/', $value) !== 1) {
        bapi_rehearsal_fail('Order payload contains a malformed UTC date.');
    }
    return new WC_DateTime($value, new DateTimeZone('UTC'));
}

/**
 * @param array<string, mixed> $payload
 * @param array<string, WC_Product> $products
 */
function bapi_rehearsal_populate_order(WC_Order $order, array $payload, array $products, int $customer_id): void
{
    $order->set_customer_id($customer_id);
    $order->set_order_key($payload['order_key']);
    $order->set_status($payload['status']);
    $order->set_currency($payload['currency']);
    $order->set_prices_include_tax((bool) $payload['prices_include_tax']);
    $order->set_date_created(bapi_rehearsal_order_date($payload['date_created_gmt']));
    $order->set_date_modified(bapi_rehearsal_order_date($payload['date_modified_gmt']));
    $order->set_date_paid(bapi_rehearsal_order_date($payload['date_paid_gmt']));
    $order->set_date_completed(bapi_rehearsal_order_date($payload['date_completed_gmt']));
    $order->set_customer_note((string) $payload['customer_note']);
    $order->set_payment_method((string) $payload['payment_method']);
    $order->set_payment_method_title((string) $payload['payment_method_title']);
    $order->set_created_via('bapi-legacy-refresh');
    $order->set_address($payload['billing'], 'billing');
    $order->set_address($payload['shipping'], 'shipping');

    foreach ($payload['line_items'] as $data) {
        $sku = (string) ($data['sku'] ?? '');
        $item = new WC_Order_Item_Product();
        $item->set_product($products[$sku]);
        $item->set_name((string) $data['name']);
        $item->set_quantity((int) $data['quantity']);
        $item->set_subtotal((string) $data['subtotal']);
        $item->set_subtotal_tax((string) $data['subtotal_tax']);
        $item->set_total((string) $data['total']);
        $item->set_total_tax((string) $data['total_tax']);
        $item->set_taxes($data['taxes']);
        $order->add_item($item);
    }
    foreach ($payload['shipping_items'] as $data) {
        $item = new WC_Order_Item_Shipping();
        $item->set_method_title((string) $data['name']);
        $item->set_method_id((string) $data['method_id']);
        $item->set_instance_id((string) $data['instance_id']);
        $item->set_total((string) $data['total']);
        $item->set_taxes($data['taxes']);
        $order->add_item($item);
    }
    foreach ($payload['fee_items'] as $data) {
        $item = new WC_Order_Item_Fee();
        $item->set_name((string) $data['name']);
        $item->set_tax_class((string) $data['tax_class']);
        $item->set_tax_status((string) $data['tax_status']);
        $item->set_amount((string) $data['amount']);
        $item->set_total((string) $data['total']);
        $item->set_taxes($data['taxes']);
        $order->add_item($item);
    }
    foreach ($payload['coupon_items'] as $data) {
        $item = new WC_Order_Item_Coupon();
        $item->set_code((string) $data['code']);
        $item->set_discount((string) $data['discount']);
        $item->set_discount_tax((string) $data['discount_tax']);
        $order->add_item($item);
    }
    foreach ($payload['tax_items'] as $data) {
        $item = new WC_Order_Item_Tax();
        $item->set_rate_code((string) $data['rate_code']);
        $item->set_label((string) $data['label']);
        $item->set_compound((bool) $data['compound']);
        $item->set_tax_total((string) $data['tax_total']);
        $item->set_shipping_tax_total((string) $data['shipping_tax_total']);
        $order->add_item($item);
    }

    $order->set_discount_total((string) $payload['totals']['discount_total']);
    $order->set_discount_tax((string) $payload['totals']['discount_tax']);
    $order->set_shipping_total((string) $payload['totals']['shipping_total']);
    $order->set_shipping_tax((string) $payload['totals']['shipping_tax']);
    $order->set_cart_tax((string) $payload['totals']['cart_tax']);
    $order->set_total((string) $payload['totals']['total']);
    $order->update_meta_data(BAPI_ORDER_PAYLOAD_META, $payload['_payload_sha256']);
}

/**
 * @param array<int, array<string, mixed>> $orders
 */
function bapi_rehearsal_run_orders(array $orders, bool $apply): void
{
    if (!function_exists('wc_create_order') || !class_exists('WC_Order_Item_Product')) {
        bapi_rehearsal_fail('WooCommerce is not loaded. Do not use --skip-plugins for this stage.');
    }

    $summary = ['insert' => 0, 'unchanged' => 0, 'conflict' => 0];
    $plan = [];
    foreach ($orders as $payload) {
        $billing_email = strtolower(trim((string) ($payload['billing']['email'] ?? '')));
        $customer_id = 0;
        if ($payload['account_resolution'] === 'link-existing-headless-user') {
            $user_ids = bapi_rehearsal_user_ids_by_email($billing_email);
            if ($billing_email === '' || count($user_ids) !== 1) {
                $summary['conflict']++;
                WP_CLI::log("order-conflict\t{$payload['order_key_hash']}\ttarget-users=" . count($user_ids));
                continue;
            }
            $customer_id = $user_ids[0];
        }

        $order_ids = bapi_rehearsal_order_ids_by_key($payload['order_key']);
        if (count($order_ids) > 1) {
            $summary['conflict']++;
            WP_CLI::log("order-conflict\t{$payload['order_key_hash']}\ttarget-orders=" . count($order_ids));
            continue;
        }
        if (count($order_ids) === 1) {
            $existing = wc_get_order($order_ids[0]);
            $stored_hash = $existing ? (string) $existing->get_meta(BAPI_ORDER_PAYLOAD_META, true) : '';
            if (
                $existing instanceof WC_Order &&
                !($existing instanceof WC_Order_Refund) &&
                $stored_hash === $payload['_payload_sha256'] &&
                $existing->get_status() === $payload['status'] &&
                $existing->get_customer_id() === $customer_id &&
                $existing->get_total('edit') === wc_format_decimal($payload['totals']['total'])
            ) {
                $summary['unchanged']++;
                continue;
            }
            $summary['conflict']++;
            WP_CLI::log("order-conflict\t{$payload['order_key_hash']}\ttarget-order-exists");
            continue;
        }

        $products = [];
        $product_conflict = false;
        foreach ($payload['line_items'] as $data) {
            $sku = (string) ($data['sku'] ?? '');
            if (isset($products[$sku])) {
                continue;
            }
            $product_ids = bapi_rehearsal_product_ids_by_sku($sku);
            if (count($product_ids) > 1) {
                $line_name = (string) ($data['name'] ?? '');
                $product_ids = array_values(array_filter(
                    $product_ids,
                    static fn(int $product_id): bool =>
                        (string) get_post_field('post_title', $product_id) === $line_name
                ));
            }
            $product = count($product_ids) === 1 ? wc_get_product($product_ids[0]) : false;
            if (!$product) {
                $summary['conflict']++;
                $product_conflict = true;
                WP_CLI::log("order-conflict\t{$payload['order_key_hash']}\tsku={$sku}\ttarget-products=" . count($product_ids));
                break;
            }
            $products[$sku] = $product;
        }
        if ($product_conflict) {
            continue;
        }

        $summary['insert']++;
        $plan[] = compact('payload', 'customer_id', 'products');
    }

    WP_CLI::log('order-summary\t' . wp_json_encode($summary));
    if ($summary['conflict'] > 0) {
        bapi_rehearsal_fail('Order preflight has conflicts; no writes were performed.');
    }
    if (!$apply) {
        return;
    }

    global $wpdb;
    if ($wpdb->query('START TRANSACTION') === false) {
        bapi_rehearsal_fail('Unable to start database transaction for orders.');
    }
    try {
        foreach ($plan as $item) {
            $order = wc_create_order(['status' => 'pending', 'customer_id' => $item['customer_id']]);
            if (is_wp_error($order) || !$order instanceof WC_Order) {
                throw new RuntimeException('WooCommerce could not create an approved order.');
            }
            bapi_rehearsal_populate_order($order, $item['payload'], $item['products'], $item['customer_id']);
            $order_id = $order->save();
            if (!$order_id) {
                throw new RuntimeException('WooCommerce could not save an approved order.');
            }
            foreach ($item['payload']['notes'] as $note) {
                $date = bapi_rehearsal_order_date($note['date_created_gmt']);
                $date_gmt = $date ? $date->format('Y-m-d H:i:s') : current_time('mysql', true);
                $comment_id = wp_insert_comment([
                    'comment_post_ID' => $order_id,
                    'comment_author' => (string) $note['added_by'],
                    'comment_content' => (string) $note['content'],
                    'comment_type' => 'order_note',
                    'comment_agent' => 'WooCommerce',
                    'comment_approved' => 1,
                    'comment_date' => get_date_from_gmt($date_gmt),
                    'comment_date_gmt' => $date_gmt,
                    'user_id' => 0,
                    'comment_meta' => [
                        'is_customer_note' => !empty($note['customer_note']) ? 1 : 0,
                        'added_by' => (string) $note['added_by'],
                    ],
                ]);
                if (!$comment_id) {
                    throw new RuntimeException('WordPress could not preserve an approved order note.');
                }
            }
        }
        if ($wpdb->query('COMMIT') === false) {
            throw new RuntimeException('Database commit failed for orders.');
        }
    } catch (Throwable $error) {
        $rollback_result = $wpdb->query('ROLLBACK');
        $rollback_message = $rollback_result === false ? ' Database rollback also failed.' : '';
        bapi_rehearsal_fail('Order apply rolled back: ' . $error->getMessage() . $rollback_message);
    }
}

$stage = $args[0] ?? '';
$input_path = $args[1] ?? '';
$mode = $args[2] ?? 'dry-run';

if (!in_array($stage, ['eta-prices', 'product-documents', 'orders'], true) || $input_path === '' || !in_array($mode, ['dry-run', 'apply'], true)) {
    bapi_rehearsal_fail(
        'Usage: wp eval-file run-wordpress-rehearsal-etl.php ' .
        '<eta-prices manifest|product-documents package-dir|orders package-dir> <dry-run|apply> --path=<wordpress-path>'
    );
}

$manifest_path = $stage === 'eta-prices'
    ? $input_path
    : rtrim($input_path, '/') . ($stage === 'orders' ? '/orders.jsonl' : '/product-document-media-dry-run.tsv');
$policy = bapi_rehearsal_read_policy($manifest_path);
$rehearsal_marker = $policy['rehearsalMarker'] ?? '';
if (!is_string($rehearsal_marker) || $rehearsal_marker === '') {
    bapi_rehearsal_fail('Approved policy does not contain a rehearsal marker.');
}
bapi_rehearsal_assert_target($rehearsal_marker);
$package_dir = rtrim($input_path, '/');
if ($stage === 'eta-prices') {
    bapi_rehearsal_assert_file_hash(
        $manifest_path,
        $policy['prices']['manifestSha256'] ?? null,
        'ETA manifest'
    );
} elseif ($stage === 'product-documents') {
    bapi_rehearsal_assert_file_hash(
        $package_dir . '/product-document-media-dry-run.tsv',
        $policy['productDocuments']['mediaManifestSha256'] ?? null,
        'product-document media manifest'
    );
    bapi_rehearsal_assert_file_hash(
        $package_dir . '/product-document-mapping-additions.tsv',
        $policy['productDocuments']['mappingManifestSha256'] ?? null,
        'product-document mapping manifest'
    );
}
$apply = $mode === 'apply';
if ($apply && getenv('BAPI_REHEARSAL_APPLY') !== 'YES') {
    bapi_rehearsal_fail('Apply mode requires BAPI_REHEARSAL_APPLY=YES.');
}

if ($stage === 'eta-prices') {
    $rows = bapi_rehearsal_read_tsv($manifest_path);
    bapi_rehearsal_run_eta_prices($rows, $policy, $apply);
    WP_CLI::success($apply ? 'ETA price stage applied.' : 'ETA price dry run complete; no writes performed.');
} elseif ($stage === 'product-documents') {
    $media_rows = bapi_rehearsal_read_tsv($package_dir . '/product-document-media-dry-run.tsv');
    $mapping_rows = bapi_rehearsal_read_tsv($package_dir . '/product-document-mapping-additions.tsv');
    bapi_rehearsal_run_product_documents($package_dir, $media_rows, $mapping_rows, $policy, $apply);
    WP_CLI::success($apply ? 'Product-document stage applied.' : 'Product-document dry run complete; no writes performed.');
} else {
    $orders = bapi_rehearsal_read_orders($manifest_path, $policy);
    bapi_rehearsal_run_orders($orders, $apply);
    WP_CLI::success($apply ? 'Order stage applied.' : 'Order dry run complete; no writes performed.');
}