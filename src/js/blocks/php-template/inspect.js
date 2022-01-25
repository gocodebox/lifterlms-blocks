// WP Dependencies.
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Block inspector component.
 *
 * @since [version]
 *
 * @param {Object}   props               Component properties.
 * @param {Boolean}  props.hideTitle     Current state of the hide title block attribute.
 * @param {Function} props.setAttributes Function used to update the block's attributes.
 * @return {InspectorControls} The inspector component.
 */
export default function( { hideTitle, setAttributes } ) {

	return (
		<InspectorControls>

			<PanelBody>

				<ToggleControl
					label={ __( 'Hide page title', 'lifterlms' ) }
					checked={ !! hideTitle }
					onChange={ () =>
						setAttributes( { hideTitle: ! hideTitle } )
					}
					help={
						!! hideTitle
							? __( 'Displaying the default title', 'lifterlms' )
							: __( 'Hiding the default title', 'lifterlms' )
					}
				/>

			</PanelBody>

		</InspectorControls>
	);

}
