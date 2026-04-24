<?php
/**
 * Plugin Name: BAPI GraphQL Fixes
 * Description: MU plugin that increases the WPGraphQL query limit for products with many variations
 * Version: 1.0.0
 * Author: BAPI Development Team
 *
 * This file should live at:
 * cms/wp-content/mu-plugins/bapi-graphql-fixes.php
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Increase WPGraphQL query limit for product variations
 * 
 * Default WPGraphQL limit is 100, but some BAPI products have 150+ variations.
 * This filter increases the limit specifically for the VariableProduct variations connection.
 * 
 * Fixes issue: Product #136296 (Duct Temperature Transmitter) has 150 variations
 * but only first 100 were returned by GraphQL, causing missing "4-20mA" option.
 */
add_filter('graphql_connection_max_query_amount', function($max, $source, $args, $context, $info) {
    // Increase limit only for the VariableProduct variations connection
    if (
        isset($info->parentType->name, $info->fieldName) &&
        $info->parentType->name === 'VariableProduct' &&
        $info->fieldName === 'variations'
    ) {
        return max($max, 500); // Allow at least 500 variations per product
    }
    
    // Keep existing limit for other queries
    return $max;
}, 10, 5);
