<?php
/**
 * Course information block.
 *
 * @package  LifterLMS_Blocks/Abstracts
 * @since    [version]
 * @version  [version]
 *
 * @render_hook llms/course-information-block/render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Course information block class.
 */
class LLMS_Blocks_Course_Information_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'course-information';

	/**
	 * Is block dynamic (rendered in PHP).
	 *
	 * @var bool
	 */
	protected $is_dynamic = true;

	/**
	 * Add actions attached to the render function action.
	 *
	 * @param   array  $attributes Optional. Block attributes. Default empty array.
	 * @param   string $content    Optional. Block content. Default empty string.
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {

		$attributes = wp_parse_args( $attributes, array(
			'title' => __( 'Course Information', 'lifterlms' ),
			'title_size' => 'h3',
			'show_length' => true,
			'show_difficulty' => true,
			'show_tracks' => true,
			'show_cats' => true,
			'show_tags' => true,
		) );

		$show_wrappers = false;

		if ( $attributes['show_length'] ) {
			$show_wrappers = true;
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_length', 10 );
		}

		if ( $attributes['show_difficulty'] ) {
			$show_wrappers = true;
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_difficulty', 20 );
		}

		if ( $attributes['show_tracks'] ) {
			$show_wrappers = true;
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_course_tracks', 25 );
		}

		if ( $attributes['show_cats'] ) {
			$show_wrappers = true;
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_course_categories', 30 );
		}

		if ( $attributes['show_tags'] ) {
			$show_wrappers = true;
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_course_tags', 35 );
		}

		if ( $show_wrappers ) {

			$this->title = $attributes['title'];
			$this->title_size = $attributes['title_size'];

			add_filter( 'llms_course_meta_info_title', array( $this, 'filter_title' ) );
			add_filter( 'llms_course_meta_info_title_size', array( $this, 'filter_title_size' ) );

			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_meta_wrapper_start', 5 );
			// add_action( 'llms/course-information-block/render', 'lifterlms_template_course_author', 40 );
			add_action( 'llms/course-information-block/render', 'lifterlms_template_single_meta_wrapper_end', 50 );

		}

	}

	/**
	 * Filters the title of the course information headline per block settings.
	 *
	 * @param   string    $title default title
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function filter_title( $title ) {
		return $this->title;
	}

	/**
	 * Filters the title headline element size of the course information headline per block settings.
	 *
	 * @param   string    $size default size
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function filter_title_size( $size ) {
		return $this->title_size;
	}

	/**
	 * Register meta attributes stub.
	 *
	 * Called after registering the block type.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function register_meta() {

		register_meta( 'post', '_llms_length', array(
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback' => array( $this, 'meta_auth_callback' ),
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
		) );

	}

	/**
	 * Meta field update authorization callback.
	 *
	 * @todo    finish this stub.
	 * @param   [type]    $allowed   [description]
	 * @param   [type]    $meta_key  [description]
	 * @param   [type]    $object_id [description]
	 * @param   [type]    $user_id   [description]
	 * @param   [type]    $cap       [description]
	 * @param   [type]    $caps      [description]
	 * @return  [type]
	 * @since   [version]
	 * @version [version]
	 */
	public function meta_auth_callback( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
		return true;
	}

}

return new LLMS_Blocks_Course_Information_Block();
