<?php

require_once './vendor/lifterlms/lifterlms-tests/bootstrap.php';

class LLMS_Blocks_Tests_Bootstrap extends LLMS_Tests_Bootstrap {

	/**
	 * __FILE__ reference, should be defined in the extending class
	 * @var [type]
	 */
	public $file = __FILE__;

	/**
	 * Name of the testing suite
	 * @var string
	 */
	public $suite_name = 'LifterLMS Blocks';

	/**
	 * Main PHP File for the plugin
	 * @var string
	 */
	public $plugin_main = 'lifterlms-blocks.php';

}
return new LLMS_Blocks_Tests_Bootstrap();
