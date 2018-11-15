<?php
defined( 'ABSPATH' ) || exit;

/**
 * Serverside block compononent registration
 *
 * @since    [version]
 * @version  [version]
 */
class LLMS_Blocks {

	/**
	 * Constructor.
	 *
	 * @since    [version]
	 * @version  [version]
	 */
	public function __construct() {

		add_action( 'init', array( $this, 'init' ) );

		// add_filter( 'render_block', array( $this, 'maybe_filter_block' ), 10, 2 );
	}

	/**
	 * Register all blocks.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function init() {

		include 'blocks/course-information/class-llms-blocks-course-information-block.php';

	}

	public function maybe_filter_block( $content, $block ) {
		llms_log( $block );
		return $content;
	}

}

return new LLMS_Blocks();
