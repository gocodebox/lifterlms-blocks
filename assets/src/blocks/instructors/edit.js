/**
 * Instructors Block edit
 *
 * @since 1.0.0
 * @since [version] Use imports in favor of "wp." variables.
 *              Use @wordpress/server-side-render in favor of wp.components.ServerSideRender.
 */

// WP deps.
import { __ } from '@wordpress/i18n';
import {
	Component,
	Fragment,
} from '@wordpress/element';
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
	 * @return {Void}
	 */
	constructor() {

		super( ...arguments )

		this.state = {
			instructors: this.props.instructors,
		}

	}

	/**
	 * Render component
	 *
	 * @since 1.0.0
	 *
	 * @return {Fragment}
	 */
	render = () => {

		const {
			name,
			attributes,
			post_id,
		} = this.props

		return (
			<Fragment>
				<ServerSideRender
					block={ name }
					attributes={ attributes }
					urlQueryArgs={ {
						post_id: post_id,
					} }
				/>
			</Fragment>
		);
	}

}

/**
 * Compose the component with data select
 *
 * @since [version]
 *
 * @return {InstructorsEdit}
 */
export default compose( [
	withSelect( ( select, props ) => {
		const {
			getEditedPostAttribute,
			getCurrentPostId,
		} = select( 'core/editor' );
		return {
			post_id: getCurrentPostId(),
			instructors: getEditedPostAttribute( 'instructors' ),
		};
	} ),
] )( InstructorsEdit );
