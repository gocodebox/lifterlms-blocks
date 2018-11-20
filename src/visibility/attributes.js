/**
 * Add visibility attributes to all blocks
 *
 * @since    [version]
 * @version  [version]
 */

const visibilityAttributes = ( settings, name ) => {

	if ( ! settings.attributes ) {
		settings.attributes = {};
	}

	settings.attributes.llms_visibility = {
		default: 'all',
		type: 'string',
	}
	settings.attributes.llms_visibility_in = {
		default: '',
		type: 'string',
	}
	settings.attributes.llms_visibility_posts = {
		type: 'string',
		default: '[]',
	}

	return settings

}

wp.hooks.addFilter( 'blocks.registerBlockType', 'llms/visibility-attributes', visibilityAttributes );
