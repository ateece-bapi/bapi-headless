<?php
/**
 * WPGraphQL Customer Group Taxonomy Registration
 * 
 * This file registers the 'customer-group' product taxonomy in WPGraphQL
 * to enable headless site to query customer group restrictions.
 * 
 * Installation: Add to wp-content/mu-plugins/wpgraphql-customer-groups.php
 * or add to theme's functions.php
 * 
 * @package BAPI_Headless
 * @since 1.0.0
 */

/**
 * Register customer-group taxonomy in WPGraphQL
 * 
 * Exposes the existing 'customer-group' taxonomy to GraphQL API
 * with proper naming conventions and security settings.
 */
add_action('graphql_register_types', function() {
    
    // Register the customer-group taxonomy in WPGraphQL
    register_graphql_object_type('CustomerGroup', [
        'description' => __('Customer group taxonomy term for B2B product visibility control', 'bapi'),
        'fields' => [
            'id' => [
                'type' => 'ID',
                'description' => __('Global ID of the customer group term', 'bapi'),
            ],
            'databaseId' => [
                'type' => 'Int',
                'description' => __('Database ID of the customer group term', 'bapi'),
            ],
            'name' => [
                'type' => 'String',
                'description' => __('Display name of the customer group', 'bapi'),
            ],
            'slug' => [
                'type' => 'String',
                'description' => __('URL-safe slug of the customer group', 'bapi'),
            ],
            'count' => [
                'type' => 'Int',
                'description' => __('Number of products assigned to this customer group', 'bapi'),
            ],
        ],
    ]);

    // Add customerGroups field to Product type
    register_graphql_field('Product', 'customerGroups', [
        'type' => ['list_of' => 'CustomerGroup'],
        'description' => __('Customer groups that can view this product (B2B visibility control)', 'bapi'),
        'resolve' => function($product) {
            $terms = wp_get_object_terms($product->ID, 'customer-group', [
                'fields' => 'all',
            ]);
            
            if (is_wp_error($terms) || empty($terms)) {
                return [];
            }
            
            return array_map(function($term) {
                return [
                    'id' => base64_encode('customer-group:' . $term->term_id),
                    'databaseId' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'count' => $term->count,
                ];
            }, $terms);
        },
    ]);

    // Add customerGroups field to SimpleProduct type
    register_graphql_field('SimpleProduct', 'customerGroups', [
        'type' => ['list_of' => 'CustomerGroup'],
        'description' => __('Customer groups that can view this product', 'bapi'),
        'resolve' => function($product) {
            $terms = wp_get_object_terms($product->ID, 'customer-group', [
                'fields' => 'all',
            ]);
            
            if (is_wp_error($terms) || empty($terms)) {
                return [];
            }
            
            return array_map(function($term) {
                return [
                    'id' => base64_encode('customer-group:' . $term->term_id),
                    'databaseId' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'count' => $term->count,
                ];
            }, $terms);
        },
    ]);

    // Add customerGroups field to VariableProduct type
    register_graphql_field('VariableProduct', 'customerGroups', [
        'type' => ['list_of' => 'CustomerGroup'],
        'description' => __('Customer groups that can view this product', 'bapi'),
        'resolve' => function($product) {
            $terms = wp_get_object_terms($product->ID, 'customer-group', [
                'fields' => 'all',
            ]);
            
            if (is_wp_error($terms) || empty($terms)) {
                return [];
            }
            
            return array_map(function($term) {
                return [
                    'id' => base64_encode('customer-group:' . $term->term_id),
                    'databaseId' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'count' => $term->count,
                ];
            }, $terms);
        },
    ]);
});

/**
 * Register ACF customer group fields in WPGraphQL
 * 
 * Exposes customer_group1, customer_group2, customer_group3 user meta fields
 * to GraphQL viewer query for authentication.
 */
