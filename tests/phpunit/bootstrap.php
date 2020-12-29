<?php
/**
 * LifterLMS Add-On Testing Bootstrap
 *
 * @package LifterLMS_Blocks/Tests
 * @since   1.0.0
 * @version 1.3.3
 */

require_once './vendor/lifterlms/lifterlms-tests/bootstrap.php';

class LLMS_Blocks_Tests_Bootstrap extends LLMS_Tests_Bootstrap {

	/**
	 * __FILE__ reference, should be defined in the extending class
	 *
	 * @var [type]
	 */
	public $file = __FILE__;

	/**
	 * Name of the testing suite
	 *
	 * @var string
	 */
	public $suite_name = 'LifterLMS Blocks';

	/**
	 * Main PHP File for the plugin
	 *
	 * @var string
	 */
	public $plugin_main = 'lifterlms-blocks.php';

	/**
	 * Load the plugin
	 *
	 * @return  void
	 * @since   1.2.0
	 * @version 1.3.3
	 */
	public function load() {

		// Assets are shared between phpunit and e2e tests.
		$this->assets_dir = dirname( $this->tests_dir ) . '/assets/';

		if ( $this->plugin_main ) {
			require_once( $this->plugin_dir . '/' . $this->plugin_main );
		}

		if ( $this->use_core ) {
			define( 'LLMS_USE_PHP_SESSIONS', true );
			define( 'LLMS_PLUGIN_DIR', WP_PLUGIN_DIR . '/lifterlms/' );
			$this->load_plugin( 'lifterlms', 'lifterlms.php' );
		}

		$this->load_plugin( 'classic-editor', 'classic-editor.php' );

	}

}

global $llms_tests_bootstrap;
$llms_tests_bootstrap = new LLMS_Blocks_Tests_Bootstrap();
return $llms_tests_bootstrap;
