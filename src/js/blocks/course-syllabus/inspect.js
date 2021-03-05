/**
 * Block Attributes Inspector: Course Syllabus
 *
 * @since 1.0.0
 * @since 1.6.0 Import `InspectorControls` from `wp.blockEditor` in favor of deprecated `wp.editor`
 * @since 1.7.0 Import `InspectorControls` from `wp.blockEditor` and fallback to `wp.editor` to maintain backwards compatibility.
 * @version 1.6.0
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

/**
 * Block inspector component
 *
 * @since 1.0.0
 */
export default class Inspector extends Component {
	/**
	 * Render the component
	 *
	 * @since [version]
	 *
	 * @return {InspectorControls} Component HTML fragment.
	 */
	render() {
		return (
			<InspectorControls>
				<PanelBody
					title={ __( 'Course Syllabus Options', 'lifterlms' ) }
				></PanelBody>
			</InspectorControls>
		);
	}
}
