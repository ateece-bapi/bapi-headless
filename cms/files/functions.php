<?php

// use Psr\Log\LoggerInterface;
// use Vendi\BAPI\Theme\Exception\FtpConnectionException;
// use Vendi\BAPI\Theme\Exception\FtpLoginException;
// use Vendi\BAPI\Theme\Utility\FtpCredentialUtility;

if (!defined('VENDI_CUSTOM_THEME_FILE')) {
    define('VENDI_CUSTOM_THEME_FILE', __FILE__);
}

if (!defined('VENDI_CUSTOM_THEME_PATH')) {
    define('VENDI_CUSTOM_THEME_PATH', __DIR__);
}

if (!defined('VENDI_CUSTOM_THEME_PATH_INCLUDES')) {
    define('VENDI_CUSTOM_THEME_PATH_INCLUDES', __DIR__ . '/includes');
}


// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/autoload.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/global-functions.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/kernel.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/legacy-dBug.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/shortcodes.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/logout-fix.php';
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/vendi/hooks.php';
#


/**
 * Storefront automatically loads the core CSS even if using a child theme as it is more efficient
 * than @importing it in the child theme style.css file.
 *
 * Uncomment the line below if you'd like to disable the Storefront Core CSS.
 *
 * If you don't plan to dequeue the Storefront Core CSS you can remove the subsequent line and as well
 * as the sf_child_theme_dequeue_style() function declaration.
 */
// add_action( 'wp_enqueue_scripts', 'sf_child_theme_dequeue_style', 999 );

/**
 * Dequeue the Storefront Parent theme core CSS
 */
//function sf_child_theme_dequeue_style() {
//wp_dequeue_style( 'storefront-style' );
//wp_dequeue_style( 'storefront-woocommerce-style' );
//}

/**
 * Note: DO NOT! alter or remove the code above this text and only add your custom PHP functions below this text.
 */
// locate_template('includes/class-bapi-search-replace.php', true);
// require_once VENDI_CUSTOM_THEME_PATH . '/includes/BAPI_Legacy_WPEC.php';
// locate_template('includes/class-bapi.php', true);

// Admin Stuff
// locate_template('admin/class-admin.php', true);

// locate_template('inc/shortcodes.php', true);

// locate_template('includes/sgs_pagination.class.php', true);

