import {
	clickAndWait,
	dismissEditorWelcomeGuide,
} from '@lifterlms/llms-e2e-test-utils';

import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Visit the block editor for a requested form
 *
 * @since [version]
 *
 * @param {String|Number} form The title or WP_Post ID of a form.
 * @return {void}
 */
export default async ( form = 'Register' ) => {

	let
		page = 'edit.php',
		qs   = 'post_type=llms_form';

	// If form is a WP_Post ID go right to the form.
	if ( ! isNaN( Number( form ) ) ) {
		await visitAdminPage( 'post.php', `post=${ form }&action=edit` );
	// Otherwise look it up from the post table by title
	} else {
		await visitAdminPage( 'edit.php', `s=${ form }&post_type=llms_form` );
		await clickAndWait( '#the-list tr:first-child a.row-title' );
	}

	await dismissEditorWelcomeGuide();

};
