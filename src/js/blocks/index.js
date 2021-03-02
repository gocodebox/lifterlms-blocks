/**
 * LifterLMS Block Library.
 *
 * @since 1.7.0
 * @version 1.12.0
 */

// WP Deps.
const { getBlockTypes, registerBlockType, unregisterBlockType } = wp.blocks,
	{ doAction } = wp.hooks,
	{ select } = wp.data;

// Internal Deps.
import { getCurrentPostType } from '../util/';

// Standard Blocks.
import * as courseContinueButton from './course-continue-button/';
import * as courseInfo from './course-information/';
import * as courseProgress from './course-progress/';
import * as courseSyllabus from './course-syllabus/';
import * as instructors from './instructors/';
import * as lessonNavigation from './lesson-navigation/';
import * as lessonProgression from './lesson-progression/';
import * as pricingTable from './pricing-table/';

// Form Field Blocks.
import * as formFields from './form-fields/';

/**
 * Deregister all blocks no on a safelist on the forms post type.
 *
 * @since 1.6.0
 * @since 1.7.0 Block 'llms/form-field-redeem-voucher' only available on registration forms.
 *
 * @return {void}
 */
export const deregisterBlocksForForms = () => {
	/**
	 * Determine if a block should be deregistered from form posts.
	 *
	 * @since 1.7.0
	 * @since 1.12.0 Use `safelist` in favor of `whitelist`.`
	 *
	 * @param {string} name Block name.
	 * @return {boolean}
	 */
	const shouldUnregisterBlock = ( name ) => {
		const safelist = [
				'core/paragraph',
				'core/heading',
				'core/image',
				'core/html',
				'core/column',
				'core/columns',
				'core/group',
				'core/separator',
				'core/spacer',
			],
			{ _llms_form_location } = select(
				'core/editor'
			).getCurrentPost().meta;

		// Allow safelisted blocks.
		if ( -1 !== safelist.indexOf( name ) ) {
			return false;

			// Vouchers can only be used on registration forms.
		} else if ( 0 === name.indexOf( 'llms/form-field-redeem-voucher' ) ) {
			return 'registration' === _llms_form_location ? false : true;

			// Current user password can only be used on the account edit form.
		} else if (
			0 === name.indexOf( 'llms/form-field-user-password-current' )
		) {
			return 'account' === _llms_form_location ? false : true;

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
 * @since 1.7.3 Move form ready event from domReady to here to ensure blocks are exposed before blocks are parsed.
 *
 * @return  void
 */
export default () => {
	const postType = getCurrentPostType();

	// Blocks to register.
	const blocks = [
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

	if ( 'llms_form' === postType ) {
		/**
		 * Expose all form field blocks, regardless of their registration status, for 3rd parties to utilize.
		 *
		 * @since 1.6.0
		 * @since 1.7.3 Moved from domReady to JS initialization.
		 *
		 * @param {Array} formFields Array of form field block data objects.
		 */
		doAction( 'llms_form_fields_ready', formFields );
	}

	blocks.forEach( ( block ) => {
		const { name, postTypes, settings } = block;

		if ( ! postTypes || -1 !== postTypes.indexOf( postType ) ) {
			registerBlockType( name, settings );
		}
	} );
};