if (!class_exists('bapiv4_temp')) {
    class bapiv4_temp
    {


        public function __construct()
        {
            // add actions and filters go here
            // pulling in custom jquery
            add_action('wp_enqueue_scripts', [$this, 'wp_enqueue_scripts']);

            // ---- UI ----
            /* product search */
            add_action('storefront_header', [$this, 'storefront_product_search'], 39);

            // custom logo
            add_action('storefront_header', [$this, 'storefront_site_branding'], 19);

            // put the menu next to the logo
            add_action('storefront_before_header', [$this, 'header_wrapping']);

            // add a second footer widget row
            add_filter('storefront_footer_widget_rows', [$this, 'alter_footer_widget_rows']);

            // footer credit line
            add_action('storefront_footer', [$this, 'storefront_credit'], 19);

            // ---- Woo Category Customizations ----
            add_action('bapi_woocommerce_sidebar', [$this, 'bapi_woocommerce_sidebar'], 1);

            // Draw breadcrumbs below <header> on product category pages only
            add_action('wp', [$this, 'wp']);

            // ---- Archive Customizations ----
            // remove the prefix before Category titles
            add_filter('get_the_archive_title', [$this, 'prefix_category_title']);

            // ---- Product Detail Customizations ----
            // Change number of related products output
            add_filter('storefront_related_products_args', [$this, 'storefront_related_products_args'], 5);

            // Changing the Ajaz variation threshold
            add_filter('woocommerce_ajax_variation_threshold', [$this, 'iconic_wc_ajax_variation_threshold'], 10, 2);

            // adding captions below thumbnails in the gallery
            add_filter('woocommerce_single_product_image_thumbnail_html', [$this, 'woocommerce_single_product_image_thumbnail_html'], 10, 2);

            // ---- Woo Category Customizations ----
            // Adding copy to the Checkout pages
            add_action('woocommerce_checkout_after_customer_details', [$this, 'woocommerce_checkout_after_customer_details']);
            add_action('woocommerce_review_order_before_payment', [$this, 'woocommerce_review_order_before_payment']);

            // Register a new post type for Application Notes
            add_action('init', [$this, 'register_app_notes']);
            add_action('init', [$this, 'create_app_notes_tax']);

            // Override loop template and show quantities next to add to cart buttons
            add_filter('woocommerce_loop_add_to_cart_link', [$this, 'quantity_inputs_for_woocommerce_loop_add_to_cart_link'], 10, 2);

            add_action('woocommerce_before_main_content', [$this, 'woocommerce_before_main_content']);

            // add_filter( 'woocommerce_shipping_packages', array( $this, 'woocommerce_shipping_packages' ) );

            add_filter('woocommerce_product_add_to_cart_text', [$this, 'woocommerce_product_add_to_cart_text'], 10);
            // add_filter( 'woocommerce_shipping_packages', array( $this, 'woocommerce_shipping_packages' ) );
        } // end of public function bapiv4_temp()

        public function woocommerce_product_add_to_cart_text($text)
        {
            global $product;
            if ($product->is_type('variable')) {
                $text = $product->is_purchasable() ? __('Configure', 'woocommerce') : __('Read more', 'woocommerce');
            }

            return $text;
        }

        function woocommerce_shipping_packages($packages)
        {
            $excluded_states = ['AK', 'HI', 'GU', 'PR'];

            if (!empty($packages)) {
                if (!empty($packages[0]['rates'])) {
                    foreach ($packages[0]['rates'] as $key => $rate) {
                        if ($rate->get_label() === 'Ground (UPS)' && !in_array(WC()->customer->get_shipping_state(), $excluded_states)) {
                            $our_ground_rate = $rate;
                            if ($our_ground_rate) {
                                $our_ground_rate->set_cost(10);
                                $packages[0]['rates'][$key] = $our_ground_rate;
                            }
                        }
                    }
                }
            }

            return $packages;
        }

        public function woocommerce_before_main_content()
        {
            if (is_product_taxonomy()) { ?>
                <?php
                $term_id = get_queried_object_id();
                $taxonomy = 'product_cat';

                // Get subcategories of the current category
                $terms = get_terms(
                    [
                        'taxonomy' => $taxonomy,
                        'hide_empty' => true,
                        'parent' => get_queried_object_id(),
                    ],
                );
                // loop through if there's any sub cats
                if (sizeof($terms) > 0) {
                    ?>
                    <div class="subcats-wrap">
                        <div class="col-full">

                            <h2>Subcategories:</h2>

                            <?php

                            // Loop through product subcategories WP_Term Objects
                            foreach ($terms as $term) {
                                $term_link = get_term_link($term, $taxonomy);
                                ob_start();
                                woocommerce_subcategory_thumbnail($term);
                                $term_image = ob_get_clean();
                                ?>

                                <div class="subcat">
                                    <a href="<?php echo $term_link; ?>">
										<span class="image">
											<?php echo $term_image; ?>
										</span>
                                        <span class="title-banner">
											<?php echo $term->name; ?>
										</span>
                                    </a>
                                </div>

                                <?php
                            }

                            ?>
                        </div>
                    </div>
                <?php } ?>

                <?php
            }
        }

        public function quantity_inputs_for_woocommerce_loop_add_to_cart_link($html, $product)
        {
            if ($product && $product->is_type('simple') && $product->is_purchasable() && $product->is_in_stock() && !$product->is_sold_individually()) {
                $html = '<form action="' . esc_url($product->add_to_cart_url()) . '" class="cart" method="post" enctype="multipart/form-data">';
                $html .= woocommerce_quantity_input([], $product, false);
                $html .= '<button type="submit" class="button alt">' . esc_html($product->add_to_cart_text()) . '</button>';
                $html .= '</form>';
            }

            return $html;
        }

        /** CUSTOMIZE ARCHIVES */
        public function prefix_category_title($title)
        {
            if (is_category()) {
                $title = single_cat_title('', false);
            }

            return $title;
        }

        public function woocommerce_single_product_image_thumbnail_html($html, $attachment_id)
        {
            $caption = get_post_field('post_excerpt', $attachment_id);

            if (trim($caption)) {
                $html = str_replace('</div>', '<span class="gtnCaps">' . $caption . '</span></div>', $html);
            }

            return $html;
        }

        public function subcategory_archive_thumbnail_size($size)
        {
            exit();

            return [
                'width' => 300,
                'height' => 300,
                'crop' => 0,
            ];
        }

        public function register_app_notes()
        {
            register_post_type(
                'application_note',
                [
                    'labels' => [
                        'name' => __('Application Notes'),
                        'singular_name' => __('Application Note'),
                    ],
                    'public' => true,
                    'has_archive' => true,
                ],
            );
        }

        public function create_app_notes_tax()
        {
            register_taxonomy(
                'application_note_tax',
                'application_note',
                [
                    'label' => __('Categories'),
                    'rewrite' => ['slug' => 'application_note'],
                    'hierarchical' => true,
                ],
            );
        }

        // Adding copy to the checkout pages
        public function woocommerce_checkout_after_customer_details()
        {
            if (!$copy = get_field('after_customer_details', 'option')) {
                return;
            }
            ?>
            <div class="after-customer-details copy">
                <?php echo wp_kses_post($copy); ?>
            </div>

            <?php
        }

        public function woocommerce_review_order_before_payment()
        {
            ?>

            <div class="before-payment">
                <p>WARNING: Cancer and Reproductive Harm –
                    <a href="https://www.p65warnings.ca.gov/" target="_blank">www.P65Warnings.ca.gov</a></p>
            </div>

            <?php
        }

        // changing the ajax variation threshold
        public function iconic_wc_ajax_variation_threshold($qty, $product)
        {
            return 300;
        }

        // custom jquery
        public function wp_enqueue_scripts()
        {
            wp_register_script('custom', get_stylesheet_directory_uri() . '/js/custom.js', ['jquery'], filemtime(get_stylesheet_directory() . '/js/custom.js'), true);
            wp_enqueue_script('jquery-format-currency', get_stylesheet_directory_uri() . '/js/jquery.formatCurrency-1.4.0.js', ['jquery'], filemtime(get_stylesheet_directory() . '/js/jquery.formatCurrency-1.4.0.js'));
            wp_enqueue_script('custom');
        }

        // ---- UI ----
        public function bapi_woocommerce_sidebar()
        {
            echo '<div class="woo-sidebar"><a class="mobile-sidebar-header-toggle" href="#"><h3 class="mobile-sidebar-header">Filter</h3></a><div class="sidebar-contents">';
            woocommerce_get_sidebar();
            echo '</div></div>';
        }

        /* product search */
        public function storefront_product_search()
        {
            remove_action('storefront_header', 'storefront_product_search', 40);
            ?>

            <div class=" search-link"><a href="<?php echo bloginfo('url'); ?>">Search</a>
            </div>

            <div class="search-box">
                <?php the_widget('WP_Widget_Search'); ?>
            </div>

            <?php
        }

        // put the main nav next to the logo
        function header_wrapping()
        { ?>
            <div class="global-wrap">
                <div class="col-full">
                    <?php wp_nav_menu(
                        [
                            'menu' => 'Demo Top Top Menu',
                            'container' => 'nav',
                            'container_class' => 'global-nav',
                            'menu_class' => 'main-nav',
                            'fallback_cb' => 'false',
                            'depth' => 3,
                        ],
                    ); ?>
                    <template id="global-nav-cart">
                        <?php if (!WC()->cart->is_empty()) : ?>
                            <li class="menu-item item cart">
                                <a href="/cart" class="cart-link">
                                    <?php
                                    do_action('woocommerce_widget_shopping_cart_total');
                                    ?> |
                                    <?php global $woocommerce;
                                    echo $woocommerce->cart->cart_contents_count . ' items'; ?>
                                </a>
                            </li>
                        <?php endif; ?>
                    </template>

                    <script>
                        const nav = document.querySelector('.global-nav .main-nav');
                        const cartTemplate = document.querySelector('#global-nav-cart');
                        nav.append(cartTemplate.content.cloneNode(true));
                        document
                            .querySelectorAll('.global-nav')
                            .forEach(
                                (globalNav) => {
                                    globalNav
                                        .addEventListener(
                                            'mouseout',
                                            () => {
                                                globalNav
                                                    .querySelectorAll('.main-nav > .menu-item')
                                                    .forEach(
                                                        (mi) => {
                                                            mi.classList.remove('active');
                                                        }
                                                    )
                                                ;
                                            }
                                        )
                                    ;
                                    globalNav
                                        .querySelectorAll('.main-nav')
                                        .forEach(
                                            (ul) => {
                                                const menuItems = ul.querySelectorAll(':scope > .menu-item');

                                                menuItems
                                                    .forEach(
                                                        (item) => {
                                                            item
                                                                .addEventListener(
                                                                    'mouseover',
                                                                    () => {

                                                                        menuItems
                                                                            .forEach(
                                                                                (mi) => {
                                                                                    mi.classList.toggle('active', item === mi);
                                                                                }
                                                                            )
                                                                        ;
                                                                    }
                                                                )
                                                            ;
                                                        }
                                                    )
                                                ;
                                            }
                                        )
                                    ;
                                }
                            )
                        ;
                    </script>
                </div>
            </div>
            <?php
            remove_action('storefront_header', 'storefront_header_container', 0);
            add_action('storefront_header', [$this, 'header_wrapper_open'], 0);
            add_action('storefront_header', 'storefront_header_container', 1);
            add_action('storefront_header', [$this, 'header_wrapper_close'], 69);
        }

        function header_wrapper_open()
        {
            echo '<div class="header-wrap">';
            ?>

            <?php
        }

        function header_wrapper_close()
        {
            echo '</div>';
        }

        // overwriting logo functionality to add line of text below
        public function storefront_site_branding()
        {
            remove_action('storefront_header', 'storefront_site_branding', 20);
            remove_action('storefront_header', 'storefront_header_cart', 60);
            ?>

            <!-- Logo -->
            <div class="logo-wrapper">
                <a href="<?php echo bloginfo('url'); ?>"><img src="/wp-content/themes/bapi-v4/logo.png" alt="Bapi Logo"></a>
                <div class="logo-tag">
                    Sensors for HVAC/R
                </div>
            </div>
            <?php
        }

        // add a second row to the footer widgets
        public function alter_footer_widget_rows($footer_rows)
        {
            $footer_rows = 2;

            return $footer_rows;
        }

        // footer credit line
        public function storefront_credit()
        {
            remove_action('storefront_footer', 'storefront_credit', 20);
            ?>

            <div class="socket">


                </ul>
            </div>
            </div>

            <div class="left">
                <div class="sgs-credit">
                    <br>
                </div>
                <div class="bapi-credit">

                </div>

            </div>

            </div>

            <?php
        }

        // ---- Woo Category Customizations ----
        // Customizing the Page Title area of Category Pages
        public function woocommerce_show_page_title()
        {
            $term = get_queried_object();

            $image = get_field('category_hero_image', 'option');
            if (get_field('category_hero_image', $term)) {
                $image = get_field('category_hero_image', $term);
            }

            if (!empty($image) && is_product_taxonomy()) :
                ?>

                <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>"/>

            <?php endif; ?>

            <h1><?php echo esc_html(woocommerce_page_title()); ?></h1>

            <?php
        }

        // Remove add to cart button from product category pages
        public function woocommerce_template_loop_add_to_cart()
        {
            ?>


            <?php
        }

        // remove woo breadcrumbs on cat pages only, adding back in archive-product
        public function wp()
        {
            if (function_exists('is_product_taxonomy') && is_product_taxonomy()) {
                remove_action('storefront_before_content', 'woocommerce_breadcrumb', 10);
                add_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 1);
                // add_action('woocommerce_before_main_content', array( $this,'bapi_wrapping_content'), 2);
                // add_action('woocommerce_sidebar', array( $this, 'bapi_closing_wrapper'), 100);
                // remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
            }
        }

        public function bapi_wrapping_content()
        {
            echo '<div class="col-full">';
        }

        public function bapi_closing_wrapper()
        {
            echo '</div>';
        }


        // ---- Product Detail Customizations ----
        public function storefront_related_products_args($args)
        {
            $args['posts_per_page'] = 500;

            return $args;
        }
    } // end of bapiv4_temp class

    new bapiv4_temp();
} // end of if class exists

