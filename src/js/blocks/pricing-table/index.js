/**
 * BLOCK: llms/pricing-table
 *
 * @since 1.0.0
 * @since 1.3.8 Explicitly import jQuery.
 * @since 1.5.0 Add supported post type settings.
 * @since 1.8.0 Use imports in favor of "wp." variables.
 *              Use @wordpress/server-side-render in favor of wp.components.ServerSideRender.
 * @version [version]
 */

// External deps.
import $ from 'jquery';

// WP deps.
import { createBlock } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';

// Internal dependencies.
import icon from '../../icons/money-check-dollar';
import './editor.scss';
import './subscribe';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/pricing-table';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = [ 'course', 'llms_membership' ];

/**
 * Register Course Syllabus Block
 *
 * @since 1.0.0
 * @since 1.3.6 Unknown.
 * @since [version] Update icon color to `currentColor`.
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 * @return {Object} Block settings object.
 */
export const settings = {
	title: __( 'LifterLMS Pricing Table', 'lifterlms' ),
	icon: icon,
	category: 'llms-blocks', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
	keywords: [ __( 'LifterLMS', 'lifterlms' ) ],
	attributes: {
		post_id: {
			type: 'int',
			default: 0,
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 *
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @since 1.0.0
	 * @since 1.3.6 Unknown.
	 *
	 * @param {Object} props Block properties.
	 * @return {Fragment} Edit component fragment.
	 */
	edit: ( props ) => {
		const { attributes } = props;

		// Reload when changes are made to access plans.
		$( document ).one( 'llms-access-plans-updated', function () {
			// Replacing the block with a duplicate of itself so we can reload the block from the server.
			dispatch( 'core/editor' ).replaceBlock(
				props.clientId,
				createBlock( name )
			);

			// This will save the updates to the post content that appear as a result of the replacement.
			// Since I can't seem to figure out how to prevent the change from being triggered we have to duplicate a save.
			// which is gross. I know it's gross. It works though....
			setTimeout( function () {
				dispatch( 'core/editor' ).savePost();
			}, 500 );
		} );

		return (
			<Fragment>
				<ServerSideRender
					block={ name }
					attributes={ attributes }
					urlQueryArgs={ {
						post_id: select( 'core/editor' ).getCurrentPostId(),
					} }
				/>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @since 1.0.0
	 *
	 * @return {null} Save function disabled for "dynamic" block.
	 */
	save: () => {
		return null;
	},
};
