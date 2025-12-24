<?php
/**
 * BAPI Theme Functions
 * 
 * Example functions.php file for BAPI headless WordPress theme
 * Location: /wp-content/themes/bapi-theme/functions.php
 */

// Include block patterns
require_once get_template_directory() . '/inc/block-patterns.php';

// Theme setup
function bapi_theme_setup() {
    // Add support for post thumbnails
    add_theme_support('post-thumbnails');
    
    // Add support for title tag
    add_theme_support('title-tag');
    
    // Add support for custom logo
    add_theme_support('custom-logo');
    
    // Add support for responsive embeds
    add_theme_support('responsive-embeds');
    
    // Add support for align wide/full blocks
    add_theme_support('align-wide');
    
    // Add support for editor styles
    add_theme_support('editor-styles');
    
    // Add custom image sizes for headless frontend
    add_image_size('product-thumbnail', 400, 400, true);
    add_image_size('product-large', 1200, 1200, false);
    add_image_size('hero', 1920, 1080, true);
}
add_action('after_setup_theme', 'bapi_theme_setup');

// Disable theme editor for security
define('DISALLOW_FILE_EDIT', true);

// Clean up WordPress head
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head');

// Add custom excerpt length
function bapi_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'bapi_excerpt_length');
