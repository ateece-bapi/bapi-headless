<?php
/**
 * Plugin Name: BAPI Production Contract Rehearsal Guard
 * Description: Clone-pinned side-effect guard for the schema-v2 rehearsal apply.
 * Version: 1.0.0
 */

define('BAPI_PRODUCTION_REFRESH_HOST', 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud');
define('BAPI_PRODUCTION_REFRESH_MARKER_OPTION', 'bapi_data_refresh_rehearsal');
define('BAPI_PRODUCTION_REFRESH_MARKER', 'bapi-data-refresh-20260821');
define('BAPI_PRODUCTION_REFRESH_GUARD_OPTION', 'bapi_production_contract_rehearsal_guard_enabled');

require __DIR__ . '/bapi-production-refresh-guard.php';