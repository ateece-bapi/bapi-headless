<?php
/**
 * Register Service Bulletins for the WordPress admin and WPGraphQL.
 */

add_action('init', function() {
    register_post_type('service_bulletin', [
        'labels' => [
            'name' => 'Service Bulletins',
            'singular_name' => 'Service Bulletin',
            'menu_name' => 'Service Bulletins',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Service Bulletin',
            'edit_item' => 'Edit Service Bulletin',
            'new_item' => 'New Service Bulletin',
            'view_item' => 'View Service Bulletin',
            'view_items' => 'View Service Bulletins',
            'search_items' => 'Search Service Bulletins',
            'not_found' => 'No service bulletins found',
            'not_found_in_trash' => 'No service bulletins found in Trash',
            'all_items' => 'All Service Bulletins',
            'archives' => 'Service Bulletin Archives',
            'attributes' => 'Service Bulletin Attributes',
        ],
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'service-bulletin'],
        'query_var' => true,
        'menu_position' => 6,
        'menu_icon' => 'dashicons-warning',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions'],
        'taxonomies' => ['service_bulletin_category'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'serviceBulletin',
        'graphql_plural_name' => 'serviceBulletins',
    ]);

    register_taxonomy('service_bulletin_category', 'service_bulletin', [
        'labels' => [
            'name' => 'Categories',
            'singular_name' => 'Category',
            'search_items' => 'Search Categories',
            'all_items' => 'All Categories',
            'parent_item' => 'Parent Category',
            'parent_item_colon' => 'Parent Category:',
            'edit_item' => 'Edit Category',
            'update_item' => 'Update Category',
            'add_new_item' => 'Add New Category',
            'new_item_name' => 'New Category Name',
            'menu_name' => 'Categories',
        ],
        'public' => true,
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'service-bulletin-category'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'serviceBulletinCategory',
        'graphql_plural_name' => 'serviceBulletinCategories',
    ]);
}, 0);

add_filter('use_block_editor_for_post_type', function($use_block_editor, $post_type) {
    if ($post_type === 'service_bulletin') {
        return false;
    }

    return $use_block_editor;
}, 10, 2);

function bapi_revalidate_service_bulletin_tag($tag) {
    $frontend_url = defined('BAPI_FRONTEND_URL')
        ? BAPI_FRONTEND_URL
        : getenv('BAPI_FRONTEND_URL');
    $revalidate_secret = defined('BAPI_REVALIDATE_SECRET')
        ? BAPI_REVALIDATE_SECRET
        : getenv('BAPI_REVALIDATE_SECRET');

    if (!$frontend_url || !$revalidate_secret) {
        return;
    }

    wp_remote_post(trailingslashit($frontend_url) . 'api/revalidate', [
        'timeout' => 5,
        'blocking' => false,
        'headers' => ['Content-Type' => 'application/json'],
        'body' => wp_json_encode([
            'tag' => $tag,
            'secret' => $revalidate_secret,
        ]),
    ]);
}

add_action('transition_post_status', function($new_status, $old_status, $post) {
    if ($post->post_type !== 'service_bulletin') {
        return;
    }

    if ($new_status !== 'publish' && $old_status !== 'publish') {
        return;
    }

    bapi_revalidate_service_bulletin_tag('service-bulletins');

    if ($post->post_name) {
        bapi_revalidate_service_bulletin_tag('service-bulletin-' . $post->post_name);
    }
}, 10, 3);