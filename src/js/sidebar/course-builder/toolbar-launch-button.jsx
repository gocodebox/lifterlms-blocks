/**
 * Tooblar launch button.
 *
 * @since 2.5.0
 * @version 2.5.1
 */

import { select, subscribe } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const buttonId = 'llms-launch-course-builder-top-button';

/**
 * Toolbar launch button component.
 *
 * @since 2.5.0
 * @since 2.5.1 Fix button link using localized admin url so to avoid issues when
 *               WordPress is installed in a subdirectory.
 */
export const addToolbarLaunchButton = () => {
	let hasUnsavedChanges = false;
	const editPostHeaderToolbarLeft = document.getElementsByClassName(
		'edit-post-header-toolbar__left'
	)[ 0 ];

	if ( ! editPostHeaderToolbarLeft ) {
		return;
	}

	const courseId = window?.llmsBlocks?.courseId ?? select( 'core/editor' )?.getCurrentPostId() ?? 0;

	setTimeout( () => {
		const existingButton = document.getElementById( buttonId );

		if ( existingButton ) {
			return;
		}

		const button = document.createElement( 'a' );

		button.id = buttonId;
		button.href = window.llms.admin_url + 'admin.php?page=llms-course-builder&course_id=' + courseId;
		button.className = 'llms-button-primary';
		button.style.marginLeft = '16px';
		button.innerHTML = __( 'Launch Course Builder', 'lifterlms' );
		button.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			console.log('Element clicked!');
			console.log('hasUnsaved: ', hasUnsavedChanges);
		} );

		editPostHeaderToolbarLeft.appendChild( button );
	}, 1 );

	subscribe(() => {
		const postEdits = select('core/editor').getPostEdits();

		if (Object.keys(postEdits).length) {
			hasUnsavedChanges = true;
		} else {
			hasUnsavedChanges = false;
		}
	});
};

