<?php
/**
 * Course syllabus block.
 *
 * @package  LifterLMS_Blocks/Blocks
 *
 * @since    1.0.0
 * @version  1.1.0
 * @deprecated [version]
 *
 * @render_hook llms_course-syllabus-block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Course syllabus block class.
 */
class LLMS_Blocks_Course_Syllabus_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'course-syllabus';

	/**
	 * Is block dynamic (rendered in PHP).
	 *
	 * @var bool
	 * @since [version] Changed to `false` to prevent the block from being registered.
	 */
	protected $is_dynamic = false;

	/**
	 * Add actions attached to the render function action.
	 *
	 * @param   array  $attributes Optional. Block attributes. Default empty array.
	 * @param   string $content    Optional. Block content. Default empty string.
	 * @return  void
	 * @since   1.0.0
	 * @version 1.1.0
	 * @deprecated [version]
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {
		llms_deprecated_function( __METHOD__, '1.2.0', __CLASS__ . '::add_hooks()' );

		add_action( $this->get_render_hook(), 'lifterlms_template_single_syllabus', 10 );
	}

	/**
	 * Retrieve custom block attributes.
	 * Necessary to override when creating ServerSideRender blocks.
	 *
	 * @return  array
	 * @since   1.0.0
	 * @version 1.0.0
	 * @deprecated [version]
	 */
	public function get_attributes() {
		llms_deprecated_function( __METHOD__, '1.2.0', __CLASS__ . '::get_attributes()' );

		return array_merge(
			parent::get_attributes(),
			array(
				'course_id' => array(
					'type'    => 'int',
					'default' => 0,
				),
			)
		);
	}

}

return new LLMS_Blocks_Course_Syllabus_Block();
