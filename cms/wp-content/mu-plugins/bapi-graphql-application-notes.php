<?php
/**
 * Enable Application Notes in WPGraphQL
 * 
 * This mu-plugin registers AND exposes the application_note custom post type to WPGraphQL
 */

// Register application_note post type
add_action('init', function() {
    $labels = array(
        'name'                  => 'Application Notes',
        'singular_name'         => 'Application Note',
        'menu_name'             => 'Application Notes',
        'add_new'               => 'Add New',
        'add_new_item'          => 'Add New Application Note',
        'edit_item'             => 'Edit Application Note',
        'new_item'              => 'New Application Note',
        'view_item'             => 'View Application Note',
        'all_items'             => 'All Application Notes',
        'search_items'          => 'Search Application Notes',
        'not_found'             => 'No application notes found',
        'not_found_in_trash'    => 'No application notes found in Trash',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'application-notes'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-media-document',
        'supports'           => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions'),
        'taxonomies'         => array('category', 'post_tag'),
        'show_in_rest'       => true,
        'show_in_graphql'    => true,
        'graphql_single_name' => 'applicationNote',
        'graphql_plural_name' => 'applicationNotes',
    );

    register_post_type('application_note', $args);
}, 0);
