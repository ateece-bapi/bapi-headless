<?php
/**
 * Debug WordPress Taxonomy Terms and Product Assignments
 * 
 * Run this file via WP-CLI or WordPress admin to investigate filter issues
 * 
 * Usage: wp eval-file debug-wordpress-taxonomy.php
 */

// Get all Application taxonomy terms
echo "=== PA_APPLICATION TAXONOMY TERMS ===\n";
$app_terms = get_terms([
    'taxonomy' => 'pa_application',
    'hide_empty' => false,
]);

foreach ($app_terms as $term) {
    echo sprintf(
        "ID: %d | Name: '%s' | Slug: '%s' | Count: %d\n",
        $term->term_id,
        $term->name,
        $term->slug,
        $term->count
    );
}

// Find products in "Room" category
echo "\n=== PRODUCTS IN 'ROOM' CATEGORY ===\n";
$room_category = get_term_by('slug', 'temp-room', 'product_cat');

if ($room_category) {
    $products = get_posts([
        'post_type' => 'product',
        'posts_per_page' => -1,
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => 'temp-room',
            ],
        ],
    ]);

    echo "Found " . count($products) . " products in temp-room category\n\n";

    // Sample first 5 products to see their attributes
    $sample = array_slice($products, 0, 5);
    
    foreach ($sample as $product) {
        $product_obj = wc_get_product($product->ID);
        echo "Product: {$product->post_title} (ID: {$product->ID})\n";
        
        // Get all product attributes
        $attributes = $product_obj->get_attributes();
        
        foreach ($attributes as $attribute) {
            if ($attribute->is_taxonomy()) {
                $taxonomy = $attribute->get_taxonomy_object();
                $terms = wc_get_product_terms(
                    $product->ID,
                    $attribute->get_name(),
                    ['fields' => 'names']
                );
                
                echo "  - {$taxonomy->attribute_label}: " . implode(', ', $terms) . "\n";
            }
        }
        echo "\n";
    }
    
    // Check specifically for "Room Temp" application
    echo "\n=== PRODUCTS WITH 'ROOM TEMP' APPLICATION ===\n";
    $room_temp_products = get_posts([
        'post_type' => 'product',
        'posts_per_page' => -1,
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => 'temp-room',
            ],
            [
                'taxonomy' => 'pa_application',
                'field' => 'slug',
                'terms' => 'room-temp', // Assuming slug is 'room-temp'
            ],
        ],
    ]);
    
    echo "Found " . count($room_temp_products) . " products with 'Room Temp' application\n";
    
    if (count($room_temp_products) === 0) {
        echo "\n⚠️  NO PRODUCTS FOUND - This explains the filter issue!\n";
        echo "Possible reasons:\n";
        echo "1. Products use different application term (check product attributes above)\n";
        echo "2. Taxonomy term 'Room Temp' exists but isn't assigned to products\n";
        echo "3. Products are in different category than expected\n";
    }
    
} else {
    echo "ERROR: 'temp-room' category not found\n";
}

// Check for similar term names
echo "\n=== SIMILAR TERM NAMES (might be duplicates) ===\n";
$all_app_terms = get_terms([
    'taxonomy' => 'pa_application',
    'hide_empty' => false,
]);

$room_related = [];
foreach ($all_app_terms as $term) {
    if (stripos($term->name, 'room') !== false || stripos($term->slug, 'room') !== false) {
        $room_related[] = $term;
    }
}

if (!empty($room_related)) {
    echo "Found " . count($room_related) . " terms related to 'room':\n";
    foreach ($room_related as $term) {
        echo sprintf(
            "  - Name: '%s' | Slug: '%s' | Count: %d\n",
            $term->name,
            $term->slug,
            $term->count
        );
    }
} else {
    echo "No terms found containing 'room'\n";
}