if (!function_exists('usortByArrayKey')) {
    function usortByArrayKey(&$array, $key, $asc = SORT_ASC)
    {
        $sort_flags = [SORT_ASC, SORT_DESC];
        if (!in_array($asc, $sort_flags)) {
            throw new InvalidArgumentException('sort flag only accepts SORT_ASC or SORT_DESC');
        }
        $cmp = function (array $a, array $b) use ($key, $asc, $sort_flags) {
            if (!is_array($key)) {
                // just one key and sort direction
                if (!isset($a[$key]) || !isset($b[$key])) {
                    throw new Exception('attempting to sort on non-existent keys');
                }
                if ($a[$key] == $b[$key]) {
                    return 0;
                }

                return ($asc == SORT_ASC xor $a[$key] < $b[$key]) ? 1 : -1;
            } else {
                // using multiple keys for sort and sub-sort
                foreach ($key as $sub_key => $sub_asc) {
                    // array can come as 'sort_key'=>SORT_ASC|SORT_DESC or just 'sort_key', so need to detect which
                    if (!in_array($sub_asc, $sort_flags)) {
                        $sub_key = $sub_asc;
                        $sub_asc = $asc;
                    }

                    // just like above, except 'continue' in place of return 0
                    if (!isset($a[$sub_key]) || !isset($b[$sub_key])) {
                        throw new Exception('attempting to sort on non-existent keys');
                    }
                    if ($a[$sub_key] == $b[$sub_key]) {
                        continue;
                    }

                    return ($sub_asc == SORT_ASC xor $a[$sub_key] < $b[$sub_key]) ? 1 : -1;
                }

                return 0;
            }
        };
        usort($array, $cmp);
    }
}

