/**
 * Editor Sidebar Plugins
 *
 * @since 1.0.0
 * @version 1.6.0
 */

// WP Deps.
import { Slot } from '@wordpress/components';
import { select } from '@wordpress/data';
import {
	PluginSidebar,
	PluginSidebarMoreMenuItem,
} from '@wordpress/edit-post';
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';

// Internal Deps.
import Instructors from './instructors';
import FormDocumentSettings from './form-document-settings';
import LifterLMSIcon from '../icons/lifterlms-icon';

/**
 * Registers the sidebar plugin for Courses and Memberships
 *
 * @since 1.0.0
 *
 * @return {?Fragment}
 */
const Sidebar = () => {
	if ( -1 !== [ 'course', 'llms_membership' ].indexOf( select( 'core/editor' ).getCurrentPostType() ) ) {
		return (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="llms-sidebar"
					icon={ <LifterLMSIcon /> }
				>
					LifterLMS
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="llms-sidebar"
					title="LifterLMS"
				>
					<Instructors />
				</PluginSidebar>
			</Fragment>
		)
	}
	return null;
}
registerPlugin( 'llms', {
	render: Sidebar,
	icon: <LifterLMSIcon />
} )

/**
 * Register the forms post type document settings sidebar plugin.
 *
 * @since 1.6.0
 */
registerPlugin( 'llms-forms-doc-settings',  {
	render: FormDocumentSettings,
	icon: '',
} );
