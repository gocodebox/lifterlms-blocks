/**
 * Preview area for visibility settings on the block list
 *
 * @since 1.1.0
 * @version 1.6.0
 */

// WP Deps.
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Dashicon,
} = wp.components;

// Internal Deps.
import './editor.scss';

/**
 * Preview component.
 *
 * Displays a lock icon on the block editor preview area for each block which indicates whether or not the block
 * is open to all or has visibility settings enabled.
 *
 * @since 1.1.0
 * @since 1.6.0 Use camelCase `className` in favor of `class`.
 *
 * @return {Class}
 */
export default class Preview extends Component {

	render() {

		const {
			llms_visibility
		} = this.props.attributes;

		return (
			<Fragment>
				<div className="llms-block-enrollment-visibility">
					{ 'all' !== llms_visibility && (
						<Dashicon icon="lock" />
					) }
					{ 'all' === llms_visibility && (
						<Dashicon icon="unlock" />
					) }
				</div>
			</Fragment>
		);

	};

};
