/**
 * Main Block editor entry point.
 *
 * @since 1.0.0
 * @since 1.5.0 Register blocks conditionally based on post type.
 * @since [version] Register form field blocks.
 */

// WP Deps.
const
	{
		getBlockTypes,
		registerBlockType,
		unregisterBlockType,
	} = wp.blocks,
	{
		subscribe,
		select,
	} = wp.data,
	{ doAction } = wp.hooks;

// Import jQuery.
import $ from 'jquery';

// Import Sidbear.
import './sidebar/'

import Components from './components';
window.llms.components = Components;

// Import Blocks.
import * as courseContinueButton from './blocks/course-continue-button/'
import * as courseInfo from './blocks/course-information/'
import * as courseProgress from './blocks/course-progress/'
import * as courseSyllabus from './blocks/course-syllabus/'
import * as instructors from './blocks/instructors/'
import * as lessonNavigation from './blocks/lesson-navigation/'
import * as lessonProgression from './blocks/lesson-progression/'
import * as pricingTable from './blocks/pricing-table/'

// Import form field blocks.
import * as formFields from './blocks/form-fields/';

// Add block visibility filters.
import './block-visibility/'

// Add block visibility filters.
import './post-visibility/'

// Add format buttons.
import './formats/merge-codes/';

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
 * @since [version] Add form field blocks.
 *
 * @return  void
 */
const registerBlocks = () => {

	const post_type = get_current_post_type();

	// Blocks to register.
	let blocks = [
		courseContinueButton,
		courseInfo,
		courseProgress,
		courseSyllabus,
		instructors,
		lessonNavigation,
		lessonProgression,
		pricingTable,
	];

	// Add "composed" form fields to the block registration list.
	Object.keys( formFields ).forEach( ( key ) => {

		if ( formFields[ key ].composed ) {
			blocks.push( formFields[ key ] );
		}

	} );

	blocks.forEach( ( block ) => {

		const {
			name,
			post_types,
			settings,
		} = block;

		if ( ! post_types || -1 !== post_types.indexOf( post_type ) ) {
			registerBlockType( name, settings );
		}

	} );
};
registerBlocks();

/**
 * Deregister all blocks no on a whitelist on the forms post type.
 *
 * @since [version]
 *
 * @return {void}
 */
const deregisterBlocksForForms = () => {

	const whitelist = [ 'core/paragraph', 'core/heading', 'core/html', 'core/column', 'core/columns', 'core/group', 'core/separator', 'core/spacer' ];

	getBlockTypes().forEach( ( { name } ) => {
		if ( -1 === whitelist.indexOf( name ) && -1 === name.indexOf( 'llms/form-field' ) ) {
			unregisterBlockType( name );
		}
	} );

};

/**
 * On editor dom ready.
 *
 * @since [version]
 *
 * @return {void}
 */
wp.domReady( () => {

	if ( 'llms_form' === get_current_post_type() ) {

		deregisterBlocksForForms();

		// Hide the "Switch to Draft" button in the header.
		let saved = true;
		subscribe( () => {

			const
				editor = select( 'core/editor' ),
				isSaving = editor.isSavingPost() || editor.isPublishingPost();

			if ( saved && ! isSaving ) {
				$( '.edit-post-layout button.editor-post-switch-to-draft' ).hide();
				saved = false;
			}

			saved = isSaving ? true : false;

		} );

	}

	// Expose the fields module.
	if ( 'llms_form' === get_current_post_type() ) {
		doAction( 'llms_form_fields_ready', formFields );
	}

} );



