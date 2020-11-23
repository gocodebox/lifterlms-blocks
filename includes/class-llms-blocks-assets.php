<?php
/**
 * Enqueue assets
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @package LifterLMS_Blocks/Main
 *
 * @since 1.0.0
 * @version [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue assets
 *
 * @since 1.0.0
 * @since 1.4.1 Fix double slash in asset path; remove invalid frontend css dependency.
 * @since 1.8.0 Update asset paths & remove redundant CSS from frontend.
 */
class LLMS_Blocks_Assets {

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 * @since 1.8.0 Stop outputting editor CSS on the frontend.
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ), 999 );
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 *
	 * @since 1.0.0
	 * @since 1.4.1 Fix double slash in asset path.
	 * @since 1.8.0 Update asset paths and improve script dependencies.
	 * @since [version] Load script translations & add RTL css.
	 *
	 * @return void
	 */
	public function editor_assets() {

		$asset = include LLMS_BLOCKS_PLUGIN_DIR . '/assets/js/llms-blocks.asset.php';

		wp_enqueue_script(
			'llms-blocks-editor',
			LLMS_BLOCKS_PLUGIN_DIR_URL . 'assets/js/llms-blocks.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		$l10n_dir   = 'i18n';
		$plugin_dir = LLMS_BLOCKS_PLUGIN_DIR;

		// If the plugin is being loaded as a library, use the files included in the core plugin.
		if ( defined( 'LLMS_BLOCKS_LIB' ) && LLMS_BLOCKS_LIB ) {
			$l10n_dir   = null;
			$plugin_dir = null;
		}

		/**
		 * Load script translations.
		 *
		 * Language files files can be found in the following locations (The first loaded file takes priority):
		 *
		 *   1. wp-content/languages/lifterlms/lifterlms-{$locale}-{md5($handle)}.json
		 *   2. wp-content/languages/plugins/lifterlms-{$locale}-{md5($handle)}.json
		 *   3. wp-content/plugins/lifterlms/languages/lifterlms-{$locale}-{md5($handle)}.json
		 *
		 * See `llms_set_script_translations()` for more information.
		 */
		llms_set_script_translations( 'llms-blocks-editor', 'lifterlms', $plugin_dir, $l10n_dir );

		wp_enqueue_style(
			'llms-blocks-editor',
			LLMS_BLOCKS_PLUGIN_DIR_URL . 'assets/css/llms-blocks.css',
			array( 'wp-edit-blocks' ),
			$asset['version']
		);
		wp_style_add_data( 'llms-blocks-editor', 'rtl', 'replace' );

	}

}

return new LLMS_Blocks_Assets();
