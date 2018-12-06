/**
 * Instructors Block edit
 *
 * @since   1.0.0
 * @version 1.0.0
 */

// WP deps.
const {
	ServerSideRender,
} = wp.components;
const {
	compose,
} = wp.compose
const {
	withSelect,
} = wp.data;
const {
	Component,
	Fragment
} = wp.element
const {
	__,
} = wp.i18n;

class InstructorsEdit extends Component {

	constructor() {

		super( ...arguments )

		this.state = {
			instructors: this.props.instructors,
		}

	}

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
