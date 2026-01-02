<?php
/**
 * Register Application Notes Custom Post Type for WPGraphQL
 * 
 * This must-use plugin ensures the application_note post type
 * is properly exposed in the WPGraphQL schema.
 */

add_action('init', function() {
    register_post_type('application_note', [
        'labels' => [
            'name' => 'Application Notes',
            'singular_name' => 'Application Note',
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'taxonomies' => ['application_note_category'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'applicationNote',
        'graphql_plural_name' => 'applicationNotes',
    ]);
}, 0); // Priority 0 to run early

add_action('init', function() {
    register_taxonomy('application_note_category', 'application_note', [
        'labels' => [
            'name' => 'Application Note Categories',
            'singular_name' => 'Application Note Category',
        ],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'applicationNoteCategory',
        'graphql_plural_name' => 'applicationNoteCategories',
    ]);
}, 0);
