/**
 * Add visibility attributes to all blocks
 *
 * @since 1.0.0
 * @since [version] Exits early for non LifterLMS dynamic blocks.
 */
export default function visibilityAttributes( settings, name ) {

	if ( -1 !== window.llms.dynamic_blocks.indexOf( name ) ) {
		return settings;
	}

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
