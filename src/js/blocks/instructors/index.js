/**
 * BLOCK: llms/instructors
 *
 * Renders instructor list
 *
 * @since 1.0.0
 * @since 1.5.0 Add supported post type settings.
 * @since 1.11.0 Add membership to supported post types settings.
 * @version 2.5.0
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import icon from '../../icons/person-chalkboard';
import edit from './edit';
import './editor.scss';

import { subscribe, select, dispatch } from '@wordpress/data';

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

let wasSaving = false;

subscribe( () => {
	const isSaving = select( 'core/edit-post' ).isSavingMetaBoxes();

	if ( wasSaving && ! isSaving ) {
		wasSaving = isSaving;

		select( 'core/block-editor' )
			.getBlocks()
			.filter( ( b ) => b.name === name )
			.forEach( ( b ) =>
				dispatch( 'core/block-editor' ).updateBlockAttributes(
					b.clientId,
					{ _refresh: Date.now() }
				)
			);
	} else {
		wasSaving = isSaving;
	}
} );
/**
 * Register Block.
 *
 * @since 1.0.0
 * @since 2.5.0 Update icon color to `currentColor`.
 *
 * @type {Object}
 */
export const settings = {
	title: __( 'Instructors', 'lifterlms' ),
	icon: icon,
	category: 'llms-blocks',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
		__( 'Course', 'lifterlms' ),
		__( 'Memebership', 'lifterlms' ),
	],
	attributes: {
		post_id: {
			type: 'integer',
			default: 0,
		},
		_refresh: {
			type: 'integer',
			default: 0,
		}
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
