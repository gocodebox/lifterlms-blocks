const { Fragment } = wp.element
const { Slot } = wp.components;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

import Instructors from './instructors'
import LifterLMSIcon from '../icons/lifterlms-icon'

const sidebar = () => {
	if ( -1 !== [ 'course', 'llms_membership' ].indexOf( wp.data.select( 'core/editor' ).getCurrentPostType() ) ) {
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
	render: sidebar,
	icon: <LifterLMSIcon />
} )
