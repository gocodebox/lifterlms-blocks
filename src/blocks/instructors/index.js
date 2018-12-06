/**
 * BLOCK: llms/instructors
 *
 * Renders instructor list
 *
 * @since   [version]
 * @version [version]
 */

// WP Deps.
const { __ } = wp.i18n;

// Internal Deps.
import edit from './edit'
import './editor.scss'

/**
 * Block Name
 * @type {String}
 */
export const name = 'llms/instructors'

/**
 * Register Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param   {string}   name     Block name.
 * @param   {Object}   settings Block settings.
 * @return  {?WPBlock}          The block, if it has been successfully, registered; otherwise `undefined`.
 * @since   [version]
 * @version [version]
 */
export const settings = {

	title: __( 'Instructors', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'groups',
	},
	category: 'common', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
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
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   [version]
	 * @version [version]
	 */
	save: () => {
		return null;
	},

}
