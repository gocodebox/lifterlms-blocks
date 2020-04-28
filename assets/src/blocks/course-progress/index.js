/**
 * BLOCK: llms/course-progress
 *
 * @since 1.0.0
 * @since 1.5.0 Add supported post type settings.
 * @since [version] Remove import of empty CSS file.
 *              Use `import` in favor of "wp." constants.
 *              Set shortcode attribute check_enrollment to true(1) so to display the progress to enrolled users only.
 *              Do not support llms_visibility.
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
export const post_types = [ 'course' ];

/**
 * Block Name
 *
 * @type {String}
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
		src: 'chart-area'
	},
	category: 'llms-blocks',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],
	supports: {
		llms_visibility: false,
	},

	/**
	 * Block edit method
	 *
	 * @since 1.0.0
	 * @since [version] Use `className` in favor of `class`.
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	edit: function( props ) {
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
	 * @since [version] Set shortcode attribute check_enrollment to true (1) so to display the progress to enrolled users only.
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	save: function( props ) {
		return (
			<div className={ props.className }>
				[lifterlms_course_progress check_enrollment=1]
			</div>
		);
	},
	deprecated: [
		{
			/**
			 * Block Editor Save
			 *
			 * @since 1.0.0
			 * @deprecated [version]
			 *
			 * @return {Function}
			 */
			save: function( props ) {
				return (
					<div className={ props.className }>
						[lifterlms_course_progress]
					</div>
				);
			},
		},
	]
}
