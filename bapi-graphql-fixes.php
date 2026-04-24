<?php
/**
 * Plugin Name: BAPI GraphQL Fixes
 * Description: Increases WPGraphQL query limit for products with many variations
 * Version: 1.0.0
 * Author: BAPI Development Team
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Increase WPGraphQL query limit for product variations
 * 
 * Default WPGraphQL limit is 100, but some BAPI products have 150+ variations.
 * This filter increases the limit specifically for VariableProduct queries.
 * 
 * Fixes issue: Product #136296 (Duct Temperature Transmitter) has 150 variations
 * but only first 100 were returned by GraphQL, causing missing "4-20mA" option.
 */
add_filter('graphql_connection_max_query_amount', function($max, $source, $args, $context, $info) {
    // Increase limit specifically for product variations
    if (isset($info->parentType->name) && $info->parentType->name === 'VariableProduct') {
        return 500; // Allow up to 500 variations per product
    }
    
    // Keep default limit (100) for other queries
    return $max;
}, 10, 5);

/**
 * Log when the filter is applied (for debugging)
 */
add_action('init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[BAPI GraphQL Fixes] Plugin loaded - WPGraphQL variation limit increased to 500');
    }
});
