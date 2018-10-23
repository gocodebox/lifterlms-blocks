<?php
/**
 * LifterLMS Blocks Plugin
 *
 * @package LifterLMS_Blocks/Main
 *
 * @wordpress-plugin
 * Plugin Name: LifterLMS Blocks
 * Plugin URI: https://github.com/gocodebox/lifterlms-blocks
 * Description: WordPress Editor (Gutenberg) blocks for LifterLMS.
 * Version: 0.0.1
 * Author: LifterLMS
 * Author URI: https://lifterlms.com/
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Requires at least: 4.9.9
 * Tested up to: 4.9.9
 */

// Restrict Direct Access.
defined( 'ABSPATH' ) || exit;

// Define Constants.
if ( ! defined( 'LLMS_BLOCKS_VERSION' ) ) {
	define( 'LLMS_BLOCKS_VERSION', '0.0.1' );
}

// Initialize Assets.
require_once plugin_dir_path( __FILE__ ) . 'src/class-llms-blocks-assets.php';
require_once plugin_dir_path( __FILE__ ) . 'src/class-llms-blocks-templates.php';
