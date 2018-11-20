<?php
/**
 * Serverside block compononent registration
 *
 * @package  LifterLMS_Blocks/Classes
 * @since    [version]
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * LLMS_Blocks class
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
	 * Register all blocks & components.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function init() {

		require_once 'blocks/course-information/class-llms-blocks-course-information-block.php';
		require_once 'visibility/class-llms-blocks-visibility.php';

	}

}

return new LLMS_Blocks();
