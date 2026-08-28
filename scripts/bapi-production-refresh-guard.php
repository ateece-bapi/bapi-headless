<?php
/**
 * Plugin Name: BAPI Production Data Refresh Guard
 * Description: Temporarily blocks outbound effects during an approved production data refresh.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

defined('BAPI_PRODUCTION_REFRESH_HOST') || define('BAPI_PRODUCTION_REFRESH_HOST', 'bapiheadlessstaging.kinsta.cloud');
defined('BAPI_PRODUCTION_REFRESH_MARKER_OPTION') || define('BAPI_PRODUCTION_REFRESH_MARKER_OPTION', 'bapi_data_refresh_production');
defined('BAPI_PRODUCTION_REFRESH_MARKER') || define('BAPI_PRODUCTION_REFRESH_MARKER', 'bapi-production-data-refresh-20260827');
defined('BAPI_PRODUCTION_REFRESH_GUARD_OPTION') || define('BAPI_PRODUCTION_REFRESH_GUARD_OPTION', 'bapi_data_refresh_guard_enabled');

function bapi_production_refresh_guard_status(): array
{
    $site_host = strtolower((string) wp_parse_url(get_option('siteurl'), PHP_URL_HOST));
    $home_host = strtolower((string) wp_parse_url(get_option('home'), PHP_URL_HOST));

    return [
        'enabled' => get_option(BAPI_PRODUCTION_REFRESH_GUARD_OPTION) === 'yes',
        'identity_valid' => (
            $site_host === BAPI_PRODUCTION_REFRESH_HOST &&
            $home_host === BAPI_PRODUCTION_REFRESH_HOST &&
            get_option(BAPI_PRODUCTION_REFRESH_MARKER_OPTION) === BAPI_PRODUCTION_REFRESH_MARKER
        ),
    ];
}

function bapi_production_refresh_guard_queue_snapshot(): array
{
    global $wpdb;

    $actions_table = $wpdb->prefix . 'actionscheduler_actions';
    $claims_table = $wpdb->prefix . 'actionscheduler_claims';
    foreach ([$actions_table, $claims_table] as $table) {
        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) !== $table) {
            throw new RuntimeException("Required Action Scheduler table is unavailable: {$table}");
        }
    }
    $actions = $wpdb->get_results("SELECT * FROM {$actions_table} ORDER BY action_id", ARRAY_A);
    $claims = $wpdb->get_results("SELECT * FROM {$claims_table} ORDER BY claim_id", ARRAY_A);
    if (!is_array($actions) || !is_array($claims) || $wpdb->last_error !== '') {
        throw new RuntimeException('Unable to capture complete Action Scheduler state.');
    }
    $active_claim_ids = [];
    foreach ($actions as $action) {
        if (
            in_array($action['status'] ?? '', ['pending', 'in-progress'], true) &&
            (int) ($action['claim_id'] ?? 0) > 0
        ) {
            $active_claim_ids[(int) $action['claim_id']] = true;
        }
    }
    return [
        'cron_sha256' => hash('sha256', serialize(get_option('cron', []))),
        'actions_sha256' => hash('sha256', serialize($actions)),
        'claims_sha256' => hash('sha256', serialize($claims)),
        'in_progress' => count(array_filter(
            $actions,
            static fn(array $action): bool => ($action['status'] ?? '') === 'in-progress'
        )),
        'claims' => count($active_claim_ids),
        'claim_rows' => count($claims),
    ];
}

function bapi_production_refresh_guard_queues_quiescent(): bool
{
    $snapshot = bapi_production_refresh_guard_queue_snapshot();
    return $snapshot['in_progress'] === 0 && $snapshot['claims'] === 0;
}

$bapi_production_guard_status = bapi_production_refresh_guard_status();
if (!$bapi_production_guard_status['enabled']) {
    return;
}

if (!defined('DISABLE_WP_CRON')) {
    define('DISABLE_WP_CRON', true);
}

add_filter('pre_get_ready_cron_jobs', '__return_empty_array', PHP_INT_MIN);
add_filter('pre_schedule_event', '__return_false', PHP_INT_MIN);
add_filter('pre_reschedule_event', '__return_false', PHP_INT_MIN);
add_filter('pre_unschedule_event', '__return_false', PHP_INT_MIN);
add_filter('pre_clear_scheduled_hook', '__return_false', PHP_INT_MIN);
add_filter('pre_wp_mail', '__return_true', PHP_INT_MIN);
add_filter(
    'pre_http_request',
    static function ($preempt, $parsed_args, $url) {
        return new WP_Error(
            'bapi_production_refresh_http_blocked',
            sprintf('Outbound HTTP blocked by production data-refresh guard: %s', $url)
        );
    },
    PHP_INT_MIN,
    3
);
add_filter('woocommerce_webhook_should_deliver', '__return_false', PHP_INT_MIN);
add_filter('woocommerce_available_payment_gateways', '__return_empty_array', PHP_INT_MIN);
add_filter('action_scheduler_queue_runner_concurrent_batches', '__return_zero', PHP_INT_MIN);
add_filter('pre_as_schedule_single_action', '__return_zero', PHP_INT_MIN);
add_filter('pre_as_schedule_recurring_action', '__return_zero', PHP_INT_MIN);
add_filter('pre_as_schedule_cron_action', '__return_zero', PHP_INT_MIN);
add_filter('pre_as_enqueue_async_action', '__return_zero', PHP_INT_MIN);

add_action(
    'admin_notices',
    static function () use ($bapi_production_guard_status) {
        $identity_message = $bapi_production_guard_status['identity_valid']
            ? 'Production identity verified.'
            : 'PRODUCTION IDENTITY MISMATCH; effects remain blocked and the refresh runner will refuse apply.';
        echo '<div class="notice notice-error"><p><strong>DATA REFRESH:</strong> Outbound mail, HTTP, webhooks, payments, and cron are blocked. ' .
            esc_html($identity_message) . '</p></div>';
    }
);