if (!function_exists('retry_till_success')) {
    function retry_till_success($method, $args)
    {
        /** @var LoggerInterface $logger */
//    $logger = __get_global_kernel()->getContainer()->get('logger.default');

//    $logger->debug(
//        'Call to function ' . __FUNCTION__,
//        [
//            'method' => $method,
//            'args' => $args,
//        ]
//    );

        $success = 0;
        $tries = 0;

        do {
            $tries++;
            $success = call_user_func_array($method, $args);
//        $logger->debug(
//            'Function returned',
//            [
//                'status' => $success,
//                'last-tries' => ($tries - 1),
//            ]
//        );
            if (!$success) {
                usleep(1000000);
            }
        } while (!$success && $tries < 3);

        if ($tries >= 3) {
            return false;
        }

        return true;
    }
}


if (!function_exists('ftp_file')) {
    /**
     * @throws Exception
     */
    function ftp_file($filename = '', $file = '')
    {
        /** @var LoggerInterface $logger */
//    $logger = __get_global_kernel()->getContainer()->get('logger.ftp');
//    $logger->debug('Call to function ' . __FUNCTION__, func_get_args());

        if (!is_file($file)) {
//        $logger->error('Supplied path is not a file', ['file' => $file]);
            throw new Exception('Supplied path is not a file');
        }

        if (!is_readable($file)) {
//        $logger->error('Supplied path is not readable', ['file' => $file]);
            throw new Exception('Supplied path is not readable');
        }

//    $logger->debug('Checking file size');

        // The original check was for a zero-byte file. If this fails, false will also be returned, so let's check for both.
        if (!filesize($file)) {
            // send an email to admin as a notice
            $ftp_subject = "The file being sent to the FTP site seems to be blank: \n";
            $ftp_subject .= 'Filename: ' . $filename . " \n";
            $ftp_subject .= "To manually ftp this order's file, please login to the WordPress Dashboard and click the export link on this order's row.\n\n";
            $ftp_subject .= "If you have any questions or concerns, please contact Sleeping Giant Studios support (jake@sleepinggiantstudios.com).\n";
//        $logger->error('File size was less than or equal to zero');
            wp_mail(get_option('missed_ftp_emails'), 'Blank File: ' . $filename, $ftp_subject, 'From: ' . get_option('return_email') . '');
        }

        // for huge files set time limit to zero that means unlimited.
        set_time_limit(30);

        try {
            $ftp_credentials = FtpCredentialUtility::getCredentialsForOrders();
        } catch (Exception $e) {
//        $logger->error('Could not get FTP credentials for orders', ['exception' => $e]);
            throw $e;
        }

        $ftp_web_root = '/FROM_WEBSITE/';
        // folder name from user home dir.

        $fileElementName = 'userFile';
        // file field name

        // Default is failure
        $return = false;

//    $logger->debug('Attempting FTP connection', ['credentials' => $ftp_credentials]);

        $conn_id = ftp_connect($ftp_credentials->host, $ftp_credentials->port, 10);
        if (!$conn_id) {
//        $logger->error('Could not connect to FTP server');
            throw new FtpConnectionException($ftp_credentials);
        }

        if (!ftp_login($conn_id, $ftp_credentials->user, $ftp_credentials->getPassword())) {
            $error = error_get_last();
//        $logger->error('Could not log onto FTP server', ['error' => $error]);
            ftp_raw($conn_id, 'QUIT');
            ftp_close($conn_id);
            throw new FtpLoginException($ftp_credentials, $error);
        }

//    $logger->debug('Attempting to switch to PASV mode');
        if (!ftp_pasv($conn_id, true)) {
            $logger->error('Could not switch to PASV mode');
        }

        $file_upload_limit_size = (1024 * 1024 * 1025 * 100);
        if (ftp_put($conn_id, $ftp_web_root . $filename, $file, FTP_BINARY)) {
            $result = 'Successfully uploaded ' . $file;
//        $logger
//            ->debug(
//                'Successfully placed remote file',
//                [
//                    'remote_file' => $ftp_web_root . $filename,
//                    'local_file' => $file,
//                ]
//            );
            $return = true;
        } else {
//        $logger
//            ->error(
//                'Could not put remote file',
//                [
//                    'remote_file' => $ftp_web_root . $filename,
//                    'local_file' => $file,
//                ]
//            );
            $result = 'There was a problem while uploading ' . $file;
        }

        ftp_raw($conn_id, 'QUIT');
        ftp_close($conn_id);

        return $return;
    }
}


if (!function_exists('get_current_user_role')) {
    function get_current_user_role()
    {
        $current_user = wp_get_current_user();
        if (!$current_user) {
            return null;
        }
        $user_roles = $current_user->roles;
        $user_role = array_shift($user_roles);

        return $user_role;
    }
}

    // Enqueue custom GTranslate fix JS (PROD)
    add_action('wp_enqueue_scripts', function() {
        if (!is_admin()) {
            wp_enqueue_script(
                'bapi-gtranslate-fix',
                get_stylesheet_directory_uri() . '/js/gtranslate-fix.js',
                array(),
                filemtime(get_stylesheet_directory() . '/js/gtranslate-fix.js'),
                true
            );
        }
    });
