/**
 * BLOCK: llms/course-syllabus
 *
 * Renders a course syllabus
 *
 * @since 1.0.0
 * @version [version]
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

// Internal dependencies.
import icon from '../../icons/table-cells-large';
import './editor.scss';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/course-syllabus';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = [ 'course' ];

/**
 * Register Course Syllabus Block
 *
 * @since 1.0.0
 * @since [version] Update icon color to `currentColor`.
 */
export const settings = {
	title: __( 'Course Syllabus', 'lifterlms' ),
	icon: icon,
	category: 'llms-blocks',
	keywords: [ __( 'LifterLMS', 'lifterlms' ) ],
	attributes: {
		course_id: {
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
	 * @since 1.0.0
	 * @since 2.0.0 Don't render InspectorControls since the block doesn't have any actual settings.
	 *
	 * @param {Object} props Block properties.
	 * @return {Fragment} Component HTML fragment.
	 */
	edit: ( props ) => {
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
	 * @return {null} Saving disable for "dynamic" blocks.
	 */
	save: () => {
		return null;
	},
};
