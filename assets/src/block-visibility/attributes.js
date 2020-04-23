/**
 * Add visibility attributes to all blocks
 *
 * @since 1.0.0
 * @since 1.5.1 Exits early for non LifterLMS dynamic blocks.
 * @since 1.6.0 Setup visibility support checking as a module.
 * @version 1.6.0
 */

import check from './check';

/**
 * Add visibility settings to qualifying blocks.
 *
 * Block registration filter callback.
 *
 * @since 1.0.0
 *
 * @param {object} settings Block settings object.
 * @param {string} name Block name, eg "core/paragraph".
 * @return {object}
 */
export default function visibilityAttributes( settings, name ) {

	if ( ! check( settings, name ) ) {
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

};
