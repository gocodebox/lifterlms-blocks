/**
 * Inspector settings for the Course Information Block.
 *
 * @since 1.6.0
 * @since 1.7.0 Import from `wp.editor` when `wp.blockEditor` is not available.
 * @version 1.6.0
 */

// WP Deps.
const
	{
		InspectorControls,
		InspectorAdvancedControls,
	}                     = wp.blockEditor || wp.editor,
	{
		PanelBody,
		PanelRow,
		SelectControl,
		Slot,
		TextControl,
		ToggleControl,
	}                     = wp.components,
	{ dispatch }          = wp.data,
	{
		Component,
		Fragment,
	}                     = wp.element,
	{ __ }                = wp.i18n;

// Internal Deps.
import InspectorFieldOptions from './inspect-field-options';
import getBlocksFlat from '../../util/get-blocks-flat';

export default class Inspector extends Component {

	getBlockByFieldId( fieldId ) {

		const blocks = getBlocksFlat().filter( block => fieldId === block.attributes.id );
		if ( blocks ) {
			return blocks[0];
		}

		return false;

	};

	getMatchFieldOptions() {

		const {
			clientId,
			name,
		} = this.props;

		const opts = [ {
			value: '',
			label: __( 'Select a field', 'lifterlms' ),
		} ];

		return opts.concat( getBlocksFlat().filter( block => block.clientId !== clientId && -1 !== name.indexOf( 'llms/form-field-') ).map( block => {

			const { id, label } = block.attributes;

			return {
				value: id,
				label: `${ label } (${ id })`,
			};

		} ) );

	};

	hasInspectorSupport() {

		const { inspectorSupports } = this.props;
		return ( Object.keys( inspectorSupports ).filter( key => inspectorSupports[ key ] ).length >= 1)

	};

	hasInspectorControlSupport( control ) {

		const { inspectorSupports } = this.props;
		return inspectorSupports[ control ];

	};

	render() {

		const
			{
				attributes,
				setAttributes,
			} = this.props,
			{
				id,
				match,
				name,
				required,
				options,
				placeholder,
			} = attributes;


		// Return early if there's no inspector options to display.
		if ( ! this.hasInspectorSupport() ) {
			return '';
		}

		return (
			<Fragment>
				<InspectorControls>

					<PanelBody>

						{ this.hasInspectorControlSupport( 'required' ) && (
							<ToggleControl
								label={ __( 'Required', 'lifterlms' ) }
								checked={ !! required }
								onChange={ value => setAttributes( { required: ! required } ) }
								help={ !! required ? __( 'Field is required.', 'lifterlms' ) : __( 'Field is optional.', 'lifterlms' ) }
							/>
						) }

						{ this.hasInspectorControlSupport( 'options' ) && (
							<InspectorFieldOptions
								attributes={ attributes }
								setAttributes={ setAttributes }
							/>
						) }

						{ this.hasInspectorControlSupport( 'placeholder' ) && (
							<TextControl
								label={ __( 'Placeholder', 'lifterlms' ) }
								value={ placeholder }
								onChange={ ( placeholder ) => setAttributes( { placeholder } ) }
								help={ __( 'Displays a placeholder option as the selected instead of a default value.', 'lifterlms' )}
							/>
						) }

						{ this.hasInspectorControlSupport( 'customFill' ) && (
							<Slot name={ `llmsInspectorControlsFill.${ this.hasInspectorControlSupport( 'customFill' ) }` } />
						) }

					</PanelBody>

				</InspectorControls>

				<InspectorAdvancedControls>
					{ this.hasInspectorControlSupport( 'name' ) && (
						<TextControl
							label={ __( 'Field Name', 'lifterlms' ) }
							onChange={ value => setAttributes( { name: value } ) }
							help={ __( 'The field\'s HTML name attribute.', 'lifterlms' ) }
							value={ name }
						/>
					) }

					{ this.hasInspectorControlSupport( 'id' ) && (
						<TextControl
							label={ __( 'Field ID', 'lifterlms' ) }
							onChange={ value => setAttributes( { id: value } ) }
							help={ __( 'The field\'s HTML id attribute.', 'lifterlms' ) }
							value={ id }
						/>
					) }

					{ this.hasInspectorControlSupport( 'match' ) && (
						<SelectControl
							label={ __( 'Confirmation Field', 'lifterlms' ) }
							onChange={ value => {

								// Save the matched field value.
								setAttributes( { match: value } );

								// Update the matched field to have the current field as its matcher.
								const match = this.getBlockByFieldId( value );
								if ( match ) {
									dispatch( 'core/block-editor' ).updateBlockAttributes( match.clientId, { match: id } );
								}

							} }
							help={ __( 'Requires this field to match the selected field.', 'lifterlms' ) }
							value={ match }
							options={ this.getMatchFieldOptions() }
						/>
					) }

				</InspectorAdvancedControls>
			</Fragment>
		);

	};

};
