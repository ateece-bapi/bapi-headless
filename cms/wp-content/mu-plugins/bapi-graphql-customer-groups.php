<?php
/**
 * Plugin Name: BAPI GraphQL Customer Groups
 * Description: Exposes customer group ACF fields in WPGraphQL schema for B2B product filtering
 * Version: 1.0.0
 * Author: BAPI HVAC
 * 
 * Registers customer_group1, customer_group2, customer_group3 ACF fields in GraphQL
 * to enable proper OEM product filtering on the Next.js frontend.
 * 
 * Business Context:
 * - OEM products (e.g., (ALC), (ACS), (EMC), (CCG)) should only be visible to specific customer groups
 * - Products without customer groups are public (visible to all users including guests)
 * - User customer groups come from user meta: customer_group
 * 
 * @see docs/CUSTOMER-GROUP-FILTERING.md
 * @see web/src/lib/utils/filterProductsByCustomerGroup.ts
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register customer group ACF fields in WPGraphQL schema
 * 
 * Makes customer_group1, customer_group2, customer_group3 queryable via GraphQL
 * for both SimpleProduct and VariableProduct types.
 */
add_action('graphql_register_types', function() {
    $field_config = [
        'type' => 'String',
        'description' => 'Customer group restriction (ACF field)',
    ];

    // Register for SimpleProduct
    /**
     * Shared resolver helper for customer group ACF fields
     * Uses WordPress helper maybe_unserialize() for safe deserialization
     */
    $resolve_customer_group = function($product, $meta_key) {
        $value = get_post_meta($product->ID, $meta_key, true);
        
        // WordPress typically returns unserialized values, but handle both cases
        $value = maybe_unserialize($value);
        
        // Extract first array element if array, or return scalar value
        if (is_array($value) && !empty($value)) {
            return is_string($value[0]) ? $value[0] : null;
        }
        
        return is_string($value) && !empty($value) ? $value : null;
    };

    register_graphql_field('SimpleProduct', 'customerGroup1', array_merge($field_config, [
        'description' => 'Primary customer group restriction (e.g., "alc", "acs", "emc", "ccg")',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group1');
        }
    ]));

    register_graphql_field('SimpleProduct', 'customerGroup2', array_merge($field_config, [
        'description' => 'Secondary customer group restriction',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group2');
        }
    ]));

    register_graphql_field('SimpleProduct', 'customerGroup3', array_merge($field_config, [
        'description' => 'Tertiary customer group restriction',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group3');
        }
    ]));

    // Register for VariableProduct (same fields)
    register_graphql_field('VariableProduct', 'customerGroup1', array_merge($field_config, [
        'description' => 'Primary customer group restriction (e.g., "alc", "acs", "emc", "ccg")',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group1');
        }
    ]));

    register_graphql_field('VariableProduct', 'customerGroup2', array_merge($field_config, [
        'description' => 'Secondary customer group restriction',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group2');
        }
    ]));

    register_graphql_field('VariableProduct', 'customerGroup3', array_merge($field_config, [
        'description' => 'Tertiary customer group restriction',
        'resolve' => function($product) use ($resolve_customer_group) {
            return $resolve_customer_group($product, 'customer_group3');
        }
    ]));
});

// Plugin loaded - customer group fields registered via graphql_register_types hook
