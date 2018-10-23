<?php
/**
 * Modify LifterLMS Custom Post Types for Gutenberg editor compatibility
 *
 * @package  LifterLMS_Blocks/Main
 * @since    [version]
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * Setup editor templates for LifterLMS custom Post Types
 */
class LLMS_Blocks_Post_Types {

	/**
	 * Constructor
	 *
	 * @since    [version]
	 * @version  [version]
	 */
	public function __construct() {

		add_filter( 'lifterlms_register_post_type_course', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_post_type_lesson', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_post_type_membership', array( $this, 'enable_rest' ), 5 );

		add_filter( 'lifterlms_register_post_type_course', array( $this, 'add_course_template' ), 5 );

	}

	/**
	 * Enable the rest API for custom post types
	 *
	 * @param   array    $post_type post type data.
	 * @return  array
	 * @since   [version]
	 * @version [version]
	 */
	public function enable_rest( $post_type ) {

		$post_type['show_in_rest'] = true;
		return $post_type;

	}

	/**
	 * Add an editor template for courses
	 *
	 * @param   array    $post_type post type data.
	 * @return  array
	 * @since   [version]
	 * @version [version]
	 */
	public function add_course_template( $post_type ) {

		$post_type['template'] = array(
			array( 'core/paragraph', array(
				'placeholder' => 'Add a short description of your course visible to all visitors...',
			) ),
			array( 'llms/course-progress' ),
		);

		return $post_type;

	}


}

return new LLMS_Blocks_Post_Types();
