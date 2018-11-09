<?php
defined( 'ABSPATH' ) || exit;

/**
 * Serverside block compononent registration
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

	}

	/**
	 * Register all blocks.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function init() {

		include 'course-information/class-llms-blocks-course-information-block.php';

	}

}

return new LLMS_Blocks();
