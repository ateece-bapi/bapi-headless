<?php
/**
 * Order List Taxonomy Registration
 *
 * Registers a private, non-public taxonomy used to curate per-customer
 * "Easy Order Form" product lists (e.g. Lennox NAS's frequently-reordered
 * parts, per Todd Vanden Heuvel's request). Deliberately kept separate from
 * the public "Product tags" taxonomy so this internal B2B curation data is
 * never rendered on the public site (tag clouds, "Tagged: ..." labels, etc).
 *
 * Terms represent a customer/account, e.g. "lennox". A product can belong to
 * multiple terms if it's a standard reorder item for more than one customer.
 *
 * Registered against both 'product' and 'product_variation' so individual
 * variations (not just their parent) can be tagged directly, preserving
 * exact-SKU identity for curated reorder lists.
 *
 * Installation: copy to wp-content/mu-plugins/bapi-graphql-order-list.php on
 * the Headless WordPress (Kinsta) environment.
 *
 * @package BAPI_Headless
 * @since 1.0.0
 */

add_action('init', function () {
    register_taxonomy('order_list', ['product', 'product_variation'], [
        'label' => __('Order List', 'bapi'),
        'labels' => [
            'name' => __('Order Lists', 'bapi'),
            'singular_name' => __('Order List', 'bapi'),
            'menu_name' => __('Order Lists', 'bapi'),
        ],
        // Intentionally non-public: never queryable/renderable on the frontend theme.
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_admin_column' => false,
        'show_in_nav_menus' => false,
        'show_tagcloud' => false,
        'show_in_quick_edit' => true,
        'hierarchical' => false,
        'rewrite' => false,
        'show_in_rest' => false,
        // Expose to WPGraphQL so the headless frontend can query curated lists.
        'show_in_graphql' => true,
        'graphql_single_name' => 'orderListTag',
        'graphql_plural_name' => 'orderListTags',
    ]);
});

/**
 * SECURITY: `show_in_graphql` alone does not make this taxonomy private — the
 * `public`/`publicly_queryable`/`show_in_rest` flags above only affect the REST
 * API and frontend theme, not WPGraphQL field-level read access. Without this
 * guard, any unauthenticated caller could query
 * products(where: { taxonomyFilter: { filters: [{ taxonomy: ORDER_LIST, ... }] } })
 * directly against the public GraphQL endpoint and enumerate a customer's
 * curated product list.
 *
 * This strips the response at the very last filter point (`graphql_request_results`,
 * operating on the fully-executed response) rather than trying to short-circuit
 * field resolution — an earlier `graphql_pre_resolve_field`-based guard proved
 * unreliable to override once WPGraphQL Smart Cache had already populated the
 * result. Verified against the live schema: unauthenticated requests referencing
 * ORDER_LIST get an empty connection; authenticated (valid JWT) requests and any
 * query that doesn't reference ORDER_LIST are unaffected.
 *
 * Signature must match WPGraphQL's actual `graphql_request_results` order —
 * (response, schema, operation, variables, query) — as used elsewhere in this
 * codebase (see bapi-graphql-fixes.php); an earlier version of this guard used
 * the wrong argument order, so `$query` was actually the variables array and
 * the guard silently never matched.
 */
add_filter('graphql_request_results', function ($response, $schema, $operation, $variables, $query) {
    if (is_user_logged_in()) {
        return $response;
    }

    if (empty($query) || !is_string($query) || stripos($query, 'ORDER_LIST') === false) {
        return $response;
    }

    if (is_array($response) && isset($response['data']) && is_array($response['data'])) {
        $data = &$response['data'];
    } elseif (is_object($response) && isset($response->data) && is_array($response->data)) {
        $data = &$response->data;
    } else {
        return $response;
    }

    // Aliasing (e.g. `p: products(...)`) stores the result under the alias key,
    // not "products" — find every alias used for a `products(...)` selection so
    // it can't be used to bypass the "products" key check below.
    $keys = ['products'];
    if (preg_match_all('/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*products\s*\(/', $query, $matches)) {
        $keys = array_merge($keys, $matches[1]);
    }

    foreach (array_unique($keys) as $key) {
        if (isset($data[$key]['nodes'])) {
            $data[$key]['nodes'] = [];
        }
        if (isset($data[$key]['edges'])) {
            $data[$key]['edges'] = [];
        }
    }

    return $response;
}, 10, 5);
