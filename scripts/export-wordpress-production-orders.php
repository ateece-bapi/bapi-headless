<?php
/**
 * Export the final approved production order payload from frozen Legacy WordPress.
 *
 * Required environment:
 *   BAPI_PRODUCTION_POLICY_SHA256=<reviewed approved-policy.json SHA-256>
 *
 * Usage:
 *   BAPI_PRODUCTION_POLICY_SHA256=<sha256> wp eval-file export-wordpress-production-orders.php \
 *     /secure/order-dry-run.tsv /secure/orders.jsonl --path=/path/to/legacy-wordpress
 */

$policy_sha256 = getenv('BAPI_PRODUCTION_POLICY_SHA256');
if (!is_string($policy_sha256) || preg_match('/^[a-f0-9]{64}$/', $policy_sha256) !== 1) {
    fwrite(STDERR, "ERROR: BAPI_PRODUCTION_POLICY_SHA256 must pin the reviewed final policy.\n");
    exit(1);
}

define('BAPI_ORDER_EXPORT_SCHEMA', 2);
define('BAPI_ORDER_EXPORT_POLICY_SHA256', $policy_sha256);

require __DIR__ . '/export-wordpress-rehearsal-orders.php';
