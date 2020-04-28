<?php
/**
 * Course progress bar block
 *
 * @package  LifterLMS_Blocks/Blocks
 *
 * @since [version]
 * @version [version]
 *
 * @render_hook llms_course-progress_block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Course progress block class.
 */
class LLMS_Blocks_Course_Progress_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'course-progress';

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
	 * Output the course progress bar
	 *
	 * @since [version]
	 *
	 * @param array $attributes Optional. Block attributes. Default empty array.
	 * @return void
	 */
	public function output( $attributes = array() ) {
		$progress = do_shortcode( '[lifterlms_course_progress check_enrollment=1]' );
		$class    = empty( $attributes['className'] ) ? '' : $attributes['className'];

		if ( $progress ) {
			printf(
				'<div class="wp-block-llms-%1$s%2$s">%3$s</div>',
				$this->id,
				// Take into account the custom class attribute.
				empty( $attributes['className'] ) ? '' : ' ' . esc_attr($attributes['className']),
				$progress
			);
		}

	}
}

return new LLMS_Blocks_Course_Progress_Block();
