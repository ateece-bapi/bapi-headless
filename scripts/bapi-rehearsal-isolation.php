<?php
/**
 * Plugin Name: BAPI Data Refresh Rehearsal Isolation
 * Description: Blocks outbound effects on the disposable refresh0826 rehearsal clone.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

$bapi_rehearsal_host = strtolower((string) wp_parse_url(get_option('siteurl'), PHP_URL_HOST));
$bapi_rehearsal_marker = get_option('bapi_data_refresh_rehearsal');
$bapi_rehearsal_identity_valid = (
    $bapi_rehearsal_host !== 'stg-bapiheadlessstaging-refresh0826.kinsta.cloud' ||
    $bapi_rehearsal_marker !== 'bapi-data-refresh-20260821'
) === false;

if (!defined('DISABLE_WP_CRON')) {
    define('DISABLE_WP_CRON', true);
}
if (!defined('WP_ENVIRONMENT_TYPE')) {
    define('WP_ENVIRONMENT_TYPE', 'staging');
}

add_filter('pre_get_ready_cron_jobs', '__return_empty_array', PHP_INT_MIN);
add_filter('pre_wp_mail', '__return_true', PHP_INT_MIN);
add_filter(
    'pre_http_request',
    static function ($preempt, $parsed_args, $url) {
        return new WP_Error(
            'bapi_rehearsal_http_blocked',
            sprintf('Outbound HTTP blocked by rehearsal isolation: %s', $url)
        );
    },
    PHP_INT_MIN,
    3
);
add_filter('woocommerce_webhook_should_deliver', '__return_false', PHP_INT_MIN);
add_filter('woocommerce_available_payment_gateways', '__return_empty_array', PHP_INT_MIN);
add_filter('action_scheduler_queue_runner_concurrent_batches', '__return_zero', PHP_INT_MIN);

add_action(
    'admin_notices',
    static function () use ($bapi_rehearsal_identity_valid) {
        $identity_message = $bapi_rehearsal_identity_valid
            ? 'Clone identity verified.'
            : 'Clone identity mismatch; isolation remains fail-closed.';
        echo '<div class="notice notice-error"><p><strong>REHEARSAL:</strong> Outbound mail, HTTP, webhooks, payments, and cron are blocked. ' .
            esc_html($identity_message) . '</p></div>';
    }
);