<?php
/**
 * Test LLMS_Blocks_Page_Builders class & methods.
 *
 * @package LifterLMS_Blocks/Tests
 * @since   1.3.0
 * @version [version]
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

		// Classic Editor Enabled.
		update_post_meta( $post_id, 'classic-editor-remember', 'classic-editor' );
		$this->assertTrue( llms_blocks_is_classic_enabled_for_post( $post_id ) );

	}

	/**
	 * Test the llms_blocks_is_post_migrated() method
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function test_llms_blocks_is_post_migrated() {

		// Post to test against.
		$post_id = $this->factory->post->create();

		// No postemta.
		$this->assertFalse( llms_blocks_is_post_migrated( $post_id ) );

		// Postmeta Explicitly on.
		update_post_meta( $post_id, '_llms_blocks_migrated', 'yes' );
		$this->assertTrue( llms_blocks_is_post_migrated( $post_id ) );

		// Postmeta Explicitly off.
		update_post_meta( $post_id, '_llms_blocks_migrated', 'no' );
		$this->assertFalse( llms_blocks_is_post_migrated( $post_id ) );

		// Add the classic editor.
		$classic = $this->getMockBuilder( 'Classic_Editor' )->getMock();

		// Block editor enabled & not migrated.
		update_post_meta( $post_id, 'classic-editor-remember', 'block-editor' );
		$this->assertFalse( llms_blocks_is_post_migrated( $post_id ) );

		// Block editor enabled & migrated.
		update_post_meta( $post_id, '_llms_blocks_migrated', 'yes' );
		$this->assertTrue( llms_blocks_is_post_migrated( $post_id ) );

		// Classic Editor Enabled & migrated.
		update_post_meta( $post_id, 'classic-editor-remember', 'classic-editor' );
		$this->assertFalse( llms_blocks_is_post_migrated( $post_id ) );

		// Classic Editor enabled & not migrated.
		update_post_meta( $post_id, '_llms_blocks_migrated', 'no' );
		$this->assertFalse( llms_blocks_is_post_migrated( $post_id ) );

	}


}
