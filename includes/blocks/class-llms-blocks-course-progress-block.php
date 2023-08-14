<?php
/**
 * Course progress bar block
 *
 * @package LifterLMS_Blocks/Blocks
 *
 * @since 1.9.0
 * @version 1.9.0
 * @deprecated [version]
 *
 * @render_hook llms_course-progress_block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Course progress block class.
 *
 * @since Unknown
 * @deprecated [version]
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
	 * @since 1.9.0
	 * @deprecated [version]
	 *
	 * @param array  $attributes Optional. Block attributes. Default empty array.
	 * @param string $content    Optional. Block content. Default empty string.
	 * @return void
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {
		llms_deprecated_function( __METHOD__, '[version]' );

		add_action( $this->get_render_hook(), array( $this, 'output' ), 10 );

	}

	/**
	 * Output the course progress bar
	 *
	 * @since 1.9.0
	 * @deprecated [version]
	 *
	 * @param array $attributes Optional. Block attributes. Default empty array.
	 * @return void
	 */
	public function output( $attributes = array() ) {
		llms_deprecated_function( __METHOD__, '[version]' );

		$block_content = '';
		$progress      = do_shortcode( '[lifterlms_course_progress check_enrollment=1]' );
		$class         = empty( $attributes['className'] ) ? '' : $attributes['className'];

		if ( $progress ) {
			$block_content = sprintf(
				'<div class="wp-block-%1$s-%2$s%3$s">%4$s</div>',
				$this->vendor,
				$this->id,
				// Take into account the custom class attribute.
				empty( $attributes['className'] ) ? '' : ' ' . esc_attr( $attributes['className'] ),
				$progress
			);
		}

		/**
		 * Filters the block html
		 *
		 * @since 1.9.0
		 * @deprecated [version]
		 *
		 * @param string $block_content The block's html.
		 * @param array  $attributes    The block's array of attributes.
		 * @param self   $block         This block object.
		 */
		$block_content = apply_filters_deprecated(
			'llms_blocks_render_course_progress_block',
			array( $block_content, $attributes, $this ),
			'[version]',
			'render_block_llms/course-progress'
		);

		if ( $block_content ) {
			echo $block_content;
		}

	}

	/**
	 * Retrieve the ID/Name of the block.
	 *
	 * @return  string
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function get_block_id() {
		llms_deprecated_function( __METHOD__, '[version]' );

		return sprintf( '%1$s/%2$s', $this->vendor, $this->id );
	}

	/**
	 * Output a message when no HTML was rendered
	 *
	 * @since 1.0.0
	 * @since 1.8.0 Don't output empty render messages on the frontend.
	 *
	 * @return  string
	 */
	public function get_empty_render_message() {
		llms_deprecated_function( __METHOD__, '[version]' );

		if ( ! is_admin() ) {
			return '';
		}
		return __( 'No HTML was returned.', 'lifterlms' );
	}

	/**
	 * Retrieve a string which can be used to render the block.
	 *
	 * @return  string
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function get_render_hook() {
		llms_deprecated_function( __METHOD__, '[version]' );

		return sprintf( '%1$s_%2$s_block_render', $this->vendor, $this->id );
	}

	/**
	 * Removed hooks stub.
	 * Extending classes can use this class to remove hooks attached to the render function action.
	 *
	 * @return  void
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function remove_hooks() {
		llms_deprecated_function( __METHOD__, '[version]' );
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @param   array  $attributes Optional. Block attributes. Default empty array.
	 * @param   string $content    Optional. Block content. Default empty string.
	 * @return  string
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function render_callback( $attributes = array(), $content = '' ) {
		llms_deprecated_function( __METHOD__, '[version]' );

		$this->add_hooks( $attributes, $content );

		ob_start();
		do_action( $this->get_render_hook(), $attributes, $content );
		$ret = ob_get_clean();

		$this->remove_hooks();

		if ( ! $ret ) {
			$ret = $this->get_empty_render_message();
		}

		return $ret;

	}

	/**
	 * Register meta attributes stub.
	 *
	 * Called after registering the block type.
	 *
	 * @return  void
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function register_meta() {
		llms_deprecated_function( __METHOD__, '[version]' );
	}
}
