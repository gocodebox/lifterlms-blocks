<?php
/**
 * Enqueue assets
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @package LifterLMS_Blocks/Main
 * @since   1.0.0
 * @version 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue assets
 */
class LLMS_Blocks_Assets {

	/**
	 * Constructor
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function __construct() {

		add_action( 'enqueue_block_assets', array( $this, 'block_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ), 999 );

	}

	/**
	 * Enqueue Gutenberg block assets for both frontend + backend.
	 *
	 * `wp-blocks`: includes block type registration and related functions.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function block_assets() {

		wp_enqueue_style(
			'llms-blocks',
			plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
			array( 'wp-blocks' ),
			LLMS_BLOCKS_VERSION
		);

	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 *
	 * `wp-blocks`: includes block type registration and related functions.
	 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
	 * `wp-i18n`: To internationalize the block's text.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function editor_assets() {

		wp_enqueue_script(
			'lifterlms_blocks-cgb-block-js',
			plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
			array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			LLMS_BLOCKS_VERSION,
			true
		);

		wp_enqueue_style(
			'lifterlms_blocks-cgb-block-editor-css',
			plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ),
			array( 'wp-edit-blocks' ),
			LLMS_BLOCKS_VERSION
		);

	}

}

return new LLMS_Blocks_Assets();
