/**
 * DOM Ready Events for LifterLMS Forms (llms_forms) Post Type
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const
	{ createBlock } = wp.blocks,
	{
		dispatch,
		subscribe,
		select,
	} = wp.data,
	{ doAction } = wp.hooks,
	{ __ }       = wp.i18n;

// External Deps.
import $ from 'jquery';

// Internal Deps.
import { deregisterBlocksForForms } from '../blocks/';
import * as formFields from '../blocks/form-fields/';
import { getBlocksFlat } from '../util/';

/**
 * Hides the "Switch to Draft" button in the block editor header bar.
 *
 * Because forms don't have drafts.
 *
 * @since [version]
 *
 * @return {void}
 */
const hideDraftButton = () => {

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

};

/**
 * All forms must have *at least* an email field.
 *
 * Watches editor data and if the field is removed throw an error notice.
 *
 * @since [version]
 *
 * @return {void}
 */
const ensureEmailFieldExists = () => {

	const
		emailBlockName = 'llms/form-field-user-email',
		noticeId = 'llms-forms-no-email-error-notice',
		noticeSelect = select( 'core/notices' ),
		noticeDispatch = dispatch( 'core/notices' );

	// Insert a User Email Form Field at the top of the form when the notice action is clicked.
	$( 'body' ).on( 'click', 'a[href="#llms-restore-user-email"]', ( e ) => {

		e.preventDefault();

		const blockEd = dispatch( 'core/block-editor') || dispatch( 'core/editor' );
		blockEd.insertBlock( createBlock( emailBlockName ), 0 );

		noticeDispatch.removeNotice( noticeId );

	} );

	subscribe( () => {

		// Check if a user email field exists.
		if ( -1 === getBlocksFlat().map( block => block.name ).indexOf( emailBlockName ) ) {

			// Don't add duplicate notices.
			if ( -1 === noticeSelect.getNotices().map( notice => notice.id ).indexOf( noticeId ) ) {

				noticeDispatch.createErrorNotice( __( 'User Email is a required field.', 'lifterlms' ), {
					id: noticeId,
					actions: [ {
						label: __( 'Restore user email field?', 'lifterlms' ),
						url:   '#llms-restore-user-email',
					} ]
				} );

			}

		}

	} );

};

/**
 * Default Function, runs all methods and events.
 *
 * @since [version]
 *
 * @return {void}
 */
export default () => {

	deregisterBlocksForForms();
	hideDraftButton();
	ensureEmailFieldExists();

	/**
	 * Expose all form field blocks, regardless of their registration status, for 3rd parties to utilize.
	 *
	 * @since 1.6.0
	 *
	 * @param {Array} formFields Array of form field block data objects.
	 */
	doAction( 'llms_form_fields_ready', formFields );

};