add_action('graphql_register_types', function() {
    
    register_graphql_field('User', 'customerGroup1', [
        'type' => 'String',
        'description' => __('Primary customer group from ACF field or user meta', 'bapi'),
        'resolve' => function($user) {
            // Handle both WP_User and WPGraphQL\Model\User objects
            $user_id = null;
            if (isset($user->ID)) {
                $user_id = $user->ID;
            } elseif (isset($user->data->ID)) {
                $user_id = $user->data->ID;
            } elseif (isset($user->userId)) {
                $user_id = $user->userId;
            } elseif (isset($user->databaseId)) {
                $user_id = $user->databaseId;
            }
            
            if (!$user_id) {
                return null;
            }
            
            // Try ACF first if available
            if (function_exists('get_field')) {
                $value = get_field('customer_group1', 'user_' . $user_id);
                if ($value && is_string($value)) {
                    return $value;
                }
            }
            
            // Fallback to direct user meta read
            $value = get_user_meta($user_id, 'customer_group1', true);
            return (is_string($value) && !empty($value)) ? $value : null;
        },
    ]);

    register_graphql_field('User', 'customerGroup2', [
        'type' => 'String',
        'description' => __('Secondary customer group from ACF field or user meta', 'bapi'),
        'resolve' => function($user) {
            // Handle both WP_User and WPGraphQL\Model\User objects
            $user_id = $user->databaseId ?? $user->userId ?? $user->data->ID ?? $user->ID ?? null;
            if (!$user_id) {
                return null;
            }
            
            if (function_exists('get_field')) {
                $value = get_field('customer_group2', 'user_' . $user_id);
                if ($value && is_string($value)) {
                    return $value;
                }
            }
            
            $value = get_user_meta($user_id, 'customer_group2', true);
            return (is_string($value) && !empty($value)) ? $value : null;
        },
    ]);

    register_graphql_field('User', 'customerGroup3', [
        'type' => 'String',
        'description' => __('Tertiary customer group from ACF field or user meta', 'bapi'),
        'resolve' => function($user) {
            // Handle both WP_User and WPGraphQL\Model\User objects
            $user_id = $user->databaseId ?? $user->userId ?? $user->data->ID ?? $user->ID ?? null;
            if (!$user_id) {
                return null;
            }
            
            if (function_exists('get_field')) {
                $value = get_field('customer_group3', 'user_' . $user_id);
                if ($value && is_string($value)) {
                    return $value;
                }
            }
            
            $value = get_user_meta($user_id, 'customer_group3', true);
            return (is_string($value) && !empty($value)) ? $value : null;
        },
    ]);
});

/**
 * Add customer group filtering to product queries (optional backend filtering)
 * 
 * This automatically filters products in WooCommerce queries based on user's customer groups.
 * Can be enabled/disabled with ENABLE_BACKEND_CUSTOMER_GROUP_FILTERING constant.
 * 
 * Note: Frontend filtering is still recommended for flexibility and caching.
 */
if (defined('ENABLE_BACKEND_CUSTOMER_GROUP_FILTERING') && ENABLE_BACKEND_CUSTOMER_GROUP_FILTERING === true) {
    add_filter('graphql_pre_resolve_field', function($result, $source, $args, $context, $info) {
        // Only apply to product queries
        if ($info->fieldName !== 'products') {
            return $result;
        }
        
        // Get current user's customer groups
        $user_id = $context->viewer->userId ?? 0;
        $customer_groups = ['end-user']; // Default for guests
        
        if ($user_id > 0 && function_exists('get_field')) {
            $groups = array_filter([
                get_field('customer_group1', 'user_' . $user_id),
                get_field('customer_group2', 'user_' . $user_id),
                get_field('customer_group3', 'user_' . $user_id),
            ]);
            
            if (!empty($groups)) {
                $customer_groups = array_map('strtolower', array_map('sanitize_title', $groups));
            }
        }
        
        // Modify query args to include customer group tax_query
        if (!isset($args['where'])) {
            $args['where'] = [];
        }
        
        if (!isset($args['where']['taxQuery'])) {
            $args['where']['taxQuery'] = [];
        }
        
        $args['where']['taxQuery'][] = [
            'taxonomy' => 'customer-group',
            'field' => 'slug',
            'terms' => $customer_groups,
            'operator' => 'IN',
            'include_children' => false,
        ];
        
        return $result;
    }, 10, 5);
}
