const { Fragment } = wp.element
const { Slot } = wp.components;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

import Instructors from './instructors'
import LogomarkIcon from '../icons/logomark'


const MyPlugin = ( wut ) => {
	return (
		<PluginSidebar>
			Wutarst
		</PluginSidebar>
	);
};


// const { PluginPostStatusInfo } = wp.editPost;
// const MyPlugin = () => {
// 	return (
// 		<PluginPostStatusInfo>
// 			Wut
// 		</PluginPostStatusInfo>
// 	);
// };

const sidebar = ( wut ) => {
	const currentPost = wp.data.select( 'core/editor' ).getCurrentPost()
	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				target="llms-sidebar"
				icon={ <LogomarkIcon /> }
			>
				LifterLMS
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name="llms-sidebar"
				title="LifterLMS"
			>
				<Instructors
					currentPost={ currentPost }
					/>
			</PluginSidebar>
		</Fragment>
	)
}



registerPlugin( 'llms', {
	render: sidebar,
	icon: <LogomarkIcon />
} )

// wp.hooks.addFilter( 'plugins.registerPlugin', 'llms/modify-sidebar', ( settings, name ) => {
	// console.log( name, settings );
	// return settings
// } );
