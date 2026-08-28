<?php
/**
 * Apply a schema-v2 production-contract package to the disposable rehearsal clone only.
 *
 * Required environment:
 *   BAPI_REHEARSAL_POLICY_SHA256=<reviewed approved-policy.json SHA-256>
 *   BAPI_REHEARSAL_ORDER_PAYLOAD_SHA256=<reviewed orders.jsonl SHA-256>
 *   BAPI_REHEARSAL_APPLY=YES
 */

$policy_sha256 = getenv('BAPI_REHEARSAL_POLICY_SHA256');
$order_payload_sha256 = getenv('BAPI_REHEARSAL_ORDER_PAYLOAD_SHA256');
foreach (
    [
        'BAPI_REHEARSAL_POLICY_SHA256' => $policy_sha256,
        'BAPI_REHEARSAL_ORDER_PAYLOAD_SHA256' => $order_payload_sha256,
    ] as $name => $sha256
) {
    if (!is_string($sha256) || preg_match('/^[a-f0-9]{64}$/', $sha256) !== 1) {
        fwrite(STDERR, "ERROR: {$name} must pin the reviewed final package.\n");
        exit(1);
    }
}

if (($args[2] ?? '') !== 'apply') {
    fwrite(STDERR, "ERROR: The production-contract rehearsal apply wrapper requires apply mode.\n");
    exit(1);
}

define('BAPI_ETL_TARGET_MODE', 'production');
define('BAPI_ETL_APPROVED_HOST', 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud');
define('BAPI_ETL_MARKER_OPTION', 'bapi_data_refresh_rehearsal');
define('BAPI_ETL_MARKER_VALUE', 'bapi-data-refresh-20260821');
define('BAPI_ETL_POLICY_MARKER_VALUE', 'bapi-production-data-refresh-20260827');
define('BAPI_ETL_APPLY_CONFIRMATION_ENV', 'BAPI_REHEARSAL_APPLY');
define('BAPI_ETL_POLICY_SHA256', $policy_sha256);
define('BAPI_ETL_ORDER_PAYLOAD_SHA256', $order_payload_sha256);

require __DIR__ . '/run-wordpress-rehearsal-etl.php';