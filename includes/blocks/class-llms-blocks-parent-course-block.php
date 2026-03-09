<?php
/**
 * Parent Course (Back to Course) block.
 *
 * @package LifterLMS_Blocks/Blocks
 *
 * @since [version]
 * @version [version]
 *
 * @render_hook llms_parent-course_block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Parent Course block class.
 *
 * Renders a "Back to: Course Name" link using the existing
 * `lifterlms_template_single_parent_course()` template function.
 *
 * @since [version]
 */
class LLMS_Blocks_Parent_Course_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'parent-course';

	/**
	 * Is block dynamic (rendered in PHP).
	 *
	 * @var bool
	 */
	protected $is_dynamic = true;

	/**
	 * Add actions attached to the render function action.
	 *
	 * @since [version]
	 *
	 * @param array  $attributes Optional. Block attributes. Default empty array.
	 * @param string $content    Optional. Block content. Default empty string.
	 * @return void
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {

		add_action( $this->get_render_hook(), array( $this, 'output' ), 10 );
	}

	/**
	 * Output the parent course link.
	 *
	 * @since [version]
	 *
	 * @param array $attributes Optional. Block attributes. Default empty array.
	 * @return void
	 */
	public function output( $attributes = array() ) {

		ob_start();
		lifterlms_template_single_parent_course();
		$html = ob_get_clean();

		if ( $html ) {
			$class = empty( $attributes['className'] ) ? '' : ' ' . esc_attr( $attributes['className'] );
			printf(
				'<div class="wp-block-%1$s-%2$s%3$s">%4$s</div>',
				$this->vendor,
				$this->id,
				$class,
				$html
			);
		}
	}
}

return new LLMS_Blocks_Parent_Course_Block();
