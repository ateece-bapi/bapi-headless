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
 * Normalizes a raw ACF customer-group field value (string, or array for
 * multi-value ACF fields) into a single scalar string for GraphQL output.
 */
function bapi_easy_order_normalize_group_scalar($value) {
    if (is_array($value)) {
        $strings = array_filter(array_map('strval', $value), fn ($v) => $v !== '');
        return !empty($strings) ? implode(', ', $strings) : null;
    }
    return (is_string($value) && $value !== '') ? $value : null;
}

/**
 * Normalizes a raw ACF customer-group field value into a flat list of
 * lowercase, slugified group codes for authorization comparisons.
 */
function bapi_easy_order_group_value_to_list($value) {
    $raw = is_array($value) ? $value : [$value];
    $list = [];
    foreach ($raw as $item) {
        if (is_string($item) && $item !== '') {
            $list[] = strtolower(sanitize_title($item));
        }
    }
    return $list;
}

/**
 * Resolves the customer_group1/2/3 fields for a product/variation (falling
 * back to the parent when the variation itself has no value set), returning
 * both the flat authorization list and the per-field scalar for GraphQL output.
 */
function bapi_easy_order_resolve_customer_groups($product_id, $parent_id) {
    $fields = ['customer_group1', 'customer_group2', 'customer_group3'];
    $scalars = [];
    $all_groups = [];

    foreach ($fields as $field) {
        $value = function_exists('get_field') ? get_field($field, $product_id) : null;
        if (($value === null || $value === false || $value === '') && $parent_id) {
            $value = function_exists('get_field') ? get_field($field, $parent_id) : null;
        }
        $scalars[$field] = bapi_easy_order_normalize_group_scalar($value);
        $all_groups = array_merge($all_groups, bapi_easy_order_group_value_to_list($value));
    }

    return [
        'scalars' => $scalars,
        'groups' => array_values(array_unique($all_groups)),
    ];
}

/**
 * Returns the currently logged-in user's own customer group codes
 * (lowercase, slugified), mirroring getProductCustomerGroups() on the
 * Next.js side so PHP-side and Next.js-side authorization agree.
 */
function bapi_easy_order_get_viewer_customer_groups() {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return [];
    }

    $groups = [];
    foreach (['customer_group1', 'customer_group2', 'customer_group3'] as $field) {
        $value = function_exists('get_field') ? get_field($field, 'user_' . $user_id) : null;
        if ($value === null || $value === false || $value === '') {
            $value = get_user_meta($user_id, $field, true);
        }
        $groups = array_merge($groups, bapi_easy_order_group_value_to_list($value));
    }

    return array_values(array_unique($groups));
}

/**
 * Mirrors canUserViewProduct() in filterProductsByCustomerGroup.ts: a product
 * with no customer-group restriction is visible to everyone; a restricted
 * product requires the viewer to have at least one matching group.
 */
function bapi_easy_order_viewer_can_see_product($product_groups, $viewer_groups) {
    if (empty($product_groups)) {
        return true;
    }
    return !empty(array_intersect($product_groups, $viewer_groups));
}

/**
 * Computes the same Relay global ID that WPGraphQL WooCommerce's own Product
 * / Product_Variation models expose as `id`, so cart items added via Easy
 * Order Form merge correctly with the same item added from a product page
 * (the cart's dedupe key is `id` + `variationId`). Returns null (caller
 * falls back to a synthetic id) if the Relay helper isn't available.
 */
function bapi_easy_order_get_canonical_id($product_id, $is_variation) {
    if (!class_exists('\\GraphQLRelay\\Relay')) {
        return null;
    }
    $type = $is_variation ? 'product_variation' : 'product';
    return \GraphQLRelay\Relay::toGlobalId($type, (string) $product_id);
}

/**
 * Resolves a single product or variation post ID into the shared
 * EasyOrderSkuMatch shape. Returns null if not found, not published, not
 * customer-visible, or restricted to a customer group the viewer isn't in.
 */
function bapi_easy_order_resolve_product($product_id, $viewer_groups) {
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

    $customer_groups = bapi_easy_order_resolve_customer_groups($product_id, $parent_id);
    if (!bapi_easy_order_viewer_can_see_product($customer_groups['groups'], $viewer_groups)) {
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

    $part_number = get_post_meta($product_id, 'part_number', true);
    if (!$part_number && $parent_id) {
        $part_number = get_post_meta($parent_id, 'part_number', true);
    }

    return [
        'id' => base64_encode('easy_order_sku:' . $product_id),
        'databaseId' => $product_id,
        'parentDatabaseId' => $parent_id ?: $product_id,
        'isVariation' => $is_variation,
        'canonicalId' => bapi_easy_order_get_canonical_id($product_id, $is_variation),
        'name' => $name,
        'slug' => $parent_product ? $parent_product->get_slug() : $product->get_slug(),
        'sku' => $product->get_sku(),
        'partNumber' => (is_string($part_number) && $part_number !== '') ? $part_number : null,
        'price' => $price,
        'stockStatus' => strtoupper((string) $product->get_stock_status()),
        'imageUrl' => $image_url ?: null,
        'imageAltText' => $image_alt ?: null,
        'customerGroup1' => $customer_groups['scalars']['customer_group1'],
        'customerGroup2' => $customer_groups['scalars']['customer_group2'],
        'customerGroup3' => $customer_groups['scalars']['customer_group3'],
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
            'canonicalId' => ['type' => 'String', 'description' => __('The same Relay global ID WPGraphQL exposes as `id` on Product/ProductVariation, for cart merge consistency with other add-to-cart flows. Null if unresolvable.', 'bapi')],
            'name' => ['type' => 'String'],
            'slug' => ['type' => 'String', 'description' => __('Parent product slug, for linking to the product page.', 'bapi')],
            'sku' => ['type' => 'String'],
            'partNumber' => ['type' => 'String', 'description' => __('Custom part_number meta field, falling back to null when unset (SKU is used as the display fallback client-side).', 'bapi')],
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
        'description' => __('Resolves an exact SKU (product or variation) for Easy Order Form bulk add-to-cart. Requires authentication and viewer customer-group visibility.', 'bapi'),
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
            return bapi_easy_order_resolve_product($product_id, bapi_easy_order_get_viewer_customer_groups());
        },
    ]);

    register_graphql_field('RootQuery', 'easyOrderCuratedList', [
        'type' => ['list_of' => 'EasyOrderSkuMatch'],
        'args' => [
            'term' => ['type' => ['non_null' => 'String']],
        ],
        'description' => __('Resolves the curated Easy Order Form list (order_list taxonomy term) to exact product/variation matches. Requires authentication and the viewer to belong to the requested customer-group term.', 'bapi'),
        'resolve' => function ($root, $args, $context) {
            if (!is_user_logged_in()) {
                return [];
            }

            $term_slug = trim((string) ($args['term'] ?? ''));
            if ($term_slug === '') {
                return [];
            }

            $viewer_groups = bapi_easy_order_get_viewer_customer_groups();

            // The order_list term doubles as the customer-group code (e.g.
            // "lennox") — without this check, any authenticated account could
            // pass another customer's term and receive their curated list.
            if (!in_array(strtolower(sanitize_title($term_slug)), $viewer_groups, true)) {
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
                $match = bapi_easy_order_resolve_product((int) $object_id, $viewer_groups);
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
