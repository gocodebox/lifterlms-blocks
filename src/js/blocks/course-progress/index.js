/**
 * BLOCK: llms/course-progress
 *
 * @since 1.0.0
 * @since 1.5.0 Add supported post type settings.
 * @since 1.8.0 Remove import of empty CSS file.
 *              Use `import` in favor of "wp." constants.
 *              Set shortcode attribute check_enrollment to true(1) so to display the progress to enrolled users only.
 *              Do not support llms_visibility.
 * @since 1.9.0 Turned into a dynamic block.
 */

// WP deps.
import { __ } from '@wordpress/i18n';

// CSS.
import './editor.scss';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = [ 'course' ];

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/course-progress';

/**
 * Register: Course Progress Block
 *
 * @type {Object}
 */
export const settings = {
	title: __( 'Course Progress', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'chart-area',
	},
	category: 'llms-blocks',
	keywords: [ __( 'LifterLMS', 'lifterlms' ) ],
	supports: {
		llms_visibility: false,
	},

	/**
	 * Block edit method
	 *
	 * @since 1.0.0
	 * @since 1.8.0 Use `className` in favor of `class`.
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	edit( props ) {
		return (
			<div className={ props.className }>
				<div className="progress-bar" value="50" max="100">
					<div className="progress--fill"></div>
				</div>
				<span>50%</span>
			</div>
		);
	},

	/**
	 * Save block content
	 *
	 * @since 1.0.0
	 * @since 1.8.0 Set shortcode attribute check_enrollment to true (1) so to display the progress to enrolled users only.
	 * @since 1.9.0 Turned into a dynamic block.
	 *
	 * @return {null}
	 */
	save() {
		return null;
	},
	deprecated: [
		{
			/**
			 * Block Editor Save
			 *
			 * @param props
			 * @since 1.0.0
			 * @deprecated 1.8.0
			 * @return {Function}
			 */
			save( props ) {
				return (
					<div className={ props.className }>
						[lifterlms_course_progress]
					</div>
				);
			},
		},
	],
};
