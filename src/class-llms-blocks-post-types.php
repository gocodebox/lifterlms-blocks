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

		// Enable REST API for custom post types.
		add_filter( 'lifterlms_register_post_type_course', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_post_type_lesson', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_post_type_membership', array( $this, 'enable_rest' ), 5 );

		// Enable REST API for custom post taxonomies.
		add_filter( 'lifterlms_register_taxonomy_args_course_cat', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_taxonomy_args_course_tag', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_taxonomy_args_course_track', array( $this, 'enable_rest' ), 5 );
		add_filter( 'lifterlms_register_taxonomy_args_course_difficulty', array( $this, 'enable_rest' ), 5 );

		// Setup course template.
		add_filter( 'lifterlms_register_post_type_course', array( $this, 'add_course_template' ), 5 );

		add_action( 'admin_footer', array( $this, 'editor_extra_data' ) );

	}

	/**
	 * Enable the rest API for custom post types & taxonomies
	 *
	 * @param   array $data post type / taxonomy data.
	 * @return  array
	 * @since   [version]
	 * @version [version]
	 */
	public function enable_rest( $data ) {

		$data['show_in_rest'] = true;

		return $data;

	}

	/**
	 * Add an editor template for courses
	 *
	 * @param   array $post_type post type data.
	 * @return  array
	 * @since   [version]
	 * @version [version]
	 */
	public function add_course_template( $post_type ) {

		$post_type['template'] = array(
			array(
				'core/paragraph',
				array(
					'placeholder' => 'Add a short description of your course visible to all visitors...',
				),
			),
			array( 'llms/course-progress' ),
		);

		return $post_type;

	}


	public function editor_extra_data() {

		$screen = get_current_screen();
		if ( 'course' === $screen->post_type && 'edit' === $screen->parent_base ) {
			$course = llms_get_post( get_the_ID() );
			$data = array(
				'instructors' => $course->instructors()->get_instructors(),
			);
			?>
			<script>
				window.llms = window.llms || {};
				window.llms.editorData = JSON.parse( '<?php echo json_encode( $data ); ?>' );
			</script>
			<?php
		}

	}

}

return new LLMS_Blocks_Post_Types();
