<?php
/**
 * Test LLMS_Blocks_Page_Builders class & methods.
 *
 * @package LifterLMS_Blocks/Tests
 * @since   1.3.0
 * @version 1.3.0
 */
class LLMS_Blocks_Test_Functions extends LLMS_Blocks_Unit_Test_Case {

	/**
	 * Test the classic editor enabled check function.
	 *
	 * @return  void
	 * @since   1.3.0
	 * @version 1.3.0
	 */
	public function test_llms_blocks_is_classic_enabled_for_post() {

		$post_id = $this->factory->post->create();

		// Classic editor isn't active.
		$this->assertFalse( llms_blocks_is_classic_enabled_for_post( $post_id ) );

		// Mock the Classic_Editor class
		$classic = $this->getMockBuilder( 'Classic_Editor' )->getMock();

		// No postmeta.
		$this->assertFalse( llms_blocks_is_classic_enabled_for_post( $post_id ) );

		// Wrong postmeta.
		update_post_meta( $post_id, 'classic-editor-remember', 'fake' );
		$this->assertFalse( llms_blocks_is_classic_enabled_for_post( $post_id ) );

		// Block editor enabled.
		update_post_meta( $post_id, 'classic-editor-remember', 'block-editor' );
		$this->assertFalse( llms_blocks_is_classic_enabled_for_post( $post_id ) );

		update_post_meta( $post_id, 'classic-editor-remember', 'classic-editor' );
		$this->assertTrue( llms_blocks_is_classic_enabled_for_post( $post_id ) );

	}


}
