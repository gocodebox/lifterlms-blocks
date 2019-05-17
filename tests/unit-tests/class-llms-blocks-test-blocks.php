<?php
/**
 * Test main plugin file.
 *
 * @package  LifterLMS_Blocks/Tests
 *
 * @since [version]
 * @version [version]
 */
class LLMS_Blocks_Test_Blocks extends LLMS_Blocks_Unit_Test_Case {

	/**
	 * Test the add_block_category() method
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_add_block_category() {

		$obj = new LLMS_Blocks();

		$our_cat = array(
			'slug'  => 'llms-blocks',
			'title' => 'LifterLMS Blocks',
		);

		$existing = array(
			'slug'  => 'fake-cat-slug',
			'title' => 'Fake Cat Title',
		);

		$this->assertSame( array( $our_cat ), $obj->add_block_category( array() ) );
		$this->assertSame( array( $existing, $our_cat ), $obj->add_block_category( array( $existing ) ) );

	}

	/**
	 * Ensure the WP core method get_block_categories() results in the `llms-blocks` category being added.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_add_block_category_integration() {

		$slugs = wp_list_pluck( get_block_categories( $this->factory->post->create_and_get() ), 'slug' );
		$this->assertTrue( in_array( 'llms-blocks', $slugs, true ) );

	}

	/**
	 * Test the admin_print_scripts() method.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_admin_print_scripts() {

		$obj = new LLMS_Blocks();

		// no current screen.
		$this->assertOutputEmpty( array( $obj, 'admin_print_scripts' ) );

		// Don't Display.
		foreach ( array( 'dashboard', 'options-general', 'tools', 'users-new', 'plugin-editor', 'edit-page' ) as $screen ) {
			set_current_screen( $screen );
			$this->assertOutputEmpty( array( $obj, 'admin_print_scripts' ) );
		}

		// Display
		foreach ( array( 'post', 'page', 'course', 'llms_membership' ) as $screen ) {
			set_current_screen( $screen );
			$this->assertOutputContains( '<script>window.llms.dynamic_blocks', array( $obj, 'admin_print_scripts' ) );
		}

	}

	/**
	 * Test the get_dynamic_block_names() method.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_get_dynamic_block_names() {

		$obj = new LLMS_Blocks();

		$res = LLMS_Unit_Test_Util::call_method( $obj, 'get_dynamic_block_names' );

		$this->assertTrue( in_array( 'core/archives', $res, true ) );
		$this->assertTrue( in_array( 'core/search', $res, true ) );
		$this->assertFalse( in_array( 'llms/course-information', $res, true ) );
		$this->assertFalse( in_array( 'llms/pricing-table', $res, true ) );

	}

}
