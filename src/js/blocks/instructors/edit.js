/**
 * Instructors Block edit
 *
 * @since 1.0.0
 * @since 1.8.0 Use imports in favor of "wp." variables.
 *              Use @wordpress/server-side-render in favor of wp.components.ServerSideRender.
 */

// WP deps.
import { Component, Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * Instructors Block edit component.
 *
 * @since 1.0.0
 */
class InstructorsEdit extends Component {
	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @return {void}
	 */
	constructor() {
		super( ...arguments );

		this.state = {
			instructors: this.props.instructors,
		};
	}

	/**
	 * Render component
	 *
	 * @since 1.0.0
	 *
	 * @return {Fragment} Component html fragment.
	 */
	render = () => {
		const { name, attributes, post_id } = this.props; // eslint-disable-line camelcase

		return (
			<Fragment>
				<ServerSideRender
					block={ name }
					attributes={ attributes }
					urlQueryArgs={ {
						post_id, // eslint-disable-line camelcase
					} }
				/>
			</Fragment>
		);
	};
}

/**
 * Compose the component with data select
 *
 * @since 1.8.0
 *
 * @return {InstructorsEdit}
 */
export default compose( [
	withSelect( ( select ) => {
		const { getEditedPostAttribute, getCurrentPostId } = select(
			'core/editor'
		);
		return {
			post_id: getCurrentPostId(),
			instructors: getEditedPostAttribute( 'instructors' ),
		};
	} ),
] )( InstructorsEdit );
