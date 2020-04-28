/**
 * BLOCK: llms/lesson-progression
 *
 * @since 1.0.0
 * @since 1.5.0 Add supported post type settings.
 * @since [version] Use imports in favor of "wp." variables.
 *              Convert "edit" function from using ServerSideRender.
 */

// WP Deps.
import { Button } from '@wordpress/components';
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// CSS.
import './editor.scss';


/**
 * Block Name
 * @type {String}
 */
export const name = 'llms/lesson-progression';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const post_types = [ 'lesson' ];

/**
 * Register Block
 *
 * @type {Object}
 */
export const settings = {
	title: __( 'Lesson Progression (Mark Complete)', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'yes'
	},
	category: 'llms-blocks',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],
	supports: {
		llms_visibility: false,
	},

	/**
	 * Edit block
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	edit: function( props ) {

		const
			{
				attributes,
				setAttributes,
			}           = props,
			currentPost = select( 'core/editor' ).getCurrentPost(),
			quiz        = currentPost.meta._llms_quiz * 1;

		let showMainBtn = quiz ? false : true;

		/**
		 * Determine whether or not to show the "Mark Complete" button in the lesson progression block editor "edit" view.
		 *
		 * @since [version]
		 *
		 * @param {Boolean} showMainBtn Determines whether or not to display the main button.
		 */
		showMainBtn = applyFilters( 'llms.lessonProgressBlock.showMainBtn', showMainBtn );

		return (
			<Fragment>
				{ !!quiz && (
					<Button className="llms-prog-btn--quiz" isPrimary>{ __( 'Take Quiz', 'lifterlms' ) }</Button>
				) }
				{ showMainBtn && (
					<Button className="llms-prog-btn--complete" isPrimary>{ __( 'Mark Complete', 'lifterlms' ) }</Button>
				) }
			</Fragment>
		);
	},

	/**
	 * Save Block
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	save: function( props ) {
		return null
	},
};
