<?php
/**
 * Test assets
 *
 * @package LifterLMS_Blocks/Tests
 *
 * @group assets
 *
 * @since [version]
 */
class LLMS_Blocks_Test_Assets extends LLMS_Blocks_Unit_Test_Case {

	/**
	 * Deregister assets registered during tests.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	private function deregister_assets() {

		wp_deregister_script( 'llms-blocks-editor' );
		wp_deregister_style( 'llms-blocks-editor' );

	}

	/**
	 * Test the constructor
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_constructor() {

		$main = new LLMS_Blocks_Assets();

		$this->assertTrue( $main->assets instanceof LLMS_Assets );

		// Both scripts are defined.
		$this->assertTrue( $main->assets->register_script( 'llms-blocks-editor' ) );
		$this->assertTrue( $main->assets->register_style( 'llms-blocks-editor' ) );

		$this->assertEquals( 999, has_action( 'enqueue_block_editor_assets', array( $main, 'editor_assets' ) ) );

		$this->deregister_assets();

	}

	/**
	 * Test editor_assets()
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function test_editor_assets() {

		$main = new LLMS_Blocks_Assets();
		$this->deregister_assets();

		$this->assertAssetNotEnqueued( 'script', 'llms-blocks-editor' );
		$this->assertAssetNotEnqueued( 'style', 'llms-blocks-editor' );

		$main->editor_assets();

		$this->assertAssetIsEnqueued( 'script', 'llms-blocks-editor' );
		$this->assertAssetIsEnqueued( 'style', 'llms-blocks-editor' );

	}

}
