/**
 * Preview area for visibility settings on the block list
 *
 * @since    [version]
 * @version  [version]
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

export default class Preview extends Component {

	render() {

		const {
			llms_visibility
		} = this.props.attributes;

		return (
			<Fragment>
				<div class="llms-block-enrollment-visibility">
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
