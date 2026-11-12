<?php
/**
 * CybrHawk — load "Simple Custom CSS and JS" snippets only on the pages that use them.
 *
 * Install: Code Snippets → Add New → paste everything below the "<?php" line,
 *          set "Only run on site front-end", Save and Activate, then LiteSpeed → Purge All.
 *
 * Why: the free Simple Custom CSS and JS plugin prints every active snippet inline on
 * every page (102 snippets, ~1.9 MB of HTML). It keeps the list of snippet files in the
 * public property CustomCSSandJS::instance()->search_tree and reads it again when it
 * prints in wp_head / wp_body_open / wp_footer. On template_redirect (after WordPress
 * knows which page is being viewed, before any output) this removes the snippets that
 * don't belong on the current page.
 *
 * Rules (see cybrhawk_ccj_rules() below): target => list of snippet IDs.
 *   'front'   = the homepage
 *   123       = a page/post ID
 *   '/path/'  = any URL starting with that path (e.g. '/blog/')
 * A snippet listed under several targets loads on all of them.
 * A snippet that is NOT listed anywhere keeps loading on every page (safe default,
 * so new snippets work until you add them here).
 *
 * Debug (logged-in admins only, never cached by LiteSpeed):
 *   ?ccj_load_all=1  → bypass this filter on that request
 *   view source      → an HTML comment in the footer lists what was skipped
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'cybrhawk_ccj_rules' ) ) {
	/**
	 * Where each snippet is allowed to load. Snippet IDs are the post IDs shown in
	 * Custom CSS & JS → All Custom Code (hover the title → "post=12345").
	 *
	 * @return array<int|string, int[]>
	 */
	function cybrhawk_ccj_rules() {
		$rules = array(

			// Homepage
			'front' => array(
				18772, 18773, // Home Page (CSS + JS)
				17420, 17421, // CybrHawk Homepage Popup
				18770, 18771, // GigaOm Brief Modal (opened from the homepage popup)
			),

			18412 => array( 18517, 18518 ), // /hawkint/              — New HawkINT
			18541 => array( 18546, 18547 ), // /ucd/                  — UCD Page
			18645 => array( 18665, 18666 ), // /incident-response/    — Incident Response Page
			18673 => array( 18684, 18685 ), // /siem-cloud/           — SEIM Cloud New
			18700 => array( 18717, 18718 ), // /siem-ndr/             — SIEM NDR New
			18725 => array( 18739, 18740 ), // /siem-xdr/             — SIEM XDR
			17258 => array( 17385, 17386 ), // /live-threat-map/      — Live Threat Map
			17408 => array( 17409, 17410 ), // /soc-analyst/          — Soc Analyst Sections
			17019 => array( 17032, 17033 ), // /download-report/      — Download Report Page

			// /enterprise-operations-intelligence/ (HawkOps)
			17618 => array(
				18339, 18340, // HawkOps Architecture
				18058, 18059, // AI Operating Brain
				17781, 17782, // proof-points
				17794, 17795, // Use Cases
				17817, 17818, // Landscape
				17825, 17826, // Get-Started
				17931, 17932, // Walkthrough CTA
				17988, 17989, // How it Works
				18042, 18043, // See How it Works Button
				17791, 17792, // Deployment (its .deployment section isn't on any published page yet)
			),

			// /ai-governance/
			17834 => array(
				17854, 17855, // By the Numbers
				17859, 17860, // The Challenge
				17864, 17865, // Organization Stand
				17870, 17871, // Governance Framework
				17893, 17894, // Regulation Curve
				17898, 17899, // Related CTA
				17904, 17905, // Integrates Serves
				18147,        // Download the AI Governance Button
				17884, 17885, // Engagement Process (its section isn't on any published page yet)
				17948, 17949, // Why CybrHawk Video (its section isn't on any published page yet)
			),
		);

		return apply_filters( 'cybrhawk_ccj_rules', $rules );
	}
}

if ( ! function_exists( 'cybrhawk_ccj_target_matches' ) ) {
	/**
	 * Does a rule target match the current request?
	 *
	 * @param int|string $target 'front', a post ID, or a path starting with '/'.
	 * @return bool
	 */
	function cybrhawk_ccj_target_matches( $target ) {
		if ( 'front' === $target ) {
			return is_front_page();
		}

		if ( is_int( $target ) ) {
			return is_singular() && (int) get_queried_object_id() === $target;
		}

		if ( is_string( $target ) && '/' === substr( $target, 0, 1 ) ) {
			$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$path = (string) wp_parse_url( $uri, PHP_URL_PATH );
			return 0 === strpos( trailingslashit( '/' . ltrim( $path, '/' ) ), trailingslashit( $target ) );
		}

		return false;
	}
}

if ( ! function_exists( 'cybrhawk_ccj_filter_tree' ) ) {
	/**
	 * Remove snippet files that aren't allowed on this request from the plugin's print list.
	 */
	function cybrhawk_ccj_filter_tree() {
		if ( is_admin() || ! class_exists( 'CustomCSSandJS' ) || ! method_exists( 'CustomCSSandJS', 'instance' ) ) {
			return;
		}

		$is_admin_user = is_user_logged_in() && current_user_can( 'manage_options' );
		if ( $is_admin_user && isset( $_GET['ccj_load_all'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$ccj = CustomCSSandJS::instance();
		if ( ! is_object( $ccj ) || empty( $ccj->search_tree ) || ! is_array( $ccj->search_tree ) ) {
			return;
		}

		// Snippet ID => true if at least one of its targets matches this request.
		$allowed = array();
		foreach ( cybrhawk_ccj_rules() as $target => $ids ) {
			$match = cybrhawk_ccj_target_matches( $target );
			foreach ( (array) $ids as $id ) {
				$id             = (int) $id;
				$allowed[ $id ] = ! empty( $allowed[ $id ] ) || $match;
			}
		}

		$skipped = array();
		foreach ( $ccj->search_tree as $branch => $files ) {
			// Only front-end branches, e.g. "frontend-css-header-internal".
			if ( 0 !== strpos( (string) $branch, 'frontend-' ) || ! is_array( $files ) ) {
				continue;
			}

			$keep = array();
			foreach ( $files as $file ) {
				$id = (int) $file; // "18740.js" or "18740.css?v=123" → 18740
				if ( isset( $allowed[ $id ] ) && ! $allowed[ $id ] ) {
					$skipped[] = $id;
					continue;
				}
				$keep[] = $file;
			}
			$ccj->search_tree[ $branch ] = $keep;
		}

		if ( $is_admin_user && $skipped ) {
			add_action(
				'wp_footer',
				function () use ( $skipped ) {
					echo "\n<!-- CybrHawk CCJ loader: skipped " . count( $skipped ) . ' snippets on this page: ' . esc_html( implode( ', ', $skipped ) ) . " -->\n";
				},
				999
			);
		}
	}
	add_action( 'template_redirect', 'cybrhawk_ccj_filter_tree', 1 );
}