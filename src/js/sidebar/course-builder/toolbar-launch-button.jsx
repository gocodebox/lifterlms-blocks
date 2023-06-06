import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const buttonId = 'llms-launch-course-builder-top-button';

export const addToolbarLaunchButton = () => {
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
		button.href = '/wp-admin/admin.php?page=llms-course-builder&course_id=' + courseId;
		button.className = 'llms-button-primary';
		button.style.marginLeft = '16px';
		button.innerHTML = __( 'Launch Course Builder', 'lifterlms' );

		editPostHeaderToolbarLeft.appendChild( button );
	}, 1 );
};

