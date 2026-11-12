<?php
/**
 * CybrHawk — fix the homepage layout shift and speed up the hero (LCP).
 *
 * Install: Code Snippets → Add New → paste everything below the "<?php" line,
 *          "Only run on site front-end", Save and Activate, then LiteSpeed → Purge All.
 *
 * 1) The theme renders the Elementor header (7387) and footer (8655) templates inside
 *    <body>, so Elementor only prints their CSS files at the very end of the page
 *    (~95% down a 1 MB document). Until that CSS arrives, the header is laid out
 *    unstyled and pushes the hero down; when it arrives the hero jumps up ~190px.
 *    That jump is the 0.43 mobile CLS. Enqueuing the two CSS files in <head> fixes it.
 *
 * 2) The hero banner is a CSS background, so the browser only finds it after
 *    post-14735.css is downloaded and parsed (~2 s "resource load delay").
 *    Preloading the right file per breakpoint with fetchpriority=high fixes that.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'wp_enqueue_scripts',
	function () {
		if ( ! class_exists( '\Elementor\Core\Files\CSS\Post' ) ) {
			return;
		}
		foreach ( array( 7387, 8655 ) as $template_id ) { // 7387 = header, 8655 = footer.
			\Elementor\Core\Files\CSS\Post::create( $template_id )->enqueue();
		}
	},
	20
);

add_action(
	'wp_head',
	function () {
		if ( ! is_front_page() ) {
			return;
		}
		$base   = content_url( '/uploads/2026/11/' );
		$images = array(
			'cybrhawk-home-page-mobile-banner.webp' => '(max-width: 767px)',
			'cybrhawk-home-page-banner-1.webp'      => '(min-width: 768px) and (max-width: 1024px)',
			'cybrhawk-home-page-banner.webp'        => '(min-width: 1025px)',
		);
		foreach ( $images as $file => $media ) {
			printf(
				'<link rel="preload" as="image" href="%s" media="%s" fetchpriority="high">' . "\n",
				esc_url( $base . $file ),
				esc_attr( $media )
			);
		}
	},
	1
);