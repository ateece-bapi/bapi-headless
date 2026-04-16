<?php
/**
 * Plugin Name: BAPI GraphQL Variation SKU Search
 * Description: Custom WPGraphQL resolver for searching product variation SKUs directly from postmeta (replicates Relevanssi behavior without the plugin)
 * Version: 1.0.0
 * Author: BAPI Development Team
 * 
 * This plugin replicates what Relevanssi Premium does:
 * - Queries _sku custom field from wp_postmeta
 * - Finds variations with matching SKUs
 * - Returns parent variable products
 * 
 * NO PLUGIN DEPENDENCIES - Pure SQL query approach
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom GraphQL field for variation SKU search
 * 
 * Usage in GraphQL:
 * query {
 *   searchProductsByVariationSku(sku: "BA/TQF-B-2-C80-J-A-B-F") {
 *     id
 *     databaseId
 *     name
 *     slug
 *   }
 * }
 */
add_action('graphql_register_types', function() {
    register_graphql_field('RootQuery', 'searchProductsByVariationSku', [
        'type' => ['list_of' => 'Product'],
        'description' => 'Search for variable products by their variation SKUs (exact match, case-insensitive). Replicates Relevanssi Premium behavior without the plugin.',
        'args' => [
            'sku' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Variation SKU to search for (e.g., "BA/TQF-B-2-C80-J-A-B-F")',
            ],
            'first' => [
                'type' => 'Int',
                'description' => 'Number of results to return',
                'defaultValue' => 10,
            ],
        ],
        'resolve' => function($source, $args, $context, $info) {
            global $wpdb;
            
            $variation_sku = sanitize_text_field($args['sku']);
            $limit = min(absint($args['first']), 50); // Max 50 results for performance
            
            // Query variations with matching SKU, then get their parent products
            // This replicates what Relevanssi does: search _sku in postmeta
            $query = $wpdb->prepare("
                SELECT DISTINCT p.ID
                FROM {$wpdb->posts} p
                INNER JOIN {$wpdb->posts} v ON p.ID = v.post_parent
                INNER JOIN {$wpdb->postmeta} pm ON v.ID = pm.post_id
                WHERE p.post_type = 'product'
                  AND p.post_status = 'publish'
                  AND v.post_type = 'product_variation'
                  AND v.post_status = 'publish'
                  AND pm.meta_key = '_sku'
                  AND LOWER(pm.meta_value) = LOWER(%s)
                LIMIT %d
            ", $variation_sku, $limit);
            
            $product_ids = $wpdb->get_col($query);
            
            if (empty($product_ids)) {
                return [];
            }
            
            // Use WPGraphQL's DataSource to properly load product models
            $products = [];
            foreach ($product_ids as $product_id) {
                // Load through WPGraphQL's data loader system
                $model = \WPGraphQL\Data\DataSource::resolve_post_object($product_id, $context);
                if ($model) {
                    $products[] = $model;
                }
            }
            
            return $products;
        }
    ]);
    
    /**
     * Also register a "fuzzy" search for partial SKU matches
     * Useful for searching by SKU prefix like "BA/TQF"
     */
    register_graphql_field('RootQuery', 'searchProductsByVariationSkuPrefix', [
        'type' => ['list_of' => 'Product'],
        'description' => 'Search for variable products by variation SKU prefix (starts with, case-insensitive)',
        'args' => [
            'prefix' => [
                'type' => ['non_null' => 'String'],
                'description' => 'SKU prefix to search for (e.g., "BA/TQF")',
            ],
            'first' => [
                'type' => 'Int',
                'description' => 'Number of results to return',
                'defaultValue' => 20,
            ],
        ],
        'resolve' => function($source, $args, $context, $info) {
            global $wpdb;
            
            $sku_prefix = sanitize_text_field($args['prefix']);
            $limit = min(absint($args['first']), 100); // Max 100 for prefix search
            
            // Use LIKE for prefix matching
            $query = $wpdb->prepare("
                SELECT DISTINCT p.ID
                FROM {$wpdb->posts} p
                INNER JOIN {$wpdb->posts} v ON p.ID = v.post_parent
                INNER JOIN {$wpdb->postmeta} pm ON v.ID = pm.post_id
                WHERE p.post_type = 'product'
                  AND p.post_status = 'publish'
                  AND v.post_type = 'product_variation'
                  AND v.post_status = 'publish'
                  AND pm.meta_key = '_sku'
                  AND LOWER(pm.meta_value) LIKE LOWER(%s)
                LIMIT %d
            ", $wpdb->esc_like($sku_prefix) . '%', $limit);
            
            $product_ids = $wpdb->get_col($query);
            
            if (empty($product_ids)) {
                return [];
            }
            
            // Use WPGraphQL's DataSource to properly load product models
            $products = [];
            foreach ($product_ids as $product_id) {
                // Load through WPGraphQL's data loader system
                $model = \WPGraphQL\Data\DataSource::resolve_post_object($product_id, $context);
                if ($model) {
                    $products[] = $model;
                }
            }
            
            return $products;
        }
    ]);
});

/**
 * Add performance logging (optional - can be removed for production)
 */
add_action('graphql_execute', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        add_action('shutdown', function() {
            if (function_exists('error_log')) {
                $queries = get_num_queries();
                $seconds = timer_stop();
                error_log(sprintf('[BAPI Variation Search] Queries: %d, Time: %f seconds', $queries, $seconds));
            }
        });
    }
});
