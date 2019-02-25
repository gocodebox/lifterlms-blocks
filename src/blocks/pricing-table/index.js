/**
 * BLOCK: llms/pricing-table
 *
 * @since   1.0.0
 * @version [version]
 */

// WP Deps.
const {
	createBlock,
} = wp.blocks;
const { ServerSideRender } = wp.components;
const {
	dispatch,
	select,
} = wp.data;
const { Fragment } = wp.element;
const { __ } = wp.i18n;


// Internal Deps.
import './editor.scss';
import './subscribe';

/**
 * Block Name
 * @type {String}
 */
export const name = 'llms/pricing-table';

/**
 * Register Course Syllabus Block
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param   {string}   name     Block name.
 * @param   {Object}   settings Block settings.
 * @return  {?WPBlock}          The block, if it has been successfully, registered; otherwise `undefined`.
 * @since   1.0.0
 * @version [version]
 */
export const settings = {

	title: __( 'LifterLMS Pricing Table', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'cart',
	},
	category: 'llms-blocks', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],
	attributes: {
		post_id: {
			type: 'int',
			default: 0,
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   1.0.0
	 * @version [version]
	 */
	edit: props => {

		const {
			attributes,
			setAttributes,
		} = props;

		// Reload when changes are made to access plans.
		$( document ).one( 'llms-access-plans-updated', function() {

			// Replacing the block with a duplicate of itself so we can reload the block from the server.
			dispatch( 'core/editor' ).replaceBlock( props.clientId, createBlock( name ) );

			// This will save the updates to the post content that appear as a result of the replacement.
			// Since I can't seem to figure out how to prevent the change from being triggered we have to duplicate a save.
			// which is gross. I know it's gross. It works though....
			setTimeout( function() {
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
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	save: () => {
		return null;
	},

}
