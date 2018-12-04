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

		// Quick and dirty for webinar preview.
		add_action( 'wp', function() {

			if ( has_block( 'llms/course-continue-button' ) || has_block( 'llms/course-progress' ) ) {
				remove_action( 'lifterlms_single_course_after_summary', 'lifterlms_template_single_course_progress', 60 );
			}

		} );


	}

	/**
	 * Register all blocks & components.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function init() {

		// Visibility Component.
		require_once LLMS_BLOCKS_PLUGIN_DIR . '/includes/class-llms-blocks-visibility.php';

		// Dynamic Blocks.
		require_once LLMS_BLOCKS_PLUGIN_DIR . '/includes/blocks/class-llms-blocks-course-information-block.php';
		require_once LLMS_BLOCKS_PLUGIN_DIR . '/includes/blocks/class-llms-blocks-course-syllabus-block.php';
		require_once LLMS_BLOCKS_PLUGIN_DIR . '/includes/blocks/class-llms-blocks-pricing-table-block.php';

	}

}

return new LLMS_Blocks();
