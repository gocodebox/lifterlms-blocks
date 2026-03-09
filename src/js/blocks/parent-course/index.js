/**
 * BLOCK: llms/parent-course
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';

// Internal dependencies.
	import icon from '../../icons/house';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/parent-course';

/**
 * Register Block
 *
 * @since [version]
 *
 * @type {Object}
 */
export const settings = {
	title: __( 'Back to Course', 'lifterlms' ),
	icon: icon,
	category: 'llms-blocks',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
		__( 'course', 'lifterlms' ),
		__( 'parent', 'lifterlms' ),
	],

	/**
	 * Block edit component.
	 *
	 * @since [version]
	 *
	 * @param {Object} props Block properties.
	 * @return {Fragment} Edit component html fragment.
	 */
	edit( props ) {
		const { attributes } = props;

		return (
			<Fragment>
				<ServerSideRender
					block={ name }
					attributes={ attributes }
					EmptyResponsePlaceholder={ () => (
						<p className="llms-block-empty">
							{ __(
								'Back to: (Parent Course) — visible on lessons only.',
								'lifterlms'
							) }
						</p>
					) }
				/>
			</Fragment>
		);
	},

	/**
	 * Save block content.
	 *
	 * @since [version]
	 *
	 * @return {null} Saving disabled for dynamic block.
	 */
	save() {
		return null;
	},
};
