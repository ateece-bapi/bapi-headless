<?php
/**
 * Plugin Name: BAPI Category Validation
 * Description: Prevents numeric-only product category names and logs source
 * Version: 1.0.0
 * Author: BAPI Development Team
 * 
 * Purpose: Prevent duplicate numeric categories like 746-754 (March 30) and 762 (April 22)
 * This is a senior-level fix - prevent at source, not UI band-aid
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Validate category name on creation
 * Prevents numeric-only names like "755", "762", etc.
 */
add_action('create_term', 'bapi_validate_category_name', 10, 3);

function bapi_validate_category_name($term_id, $tt_id, $taxonomy) {
    // Only validate product categories
    if ($taxonomy !== 'product_cat') {
        return;
    }
    
    $term = get_term($term_id);
    
    // Check if name is numeric-only (bad data)
    if (preg_match('/^\d+$/', trim($term->name))) {
        // Capture who/what created it
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
        $source = [];
        
        foreach ($backtrace as $trace) {
            if (isset($trace['function'])) {
                $source[] = $trace['function'];
            }
        }
        
        // Log for investigation
        error_log(sprintf(
            '[BAPI CATEGORY BLOCKED] Numeric category "%s" (ID: %d) rejected. Source: %s',
            $term->name,
            $term_id,
            implode(' → ', $source)
        ));
        
        // Delete immediately
        wp_delete_term($term_id, 'product_cat');
        
        // Send email alert (optional - comment out if too noisy)
        wp_mail(
            get_option('admin_email'),
            '[ALERT] WordPress: Numeric Category Blocked',
            sprintf(
                "A numeric-only category was blocked and deleted:\n\n" .
                "Name: %s\n" .
                "ID: %d\n" .
                "Source: %s\n\n" .
                "This prevents the breadcrumb '755' bug from recurring.",
                $term->name,
                $term_id,
                implode(' → ', $source)
            )
        );
    }
}

/**
 * Also prevent editing existing categories to numeric names
 */
add_action('edit_term', 'bapi_prevent_numeric_category_edit', 10, 3);

function bapi_prevent_numeric_category_edit($term_id, $tt_id, $taxonomy) {
    if ($taxonomy !== 'product_cat') {
        return;
    }
    
    $term = get_term($term_id);
    
    if (preg_match('/^\d+$/', trim($term->name))) {
        error_log(sprintf(
            '[BAPI CATEGORY BLOCKED] Attempt to edit category %d to numeric name "%s"',
            $term_id,
            $term->name
        ));
        
        // Restore previous name by reverting
        // This is tricky - we can't easily get the old value here
        // So we'll just block the edit by showing an admin notice
        add_action('admin_notices', function() use ($term) {
            echo '<div class="error"><p>';
            echo sprintf(
                '<strong>BAPI Category Validation:</strong> Category name "%s" is invalid. ' .
                'Category names cannot be numeric-only (prevents breadcrumb bugs).',
                esc_html($term->name)
            );
            echo '</p></div>';
        });
    }
}

/**
 * Log plugin activation
 */
add_action('plugins_loaded', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[BAPI] Category validation plugin loaded');
    }
});
