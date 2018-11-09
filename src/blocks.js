/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 *
 * @since   [version]
 * @version [version]
 */

// https://wordpress.org/gutenberg/handbook/extensibility/extending-blocks/
// wp.hooks.addFilter( 'blocks.registerBlockType', 'arstarst', function( settings, name ) {
// 	console.log( name, settings );
// 	return settings;
// } )

import './course-information/'
import './course-progress/'

