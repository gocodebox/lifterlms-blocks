/**
 * BLOCK: llms/lesson-navigation
 *
 * @since 1.0.0
 * @version [version]
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/lesson-navigation';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = [ 'lesson' ];

/**
 * Register Block
 *
 * @since   1.0.0
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 * @return {Object} Block settings object.
 */
export const settings = {
	title: __( 'Lesson Navigation', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'leftright',
	},
	category: 'llms-blocks',
	keywords: [ __( 'LifterLMS', 'lifterlms' ) ],

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 *
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} props Block properties.
	 * @return {Fragment} Edit component html fragment.
	 */
	edit( props ) {
		const currentPost = wp.data.select( 'core/editor' ).getCurrentPost();
		const { attributes } = props;

		return (
			<Fragment>
				<ServerSideRender
					block={ name }
					attributes={ attributes }
					urlQueryArgs={ {
						post_id: currentPost.id,
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
	 * @return {null} Saving disabled for "dynamic" block.
	 */
	save() {
		return null;
	},
};
