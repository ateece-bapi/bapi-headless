<?php
/**
 * Plugin Name: BAPI Block Patterns
 * Description: Custom block patterns for BAPI content creators
 * Version: 1.0
 * Author: BAPI
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include the block patterns file
require_once plugin_dir_path(__FILE__) . 'block-patterns.php';
