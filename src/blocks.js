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
 * @since 1.0.0
 * @since 1.5.0 Register blocks conditionally based on post type.
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

// Add block visibility filters.
import './block-visibility/'

// Add block visibility filters.
import './post-visibility/'

/**
 * Retrieve the current post type from LifterLMS script data.
 *
 * @since 1.5.0
 *
 * @return string|false
 */
const get_current_post_type = () => {

	if ( window.llms && window.llms.post && window.llms.post.post_type ) {
		return window.llms.post.post_type;
	}

	return false;
}

/**
 * Register LifterLMS Core Blocks
 *
 * @since 1.0.0
 * @since 1.5.0 Only register blocks for supported post types.
 *
 * @return  void
 */
const registerBlocks = () => {

	const post_type = get_current_post_type();

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
			post_types,
			settings,
		} = block;

		if ( ! post_types || -1 !== post_types.indexOf( post_type ) ) {
			registerBlockType( name, settings );
		}

	} );
}
registerBlocks();
