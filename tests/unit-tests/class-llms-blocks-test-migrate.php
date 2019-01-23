<?php
/**
 * Test LLMS_Blocks_Migrate class & methods.
 *
 * @package LifterLMS_Blocks/Tests
 * @since   1.3.1
 * @version [version]
 */
class LLMS_Blocks_Test_Migrate extends LLMS_Blocks_Unit_Test_Case {

	/**
	 * Test the check_sales_page() method
	 *
	 * @return  void
	 * @since   1.3.1
	 * @version 1.3.1
	 */
	public function test_check_sales_page() {

		$post_id = $this->factory->post->create( array( 'post_type' => 'course' ) );
		$this->go_to( get_permalink( $post_id ) );

		// Post migrated & no sales page is not setup (legacy active).
		$this->assertFalse( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

		// Migrated & sales page explicitly on.
		update_post_meta( $post_id, '_llms_sales_page_content_type', 'content' );
		$this->assertFalse( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

		// No sales page
		update_post_meta( $post_id, '_llms_sales_page_content_type', 'none' );
		$this->assertTrue( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

		delete_post_meta( $post_id, '_llms_sales_page_content_type' );

		// Not restricted content.
		$student = $this->factory->student->create_and_get();
		$student->enroll( $post_id );
		wp_set_current_user( $student->get_id() );

		// Post migrated & no sales page is not setup (legacy active).
		$this->assertTrue( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

		// Migrated & sales page explicitly on.
		update_post_meta( $post_id, '_llms_sales_page_content_type', 'content' );
		$this->assertTrue( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

		// No sales page
		update_post_meta( $post_id, '_llms_sales_page_content_type', 'none' );
		$this->assertTrue( LLMS_Blocks_Migrate::check_sales_page( true, $post_id ) );

	}

	/**
	 * Test get_migrateable_post_types() method
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function test_get_migrateable_post_types() {

		$class = new LLMS_Blocks_Migrate();
		$this->assertEquals( array( 'course', 'lesson' ), $class->get_migrateable_post_types() );

	}

	/**
	 * Test should_migrate_post() method
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function test_should_migrate_post() {

		$class = new LLMS_Blocks_Migrate();
		$this->update_classic_settings( array( 'editor' => 'block', 'allow-users' => false ) );

		// test various post types
		$types = array(
			'post' => false,
			'page' => false,
			'course' => true,
			'lesson' => true,
			'llms_membership' => false,
		);
		foreach ( $types as $type => $expect ) {

			$id = $this->factory->post->create( array( 'post_type' => $type ) );
			$this->assertEquals( $expect, $class->should_migrate_post( $id ) );

		}

		$id = $this->factory->post->create( array( 'post_type' => 'course' ) );

		// Classic ed enabled, don't migrate.
		$this->update_classic_settings( array( 'editor' => 'classic', 'allow-users' => false ) );
		$this->assertFalse( $class->should_migrate_post( $id ) );

		// Block enabled, go.
		$this->update_classic_settings( array( 'editor' => 'block', 'allow-users' => false ) );
		$this->assertTrue( $class->should_migrate_post( $id ) );

		// already migrated
		update_post_meta( $id, '_llms_blocks_migrated', 'yes' );
		$this->assertFalse( $class->should_migrate_post( $id ) );

	}

}
