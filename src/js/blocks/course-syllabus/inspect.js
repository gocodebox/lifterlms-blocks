/**
 * Block Attributes Inspector: Course Syllabus
 *
 * @since 1.0.0
 * @since 1.6.0 Import `InspectorControls` from `wp.blockEditor` in favor of deprecated `wp.editor`
 * @since 1.7.0 Import `InspectorControls` from `wp.blockEditor` and fallback to `wp.editor` to maintain backwards compatibility.
 * @version 1.6.0
 */

// WP Deps.
const { __ } = wp.i18n,
	{ Component } = wp.element,
	{ InspectorControls } = wp.blockEditor || wp.editor,
	{
		PanelBody,
		PanelRow,
		SelectControl,
		TextControl,
		ToggleControl,
	} = wp.components;

export default class Inspector extends Component {
	render() {
		const {
			attributes: { course_id },
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={ __( 'Course Syllabus Options', 'lifterlms' ) }
				></PanelBody>
			</InspectorControls>
		);
	}
}
