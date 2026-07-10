<?php
/**
 * Plugin Name: BAPI Cache Monitoring
 * Description: Tracks WPGraphQL Smart Cache hit/miss metrics and exposes a REST endpoint for observability.
 *              Logs are written to WP_CONTENT_DIR/logs/cache-metrics-YYYY-MM-DD.log (daily rotation).
 *              Alert threshold: miss rate > 30% triggers an error_log entry for external log shippers.
 * Version: 1.0.0
 * Author: BAPI Development Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

define( 'BAPI_CACHE_LOG_DIR', WP_CONTENT_DIR . '/logs' );
define( 'BAPI_CACHE_METRICS_OPTION', 'bapi_cache_metrics' );
define( 'BAPI_CACHE_MISS_ALERT_THRESHOLD', 0.30 ); // 30 %

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return today's log file path (YYYY-MM-DD rotation).
 */
function bapi_cache_log_file(): string {
    $dir = BAPI_CACHE_LOG_DIR;
    if ( ! is_dir( $dir ) ) {
        wp_mkdir_p( $dir );
        // Prevent direct web access to the log directory.
        // Includes both Apache 2.4 (Require) and 2.2 (Deny) directives for compatibility.
        file_put_contents( $dir . '/.htaccess', "Require all denied\nDeny from all\n" );
    }
    return $dir . '/cache-metrics-' . gmdate( 'Y-m-d' ) . '.log';
}

/**
 * Append a structured JSON line to the daily log file.
 *
 * @param string $event  'hit' | 'miss' | 'invalidate'
 * @param array  $extra  Additional context (node_type, tags, etc.)
 */
function bapi_cache_log( string $event, array $extra = [] ): void {
    $entry = array_merge(
        [
            'ts'    => gmdate( 'c' ),
            'event' => $event,
        ],
        $extra
    );

    $line = wp_json_encode( $entry ) . "\n";
    // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
    file_put_contents( bapi_cache_log_file(), $line, FILE_APPEND | LOCK_EX );
}

/**
 * Update the running in-memory counters stored in a transient.
 * Note: this is a read-modify-write and may lose increments under high concurrency.
 * Counters are intentionally approximate — use them for trend monitoring, not exact auditing.
 *
 * @param string $key  'hits' | 'misses' | 'invalidations'
 */
function bapi_cache_increment( string $key ): void {
    // Use a short-lived transient (1 hour) as a lightweight counter store.
    $metrics = get_transient( BAPI_CACHE_METRICS_OPTION ) ?: [
        'hits'          => 0,
        'misses'        => 0,
        'invalidations' => 0,
        'window_start'  => time(),
    ];

    $metrics[ $key ] = ( $metrics[ $key ] ?? 0 ) + 1;

    set_transient( BAPI_CACHE_METRICS_OPTION, $metrics, HOUR_IN_SECONDS );

    // Alert if miss rate exceeds threshold (check every 50 requests to reduce noise).
    $total = $metrics['hits'] + $metrics['misses'];
    if ( $total > 0 && $total % 50 === 0 ) {
        $miss_rate = $metrics['misses'] / $total;
        if ( $miss_rate > BAPI_CACHE_MISS_ALERT_THRESHOLD ) {
            error_log( sprintf(
                '[BAPI Cache Alert] Miss rate %.1f%% exceeds %.0f%% threshold over %d requests (window start: %s)',
                $miss_rate * 100,
                BAPI_CACHE_MISS_ALERT_THRESHOLD * 100,
                $total,
                gmdate( 'c', $metrics['window_start'] )
            ) );
        }
    }
}

// ---------------------------------------------------------------------------
// WPGraphQL Smart Cache hooks
// ---------------------------------------------------------------------------

/**
 * Hook: cache HIT — WPGraphQL Smart Cache served a cached response.
 * Filter: graphql_response_cache_get_transient_with_id (fires when a cache hit occurs).
 */
add_filter( 'graphql_response_cache_get_transient_with_id', function ( $cached, $cache_key, $request ) {
    if ( ! empty( $cached ) ) {
        bapi_cache_increment( 'hits' );
        bapi_cache_log( 'hit', [ 'key' => substr( (string) $cache_key, 0, 16 ) ] );
    }
    return $cached;
}, 10, 3 );

/**
 * Hook: cache MISS — WPGraphQL Smart Cache found nothing for this key.
 * Action: graphql_response_cache_miss (fired by WPGraphQL Smart Cache plugin).
 */
add_action( 'graphql_response_cache_miss', function ( $cache_key ) {
    bapi_cache_increment( 'misses' );
    bapi_cache_log( 'miss', [ 'key' => substr( (string) $cache_key, 0, 16 ) ] );
} );

/**
 * Hook: cache INVALIDATION — one or more nodes/tags were purged.
 * Action: graphql_purge_all (fires on full purge).
 */
add_action( 'graphql_purge_all', function () {
    bapi_cache_increment( 'invalidations' );
    bapi_cache_log( 'invalidate', [ 'scope' => 'all' ] );
} );

/**
 * Hook: per-node invalidation.
 * Action: graphql_purge_query_for_node (fires per node purge).
 *
 * @param string $node_type  Post type or taxonomy name.
 * @param int    $node_id    Object ID being purged.
 */
add_action( 'graphql_purge_query_for_node', function ( $node_type, $node_id ) {
    bapi_cache_increment( 'invalidations' );
    bapi_cache_log( 'invalidate', [
        'scope'     => 'node',
        'node_type' => $node_type,
        'node_id'   => $node_id,
    ] );
}, 10, 2 );

// ---------------------------------------------------------------------------
// REST API endpoint  GET /wp-json/bapi/v1/cache-metrics
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
    register_rest_route( 'bapi/v1', '/cache-metrics', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'bapi_cache_metrics_endpoint',
        'permission_callback' => 'bapi_cache_metrics_permission',
    ] );
} );

/**
 * Only administrators (or requests carrying the revalidation secret) may read metrics.
 */
function bapi_cache_metrics_permission( WP_REST_Request $request ): bool {
    // Allow requests bearing the REVALIDATION_SECRET header (used by external monitors).
    $secret   = defined( 'REVALIDATION_SECRET' ) ? REVALIDATION_SECRET : getenv( 'REVALIDATION_SECRET' );
    $provided = $request->get_header( 'X-Revalidation-Secret' );

    if ( $secret && hash_equals( $secret, (string) $provided ) ) {
        return true;
    }

    return current_user_can( 'manage_options' );
}

/**
 * Return current rolling metrics + miss-rate as JSON.
 */
function bapi_cache_metrics_endpoint(): WP_REST_Response {
    $metrics = get_transient( BAPI_CACHE_METRICS_OPTION ) ?: [
        'hits'          => 0,
        'misses'        => 0,
        'invalidations' => 0,
        'window_start'  => time(),
    ];

    $total     = $metrics['hits'] + $metrics['misses'];
    $miss_rate = $total > 0 ? round( $metrics['misses'] / $total, 4 ) : null;

    return new WP_REST_Response( [
        'hits'          => $metrics['hits'],
        'misses'        => $metrics['misses'],
        'invalidations' => $metrics['invalidations'],
        'total_requests' => $total,
        'miss_rate'     => $miss_rate,
        'alert'         => $miss_rate !== null && $miss_rate > BAPI_CACHE_MISS_ALERT_THRESHOLD,
        'window_start'  => gmdate( 'c', $metrics['window_start'] ),
        'window_end'    => gmdate( 'c' ),
    ], 200 );
}
