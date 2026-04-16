<?php
/**
 * Plugin Name: BAPI Variation SKU Search
 * Description: Index variation SKUs into parent product search content (WPGraphQL compatible)
 * Version: 1.0.0
 * Author: BAPI
 * 
 * This plugin makes variation SKUs searchable by modifying the WordPress search query
 * to include parent products where ANY child variation SKU matches the search term.
 * 
 * This replicates the behavior of Relevanssi Premium's rlv_index_variation_skus filter
 * from the legacy WordPress site (stage.bapihvac.com).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Add variation SKU search to WooCommerce product queries
 * 
 * @param string $search  The search SQL for WHERE clause
 * @param WP_Query $query The WP_Query instance
 * @return string Modified search SQL
 */
function bapi_index_variation_skus_search( $search, $query ) {
	global $wpdb;

	// Only modify WooCommerce product searches
	// This works with WPGraphQL's native search parameter
	if ( $query->is_search() && 'product' === $query->get( 'post_type' ) ) {
		$search_term = $query->get( 's' );
		
		if ( ! empty( $search_term ) ) {
			// Escape the search term for SQL LIKE
			$like_term = '%' . $wpdb->esc_like( $search_term ) . '%';
			
			// Prepare the variation SKU clause separately to avoid prepare() issues
			// with existing % wildcards in $search from WordPress core
			$variation_sku_clause = $wpdb->prepare(
				" OR {$wpdb->posts}.ID IN (
					SELECT DISTINCT p.post_parent
					FROM {$wpdb->posts} p
					INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
					WHERE p.post_type = 'product_variation'
					AND p.post_status = 'publish'
					AND p.post_parent > 0
					AND pm.meta_key = '_sku'
					AND pm.meta_value LIKE %s
				)",
				$like_term
			);
			
			// Append the prepared clause to existing search
			$search .= $variation_sku_clause;
		}
	}

	return $search;
}

// Hook into WordPress search with priority 10
add_filter( 'posts_search', 'bapi_index_variation_skus_search', 10, 2 );

/**
 * Log plugin activation for debugging
 */
function bapi_variation_sku_search_loaded() {
	// Only log in debug mode
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		error_log( 'BAPI Variation SKU Search: Plugin loaded and active' );
	}
}

add_action( 'plugins_loaded', 'bapi_variation_sku_search_loaded' );
