<?php
/**
 * Plugin Name: BAPI 2FA Analytics
 * Description: Exposes a REST endpoint that reports 2FA TOTP enrollment statistics
 *              from wp_usermeta. Used for adoption tracking (target: 50%+ in 30 days).
 *              Endpoint: GET /wp-json/bapi/v1/2fa-stats
 * Version: 1.0.0
 * Author: BAPI Development Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'bapi/v1', '/2fa-stats', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'bapi_2fa_stats_endpoint',
        'permission_callback' => 'bapi_2fa_stats_permission',
    ] );
} );

/**
 * Only administrators or requests with the revalidation secret may read 2FA stats.
 */
function bapi_2fa_stats_permission( WP_REST_Request $request ): bool {
    $secret   = defined( 'REVALIDATION_SECRET' ) ? REVALIDATION_SECRET : getenv( 'REVALIDATION_SECRET' );
    $provided = $request->get_header( 'X-Revalidation-Secret' );

    if ( $secret && hash_equals( $secret, (string) $provided ) ) {
        return true;
    }

    return current_user_can( 'manage_options' );
}

/**
 * Return 2FA enrollment statistics.
 *
 * Counts:
 *  - total_users        : all registered users (excluding deleted)
 *  - enrolled           : users with two_factor_enabled = '1' in usermeta
 *  - enrollment_rate    : enrolled / total_users (0–1 float)
 *  - target_rate        : 0.50 (Phase 1 goal)
 *  - target_met         : bool
 *
 * Enrollment by date:
 *  - enrolled_last_30d  : users who enabled 2FA within the last 30 days
 *    (tracked via two_factor_enabled_at usermeta set by graphql-2fa-extension.php)
 */
function bapi_2fa_stats_endpoint(): WP_REST_Response {
    global $wpdb;

    // Total registered users (all rows in wp_users — no spam/deleted filtering applied).
    $total_users = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->users}" );

    // Users with 2FA enabled.
    $enrolled = (int) $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT(DISTINCT user_id)
         FROM {$wpdb->usermeta}
         WHERE meta_key = %s
           AND meta_value = %s",
        'two_factor_enabled',
        '1'
    ) );

    // Users who enrolled in the last 30 days.
    $cutoff = gmdate( 'Y-m-d H:i:s', strtotime( '-30 days' ) );
    $enrolled_last_30d = (int) $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT(DISTINCT user_id)
         FROM {$wpdb->usermeta}
         WHERE meta_key = %s
           AND meta_value >= %s",
        'two_factor_enabled_at',
        $cutoff
    ) );

    $enrollment_rate = $total_users > 0 ? round( $enrolled / $total_users, 4 ) : 0.0;
    $target_rate     = 0.50;

    return new WP_REST_Response( [
        'total_users'       => $total_users,
        'enrolled'          => $enrolled,
        'not_enrolled'      => $total_users - $enrolled,
        'enrollment_rate'   => $enrollment_rate,
        'enrollment_pct'    => round( $enrollment_rate * 100, 1 ),
        'target_rate'       => $target_rate,
        'target_met'        => $enrollment_rate >= $target_rate,
        'enrolled_last_30d' => $enrolled_last_30d,
        'as_of'             => gmdate( 'c' ),
    ], 200 );
}
