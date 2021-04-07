<?php
/**
 * File Summary
 *
 * File description.
 *
 * @package LifterLMS/Classes
 *
 * @since [version]
 * @version [version]
 */

defined( 'ABSPATH' ) || exit;

class LLMS_Blocks_Field_Patterns {

	public function __construct() {

		add_action( 'init', array( $this, 'register' ) );

	}

	public function get() {

		$patterns = array(
			array(
				'lifterlms/fields/user-email',
				array(
					'categories'  => array( 'lifterlms/fields' ),
					'title'       => __( 'User Email with Confirmation', 'lifterlms' ),
					'description' => _x( 'Side by side user email input with a matching confirmation field.', 'Block pattern description', 'lifterlms' ),
					'content'     => '<!-- wp:columns -->
	<div class="wp-block-columns"><!-- wp:column {"width":50} -->
	<div class="wp-block-column" style="flex-basis:50%"><!-- wp:llms/form-field-user-email /--></div>
	<!-- /wp:column -->

	<!-- wp:column {"width":50} -->
	<div class="wp-block-column" style="flex-basis:50%"><!-- wp:llms/form-field-user-email-confirm /--></div>
	<!-- /wp:column --></div>
	<!-- /wp:columns -->',
				),
			),
		);

		return $patterns;

	}

	public function register() {

		register_block_pattern_category(
			'lifterlms/fields',
			array( 'label' => __( 'LifterLMS Form Fields', 'my-plugin' ) )
		);

		foreach ( $this->get() as $pattern ) {
			register_block_pattern( ...$pattern );
		}

	}


}

return new LLMS_Blocks_Field_Patterns();
