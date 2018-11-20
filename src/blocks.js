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

const { registerBlockType } = wp.blocks;

// Import Blocks.
import * as information from './blocks/course-information/'
import * as progress from './blocks/course-progress/'

// Add visibility filters.
import './visibility/'

/**
 * Register LifterLMS Core Blocks
 * @return  void
 * @since   [version]
 * @version [version]
 */
const registerBlocks = () => {
	[
		information,
		progress,
	].forEach( ( block ) => {

		const {
			name,
			settings,
		} = block;

		registerBlockType( name, settings );

	} )
}
registerBlocks();


