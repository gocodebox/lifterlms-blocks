/**
 * LifterLMS Block Library.
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const
	{
		getBlockTypes,
		registerBlockType,
		unregisterBlockType,
	} = wp.blocks,
	{ select } = wp.data;

// Internal Deps.
import { getCurrentPostType } from '../util/';

// Standard Blocks.
import * as courseContinueButton from './course-continue-button/'
import * as courseInfo from './course-information/'
import * as courseProgress from './course-progress/'
import * as courseSyllabus from './course-syllabus/'
import * as instructors from './instructors/'
import * as lessonNavigation from './lesson-navigation/'
import * as lessonProgression from './lesson-progression/'
import * as pricingTable from './pricing-table/'

// Form Field Blocks.
import * as formFields from './form-fields/';

/**
 * Deregister all blocks no on a whitelist on the forms post type.
 *
 * @since 1.6.0
 * @since [version] Block 'llms/form-field-redeem-voucher' only available on registration forms.
 *
 * @return {void}
 */
export const deregisterBlocksForForms = () => {

	/**
	 * Determine if a block should be deregistered from form posts.
	 *
	 * @since [version]
	 *
	 * @param {String} name Block name.
	 * @return {Boolean}
	 */
	const shouldUnregisterBlock = ( name ) => {

		const whitelist = [ 'core/paragraph', 'core/heading', 'core/html', 'core/column', 'core/columns', 'core/group', 'core/separator', 'core/spacer' ];

		// Allow whitelisted blocks.
		if ( -1 !== whitelist.indexOf( name ) ) {
			return false;

			// Vouchers can only be used on registration forms.
		} else if ( 0 === name.indexOf( 'llms/form-field-redeem-voucher' ) ) {

			const { _llms_form_location } = select( 'core/editor' ).getCurrentPost().meta;
			return 'registration' === _llms_form_location ? false : true;

			// Allow all other form field blocks.
		} else if ( -1 !== name.indexOf( 'llms/form-field' ) ) {
			return false;
		}

		// unregister everything else.
		return true;

	};

	getBlockTypes().forEach( ( { name } ) => {
		if ( shouldUnregisterBlock( name ) ) {
			unregisterBlockType( name );
		}
	} );

};

/**
 * Register LifterLMS Core Blocks
 *
 * @since 1.0.0
 * @since 1.5.0 Only register blocks for supported post types.
 * @since 1.6.0 Add form field blocks.
 *
 * @return  void
 */
export default () => {

	const post_type = getCurrentPostType();

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
