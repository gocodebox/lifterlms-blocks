/**
 * DOM Ready Events for LifterLMS Forms (llms_forms) Post Type
 *
 * @since 1.7.0
 * @version 1.12.0
 */

// WP Deps.
import { createBlock } from '@wordpress/blocks';
import { dispatch, subscribe, select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import { deregisterBlocksForForms } from '../blocks/';
import * as formFields from '../blocks/form-fields/';
import { getBlocksFlat } from '../util/';

/**
 * Hides WP Core UI elements that we cannot disable with filters or proper APIs
 *
 * + Disables the "Draft" button / UI, we never want our forms to be "drafts".
 * + Disables the "Status & Visibility" sidebar, we don't want to make our forms private, password
 *   protected, or published in the future.
 *
 * @since 1.12.0
 *
 * @return {void}
 */
function hideCoreUI() {
	const saved = true;
	subscribe( () => {
		setTimeout( () => {
			const els = document.querySelectorAll(
				'.edit-post-layout button.editor-post-switch-to-draft, .edit-post-layout .components-panel__body.edit-post-post-status'
			);
			els.forEach( ( el ) => {
				el.style.display = 'none';
			} );
		}, 1 );
	} );
}

/**
 * Disable visibility settings when viewing registration and account forms.
 *
 * @since 1.12.0
 *
 * @return {void}
 */
function maybeDisableVisibility() {
	const { _llms_form_location } = select(
		'core/editor'
	).getEditedPostAttribute( 'meta' );

	if ( [ 'registration', 'account' ].includes( _llms_form_location ) ) {
		addFilter(
			'llms_block_supports_visibility',
			'llms/form-block-visibility',
			() => {
				return false;
			}
		);
	}
}

/**
 * All forms must have *at least* an email field.
 *
 * Watches editor data and if the field is removed throw an error notice.
 *
 * @since 1.7.0
 * @since 1.12.0 Wait for the editor to be fully initialized before dispatching a notice.
 *
 * @return {void}
 */
function ensureEmailFieldExists() {
	const emailBlockName = 'llms/form-field-user-email',
		noticeId = 'llms-forms-no-email-error-notice',
		noticeSelect = select( 'core/notices' ),
		noticeDispatch = dispatch( 'core/notices' );

	subscribe( () => {
		const post = select( 'core/editor' ).getCurrentPost(),
			blocks = getBlocksFlat().map( ( block ) => block.name ),
			/**
			 * The block editor appears to call domReady() prior to the block editor data being set
			 * which results in getBlocksFlat() to respond with an empty array even though there are blocks
			 * in the post content.
			 *
			 * To combat this we can determine that the editor "is ready" when there is either at least a single
			 * block in the blocks array or the post content *does not* include a block comment string.
			 *
			 * If the post content doesn't include any block comment string then the empty array is not an
			 * incorrect result.
			 */
			isReady = blocks.length || ! post.content.includes( '<!-- wp:' ),
			updateBtn = document.querySelector(
				'button.editor-post-publish-button'
			);

		// Check if a user email field exists.
		if ( isReady && ! blocks.includes( emailBlockName ) ) {
			// Don't add duplicate notices.
			if (
				! noticeSelect
					.getNotices()
					.map( ( notice ) => notice.id )
					.includes( noticeId )
			) {
				noticeDispatch.createErrorNotice(
					__( 'User Email is a required field.', 'lifterlms' ),
					{
						id: noticeId,
						isDismissible: false,
						actions: [
							{
								label: __(
									'Restore user email field?',
									'lifterlms'
								),

								/**
								 * Restore the field, remove the notice, and re-enable the post update button.
								 *
								 * Inserts the user email field as the first block in the form.
								 *
								 * @since 1.12.0
								 *
								 * @return {void}
								 */
								onClick: () => {
									// Add the field.
									const blockEd =
										dispatch( 'core/block-editor' ) ||
										dispatch( 'core/editor' );
									blockEd.insertBlock(
										createBlock( emailBlockName ),
										0
									);

									// Remove the notice.
									noticeDispatch.removeNotice( noticeId );

									// Re-enable updating.
									updateBtn.disabled = false;
								},
							},
						],
					}
				);

				// Disable the "Update" button so the form cannot be saved in a messed up state.
				updateBtn.disabled = true;
			}
		}
	} );
}

/**
 * Default Function, runs all methods and events.
 *
 * @since 1.7.0
 * @since 1.7.1 Disable block visibility on registration & account forms to prevent a potentially confusing form creation experience.
 * @since 1.7.3 Move forms ready event to block registration file to ensure blocks are registered during editor init.
 * @since 1.12.0 Move UI disabling functionality into it's own function.
 *
 * @return {void}
 */
export default () => {
	maybeDisableVisibility();
	deregisterBlocksForForms();
	hideCoreUI();
	ensureEmailFieldExists();
};
