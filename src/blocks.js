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
 * @since   1.0.0
 * @version 1.0.0
 */

const { registerBlockType } = wp.blocks;

// Import Sidbear.
import './sidebar/'

// Import Blocks.
import * as courseContinueButton from './blocks/course-continue-button/'
import * as courseInfo from './blocks/course-information/'
import * as courseProgress from './blocks/course-progress/'
import * as courseSyllabus from './blocks/course-syllabus/'
import * as instructors from './blocks/instructors/'
import * as lessonNavigation from './blocks/lesson-navigation/'
import * as lessonProgression from './blocks/lesson-progression/'
import * as pricingTable from './blocks/pricing-table/'

// Add visibility filters.
import './visibility/'

/**
 * Register LifterLMS Core Blocks
 * @return  void
 * @since   1.0.0
 * @version 1.0.0
 */
const registerBlocks = () => {
	[
		courseContinueButton,
		courseInfo,
		courseProgress,
		courseSyllabus,
		instructors,
		lessonNavigation,
		lessonProgression,
		pricingTable,
	].forEach( ( block ) => {

		const {
			name,
			settings,
		} = block;

		registerBlockType( name, settings );

	} )
}
registerBlocks();


