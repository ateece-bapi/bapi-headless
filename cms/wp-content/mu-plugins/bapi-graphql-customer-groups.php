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
    register_graphql_field('SimpleProduct', 'customerGroup1', array_merge($field_config, [
        'description' => 'Primary customer group restriction (e.g., "alc", "acs", "emc", "ccg")',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group1', true);
            // Handle ACF serialized array format: a:1:{i:0;s:3:"alc";}
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));

    register_graphql_field('SimpleProduct', 'customerGroup2', array_merge($field_config, [
        'description' => 'Secondary customer group restriction',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group2', true);
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));

    register_graphql_field('SimpleProduct', 'customerGroup3', array_merge($field_config, [
        'description' => 'Tertiary customer group restriction',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group3', true);
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));

    // Register for VariableProduct (same fields)
    register_graphql_field('VariableProduct', 'customerGroup1', array_merge($field_config, [
        'description' => 'Primary customer group restriction (e.g., "alc", "acs", "emc", "ccg")',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group1', true);
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));

    register_graphql_field('VariableProduct', 'customerGroup2', array_merge($field_config, [
        'description' => 'Secondary customer group restriction',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group2', true);
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));

    register_graphql_field('VariableProduct', 'customerGroup3', array_merge($field_config, [
        'description' => 'Tertiary customer group restriction',
        'resolve' => function($product) {
            $value = get_post_meta($product->ID, 'customer_group3', true);
            if (is_string($value) && strpos($value, 'a:') === 0) {
                $unserialized = @unserialize($value);
                return is_array($unserialized) && !empty($unserialized) ? $unserialized[0] : null;
            }
            return $value ?: null;
        }
    ]));
});

/**
 * Log plugin activation for debugging
 */
add_action('init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[BAPI GraphQL] Customer group fields registered in GraphQL schema');
    }
}, 999);
