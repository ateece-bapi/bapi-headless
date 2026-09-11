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
 * Installation: copy to wp-content/mu-plugins/wpgraphql-order-list.php on
 * the Headless WordPress (Kinsta) environment.
 *
 * @package BAPI_Headless
 * @since 1.0.0
 */

add_action('init', function () {
    register_taxonomy('order_list', ['product'], [
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
