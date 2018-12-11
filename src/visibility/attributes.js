/**
 * Add visibility attributes to all blocks
 *
 * @since    1.0.0
 * @version  1.0.0
 */
export default function visibilityAttributes( settings, name ) {

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
