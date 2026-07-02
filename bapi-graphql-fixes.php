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

// ---------------------------------------------------------------------------
// BAPI Favorites — stored as JSON in WordPress user meta (bapi_favorites)
// ---------------------------------------------------------------------------

add_action('graphql_register_types', function () {

    // ── Shared object type ─────────────────────────────────────────────────
    register_graphql_object_type('BapiFavorite', [
        'description' => 'A BAPI saved product favorite',
        'fields'      => [
            'id'           => ['type' => 'String', 'description' => 'Unique favorite ID'],
            'productId'    => ['type' => 'String', 'description' => 'WordPress product database ID'],
            'productName'  => ['type' => 'String', 'description' => 'Product display name'],
            'productSlug'  => ['type' => 'String', 'description' => 'Product URL slug'],
            'productImage' => ['type' => 'String', 'description' => 'Product image URL'],
            'productPrice' => ['type' => 'String', 'description' => 'Product price string'],
            'createdAt'    => ['type' => 'String', 'description' => 'ISO 8601 creation timestamp'],
        ],
    ]);

    // ── Query: myFavorites ─────────────────────────────────────────────────
    register_graphql_field('RootQuery', 'myFavorites', [
        'type'        => ['list_of' => 'BapiFavorite'],
        'description' => "Get the current authenticated user's saved product favorites, sorted newest first.",
        'resolve'     => function ($root, $args, $context) {
            $user_id = $context->viewer->databaseId ?? 0;
            if (!$user_id) {
                return [];
            }

            $raw  = get_user_meta($user_id, 'bapi_favorites', true);
            $favs = $raw ? json_decode($raw, true) : [];
            if (!is_array($favs)) {
                return [];
            }

            usort($favs, fn($a, $b) => strcmp($b['createdAt'], $a['createdAt']));
            return $favs;
        },
    ]);

    // ── Mutation: addFavorite ──────────────────────────────────────────────
    register_graphql_mutation('addFavorite', [
        'inputFields'  => [
            'productId'    => ['type' => ['non_null' => 'String']],
            'productName'  => ['type' => ['non_null' => 'String']],
            'productSlug'  => ['type' => ['non_null' => 'String']],
            'productImage' => ['type' => 'String'],
            'productPrice' => ['type' => 'String'],
        ],
        'outputFields' => [
            'favorite'      => ['type' => 'BapiFavorite'],
            'alreadyExists' => ['type' => 'Boolean'],
            'success'       => ['type' => 'Boolean'],
        ],
        'mutateAndGetPayload' => function ($input, $context) {
            $user_id = $context->viewer->databaseId ?? 0;
            if (!$user_id) {
                throw new \GraphQL\Error\UserError('Unauthorized');
            }

            $raw  = get_user_meta($user_id, 'bapi_favorites', true);
            $favs = $raw ? json_decode($raw, true) : [];
            if (!is_array($favs)) {
                $favs = [];
            }

            // Sanitize input first, then check for duplicates against stored (already-sanitized) values
            $sanitized_id = sanitize_text_field($input['productId']);

            foreach ($favs as $fav) {
                if ($fav['productId'] === $sanitized_id) {
                    return ['favorite' => $fav, 'alreadyExists' => true, 'success' => false];
                }
            }

            $new_fav = [
                'id'           => 'fav-' . time() . '-' . substr(md5(uniqid('', true)), 0, 9),
                'productId'    => $sanitized_id,
                'productName'  => sanitize_text_field($input['productName']),
                'productSlug'  => sanitize_text_field($input['productSlug']),
                'productImage' => isset($input['productImage']) ? esc_url_raw($input['productImage']) : null,
                'productPrice' => isset($input['productPrice']) ? sanitize_text_field($input['productPrice']) : null,
                'createdAt'    => gmdate('c'),
            ];

            $favs[] = $new_fav;
            update_user_meta($user_id, 'bapi_favorites', wp_json_encode($favs));

            return ['favorite' => $new_fav, 'alreadyExists' => false, 'success' => true];
        },
    ]);

    // ── Mutation: removeFavorite ───────────────────────────────────────────
    register_graphql_mutation('removeFavorite', [
        'inputFields'  => [
            'productId' => ['type' => ['non_null' => 'String']],
        ],
        'outputFields' => [
            'success'  => ['type' => 'Boolean'],
            'notFound' => ['type' => 'Boolean'],
        ],
        'mutateAndGetPayload' => function ($input, $context) {
            $user_id = $context->viewer->databaseId ?? 0;
            if (!$user_id) {
                throw new \GraphQL\Error\UserError('Unauthorized');
            }

            $raw  = get_user_meta($user_id, 'bapi_favorites', true);
            $favs = $raw ? json_decode($raw, true) : [];
            if (!is_array($favs)) {
                $favs = [];
            }

            $original_count = count($favs);
            $sanitized_id = sanitize_text_field($input['productId']);
            $favs = array_values(
                array_filter($favs, fn($fav) => $fav['productId'] !== $sanitized_id)
            );

            if (count($favs) === $original_count) {
                return ['success' => false, 'notFound' => true];
            }

            update_user_meta($user_id, 'bapi_favorites', wp_json_encode($favs));
            return ['success' => true, 'notFound' => false];
        },
    ]);
});
