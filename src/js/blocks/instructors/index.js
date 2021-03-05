/**
 * BLOCK: llms/instructors
 *
 * Renders instructor list
 *
 * @since 1.0.0
 * @since 1.5.0 Add supported post type settings.
 * @since 1.11.0 Add membership to supported post types settings.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// Internal Deps.
import edit from './edit';
import './editor.scss';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/instructors';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = [ 'course', 'llms_membership' ];

/**
 * Register Block.
 *
 * @since 1.0.0
 *
 * @type {Object}
 */
export const settings = {
	title: __( 'Instructors', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'groups',
	},
	category: 'llms-blocks',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
		__( 'Course', 'lifterlms' ),
		__( 'Memebership', 'lifterlms' ),
	],
	attributes: {
		post_id: {
			type: 'int',
			default: 0,
		},
	},

	edit,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 *
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @since 1.0.0
	 *
	 * @return {null} Saving disabled for "dynamic" block.
	 */
	save: () => {
		return null;
	},
};
