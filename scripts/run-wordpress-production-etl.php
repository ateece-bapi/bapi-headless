<?php
/**
 * Run an approved production data-refresh stage against the exact active Headless backend.
 *
 * Required environment for every mode:
 *   BAPI_PRODUCTION_POLICY_SHA256=<reviewed approved-policy.json SHA-256>
 *   BAPI_PRODUCTION_ORDER_PAYLOAD_SHA256=<reviewed orders.jsonl SHA-256>
 *
 * Apply additionally requires BAPI_PRODUCTION_APPLY=YES and the enabled production guard MU plugin.
 */

$policy_sha256 = getenv('BAPI_PRODUCTION_POLICY_SHA256');
$order_payload_sha256 = getenv('BAPI_PRODUCTION_ORDER_PAYLOAD_SHA256');
foreach (
    [
        'BAPI_PRODUCTION_POLICY_SHA256' => $policy_sha256,
        'BAPI_PRODUCTION_ORDER_PAYLOAD_SHA256' => $order_payload_sha256,
    ] as $name => $sha256
) {
    if (!is_string($sha256) || preg_match('/^[a-f0-9]{64}$/', $sha256) !== 1) {
        fwrite(STDERR, "ERROR: {$name} must pin the reviewed final package.\n");
        exit(1);
    }
}

define('BAPI_ETL_TARGET_MODE', 'production');
define('BAPI_ETL_APPROVED_HOST', 'bapiheadlessstaging.kinsta.cloud');
define('BAPI_ETL_MARKER_OPTION', 'bapi_data_refresh_production');
define('BAPI_ETL_MARKER_VALUE', 'bapi-production-data-refresh-20260827');
define('BAPI_ETL_POLICY_SHA256', $policy_sha256);
define('BAPI_ETL_ORDER_PAYLOAD_SHA256', $order_payload_sha256);

require __DIR__ . '/run-wordpress-rehearsal-etl.php';
