import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { Button } from '@wordpress/components';

import './editor.scss';

const SidebarLaunchButton = () => {
	const postType = select( 'core/editor' )?.getCurrentPostType() ?? '';

	if ( ! [ 'course', 'lesson' ].includes( postType ) ) {
		return null;
	}

	const courseId = window?.llmsBlocks?.courseId ?? select( 'core/editor' )?.getCurrentPostId() ?? 0;

	return <PluginPostStatusInfo
		className={ 'llms-launch-course-builder' }
	>
		<Button
			href={ '/wp-admin/admin.php?page=llms-course-builder&course_id=' + courseId }
			className={ 'llms-button-primary' }
		>
			{ __( 'Launch Course Builder', 'lifterlms' ) }
		</Button>
	</PluginPostStatusInfo>;
};

registerPlugin( 'post-status-info-test', {
	render: SidebarLaunchButton,
} );
