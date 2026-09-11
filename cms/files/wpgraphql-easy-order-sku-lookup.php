<?php
/**
 * Easy Order Form — Exact SKU Lookup
 *
 * Resolves an exact SKU (product OR product variation) to its precise
 * catalog identity — including the exact variation ID and price when the
 * SKU belongs to a variable product. WPGraphQL's built-in `products` query
 * only searches parent-level SKUs, and the existing custom
 * `searchProductsByVariationSku` resolver only returns the parent product
 * (built for search-dropdown navigation, not add-to-cart), so neither is
 * sufficient for the Easy Order Form's bulk paste-and-add flow — many of
 * BAPI's real part numbers (e.g. Lennox's reorder list) are variation SKUs,
 * not parent product SKUs.
 *
 * Installation: copy to wp-content/mu-plugins/bapi-graphql-easy-order-sku-lookup.php
 * on the Headless WordPress (Kinsta) environment.
 *
 * @package BAPI_Headless
 * @since 1.0.0
 */

/**
 * Resolves a single product or variation post ID into the shared
 * EasyOrderSkuMatch shape. Returns null if not found, not published, or not
 * customer-visible.
 */
function bapi_easy_order_resolve_product($product_id) {
    if (!$product_id || get_post_status($product_id) !== 'publish') {
        return null;
    }

    $product = wc_get_product($product_id);
    if (!$product || !$product->is_visible()) {
        return null;
    }

    $parent_id = $product->get_parent_id();
    $is_variation = $parent_id > 0;
    $parent_product = $is_variation ? wc_get_product($parent_id) : $product;

    if ($is_variation && (!$parent_product || get_post_status($parent_id) !== 'publish')) {
        return null;
    }

    $name = $parent_product ? $parent_product->get_name() : $product->get_name();
    if ($is_variation && method_exists($product, 'get_attribute_summary')) {
        $attribute_summary = $product->get_attribute_summary();
        if ($attribute_summary) {
            $name .= ' — ' . $attribute_summary;
        }
    }

    $image_id = $product->get_image_id();
    if (!$image_id && $parent_product) {
        $image_id = $parent_product->get_image_id();
    }
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'woocommerce_single') : null;
    $image_alt = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : null;

    $price_raw = $product->get_price();
    $price = ($price_raw !== '' && $price_raw !== null)
        ? html_entity_decode(wp_strip_all_tags(wc_price($price_raw)), ENT_QUOTES)
        : null;

    $get_customer_group = function ($field) use ($product_id, $parent_id) {
        if (!function_exists('get_field')) {
            return null;
        }
        $value = get_field($field, $product_id);
        if ($value) {
            return $value;
        }
        return $parent_id ? get_field($field, $parent_id) : null;
    };

    return [
        'id' => base64_encode('easy_order_sku:' . $product_id),
        'databaseId' => $product_id,
        'parentDatabaseId' => $parent_id ?: $product_id,
        'isVariation' => $is_variation,
        'name' => $name,
        'slug' => $parent_product ? $parent_product->get_slug() : $product->get_slug(),
        'sku' => $product->get_sku(),
        'price' => $price,
        'stockStatus' => strtoupper((string) $product->get_stock_status()),
        'imageUrl' => $image_url ?: null,
        'imageAltText' => $image_alt ?: null,
        'customerGroup1' => $get_customer_group('customer_group1'),
        'customerGroup2' => $get_customer_group('customer_group2'),
        'customerGroup3' => $get_customer_group('customer_group3'),
    ];
}

add_action('graphql_register_types', function () {
    register_graphql_object_type('EasyOrderSkuMatch', [
        'description' => __('Exact SKU match (product or variation) for Easy Order Form bulk lookup.', 'bapi'),
        'fields' => [
            'id' => ['type' => 'ID'],
            'databaseId' => ['type' => 'Int', 'description' => __('The exact matched post ID (product or variation).', 'bapi')],
            'parentDatabaseId' => ['type' => 'Int', 'description' => __('The parent product ID (same as databaseId for non-variations).', 'bapi')],
            'isVariation' => ['type' => 'Boolean'],
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String', 'description' => __('Parent product slug, for linking to the product page.', 'bapi')],
            'sku' => ['type' => 'String'],
            'price' => ['type' => 'String', 'description' => __('Formatted price string (e.g. "$49.99"), matching the standard WPGraphQL product price format.', 'bapi')],
            'stockStatus' => ['type' => 'String'],
            'imageUrl' => ['type' => 'String'],
            'imageAltText' => ['type' => 'String'],
            'customerGroup1' => ['type' => 'String'],
            'customerGroup2' => ['type' => 'String'],
            'customerGroup3' => ['type' => 'String'],
        ],
    ]);

    register_graphql_field('RootQuery', 'easyOrderSkuLookup', [
        'type' => 'EasyOrderSkuMatch',
        'args' => [
            'sku' => ['type' => ['non_null' => 'String']],
        ],
        'description' => __('Resolves an exact SKU (product or variation) for Easy Order Form bulk add-to-cart. Requires authentication.', 'bapi'),
        'resolve' => function ($root, $args, $context) {
            // Auth is also enforced in the Next.js API route, but this is the
            // only public entry point to this data, so enforce it here too.
            if (!is_user_logged_in()) {
                return null;
            }

            $sku = trim((string) ($args['sku'] ?? ''));
            if ($sku === '') {
                return null;
            }

            $product_id = wc_get_product_id_by_sku($sku);
            return bapi_easy_order_resolve_product($product_id);
        },
    ]);

    register_graphql_field('RootQuery', 'easyOrderCuratedList', [
        'type' => ['list_of' => 'EasyOrderSkuMatch'],
        'args' => [
            'term' => ['type' => ['non_null' => 'String']],
        ],
        'description' => __('Resolves the curated Easy Order Form list (order_list taxonomy term) to exact product/variation matches. Requires authentication.', 'bapi'),
        'resolve' => function ($root, $args, $context) {
            if (!is_user_logged_in()) {
                return [];
            }

            $term_slug = trim((string) ($args['term'] ?? ''));
            if ($term_slug === '') {
                return [];
            }

            $term = get_term_by('slug', $term_slug, 'order_list');
            if (!$term) {
                return [];
            }

            $object_ids = get_objects_in_term($term->term_id, 'order_list');
            if (is_wp_error($object_ids) || empty($object_ids)) {
                return [];
            }

            $resolved = [];
            foreach ($object_ids as $object_id) {
                $match = bapi_easy_order_resolve_product((int) $object_id);
                if ($match) {
                    $resolved[] = $match;
                }
            }

            // A product family may be tagged at both the parent level and a
            // specific variation level (e.g. a simple product tagged directly,
            // vs. a variable product whose parent was tagged before individual
            // variations were tagged directly). Prefer the more precise
            // variation entry and drop the redundant parent-only entry.
            $variation_parent_ids = [];
            foreach ($resolved as $match) {
                if ($match['isVariation']) {
                    $variation_parent_ids[$match['parentDatabaseId']] = true;
                }
            }

            return array_values(array_filter($resolved, function ($match) use ($variation_parent_ids) {
                if ($match['isVariation']) {
                    return true;
                }
                return !isset($variation_parent_ids[$match['databaseId']]);
            }));
        },
    ]);
});
