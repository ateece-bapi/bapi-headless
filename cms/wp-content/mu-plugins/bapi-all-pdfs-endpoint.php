<?php
/**
 * Plugin Name: BAPI All PDFs Endpoint
 * Description: Custom REST API endpoint to fetch ALL PDFs without pagination limits
 * Version: 1.0.0
 */

add_action('rest_api_init', function () {
    register_rest_route('bapi/v1', '/all-pdfs', [
        'methods' => 'GET',
        'callback' => 'bapi_get_all_pdfs',
        'permission_callback' => '__return_true',
    ]);
});

function bapi_get_all_pdfs() {
    global $wpdb;
    
    // Get ALL PDFs directly from database - bypass WordPress filters
    $results = $wpdb->get_results("
        SELECT 
            p.ID as id,
            p.post_title as title,
            p.post_date as date,
            pm_file.meta_value as file_path,
            pm_filesize.meta_value as filesize
        FROM {$wpdb->posts} p
        LEFT JOIN {$wpdb->postmeta} pm_file ON p.ID = pm_file.post_id AND pm_file.meta_key = '_wp_attached_file'
        LEFT JOIN {$wpdb->postmeta} pm_filesize ON p.ID = pm_filesize.post_id AND pm_filesize.meta_key = '_wp_attachment_metadata'
        WHERE p.post_type = 'attachment'
          AND p.post_mime_type = 'application/pdf'
          AND p.post_status = 'inherit'
        ORDER BY p.post_title ASC
    ");
    
    // Get current site URL directly to avoid filters that might change it during REST API requests
    $site_url = get_option('siteurl');
    $base_upload_url = trailingslashit($site_url) . 'wp-content/uploads';
    
    $documents = [];
    foreach ($results as $row) {
        // Parse filesize from serialized metadata
        $metadata = maybe_unserialize($row->filesize);
        $filesize = null;
        if (is_array($metadata) && isset($metadata['filesize'])) {
            $filesize = $metadata['filesize'];
        }
        
        // Construct correct URL using siteurl + file path
        $file_path = $row->file_path ?: '';
        $correct_url = $file_path ? trailingslashit($base_upload_url) . $file_path : '';
        
        $documents[] = [
            'id' => (int)$row->id,
            'title' => [
                'rendered' => $row->title ?: 'Untitled Document',
            ],
            'date' => $row->date,
            'source_url' => $correct_url,
            'media_details' => [
                'filesize' => $filesize,
            ],
        ];
    }
    
    return [
        'total' => count($documents),
        'documents' => $documents,
    ];
}
