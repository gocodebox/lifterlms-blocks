/**
 * Babel config
 *
 * @package LifterLMS_Blocks/Scripts/Dev
 *
 * @since 1.8.0
 * @version 1.8.0
 */

const
	presets = [ "@wordpress/default" ],
	plugins = [ "@babel/plugin-proposal-class-properties" ];

module.exports = { plugins, presets };
