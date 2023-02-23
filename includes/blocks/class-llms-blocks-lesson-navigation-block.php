<?php
/**
 * Lesson Navigation block.
 *
 * @package  LifterLMS_Blocks/Blocks
 *
 * @since    1.0.0
 * @version  1.1.0
 *
 * @render_hook llms_lesson-navigation-block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Course lesson navigation block class.
 */
class LLMS_Blocks_Lesson_Navigation_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'lesson-navigation';

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
	 * @since   1.0.0
	 * @version 1.1.0
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {

		add_action( $this->get_render_hook(), 'lifterlms_template_lesson_navigation', 10 );

	}

	/**
	 * Retrieve custom block attributes.
	 * Necessary to override when creating ServerSideRender blocks.
	 *
	 * @return  array
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function get_attributes() {
		return array_merge(
			parent::get_attributes(),
			array(
				'post_id' => array(
					'type'    => 'int',
					'default' => 0,
				),
			)
		);
	}

}

return new LLMS_Blocks_Lesson_Navigation_Block();
