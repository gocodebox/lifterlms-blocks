<?php
/**
 * Course pricing table block
 *
 * @package LifterLMS_Blocks/Blocks
 *
 * @since 1.0.0
 * @version 1.9.0
 * @deprecated [version]
 *
 * @render_hook llms_pricing-table-block_render
 */

defined( 'ABSPATH' ) || exit;

/**
 * Pricing Table block class.
 *
 * @since 1.0.0
 * @since 1.3.7 Unknown.
 * @since 1.9.0 Added `llms_blocks_render_pricing_table_block` filter.
 * @deprecated [version]
 */
class LLMS_Blocks_Pricing_Table_Block extends LLMS_Blocks_Abstract_Block {

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = 'pricing-table';

	/**
	 * Is block dynamic (rendered in PHP).
	 *
	 * @var bool
	 */
	protected $is_dynamic = true;

	/**
	 * Add actions attached to the render function action.
	 *
	 * @since 1.0.0
	 * @since 1.1.0 Unknown.
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
	 * Retrieve custom block attributes
	 *
	 * Necessary to override when creating ServerSideRender blocks.
	 *
	 * @since 1.0.0
	 * @since 1.3.6 Unknown.
	 * @deprecated [version]
	 *
	 * @return array
	 */
	public function get_attributes() {
		llms_deprecated_function( __METHOD__, '[version]' );

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

	/**
	 * Output the pricing table.
	 *
	 * @since 1.0.0
	 * @since 1.3.7 Unknown.
	 * @since 1.9.0 Added `llms_blocks_render_pricing_table_block` filter.
	 * @deprecated [version]
	 *
	 * @param array $attributes Optional. Block attributes. Default empty array.
	 * @return void
	 */
	public function output( $attributes = array() ) {
		llms_deprecated_function( __METHOD__, '[version]' );

		ob_start();
		if ( 'edit' === filter_input( INPUT_GET, 'context' ) ) {
			$id = filter_input( INPUT_GET, 'post_id', FILTER_SANITIZE_NUMBER_INT );
			if ( $id ) {
				$product = new LLMS_Product( $id );
				if ( ! $product->get_access_plans() ) {
					echo '<p>' . __( 'No access plans found.', 'lifterlms' ) . '</p>';
				}
			}

			// Force display of the table on the admin panel.
			add_filter( 'llms_product_pricing_table_enrollment_status', '__return_false' );
			add_filter( 'llms_product_is_purchasable', '__return_true' );

		}

		lifterlms_template_pricing_table( $attributes['post_id'] );

		$block_content = ob_get_clean();

		/**
		 * Filters the block html.
		 *
		 * @since 1.9.0
		 * @deprecated [version]
		 *
		 * @param string $block_content The block's html.
		 * @param array  $attributes    The block's array of attributes.
		 * @param self   $block         This block object.
		 */
		$block_content = apply_filters_deprecated(
			'llms_blocks_pricing_table_block_render',
			array( $block_content, $attributes, $this ),
			'[version]',
			'render_block_llms/pricing-table'
		);

		remove_filter( 'llms_product_pricing_table_enrollment_status', '__return_false' );
		remove_filter( 'llms_product_is_purchasable', '__return_true' );

		if ( $block_content ) {
			echo $block_content;
		}

	}
}
