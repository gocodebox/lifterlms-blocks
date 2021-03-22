/**
 * Inspector settings for the Course Information Block.
 *
 * @since 1.6.0
 * @version 1.12.0
 */

/* eslint camelcase: [ "error", { allow: [ "data_store*" ] } ] */

// WP Deps.
import {
	InspectorControls,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	SelectControl,
	Slot,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import InspectorFieldOptions from './inspect-field-options';
import getBlocksFlat from '../../util/get-blocks-flat';

/**
 * Block Inspector for Field blocks
 *
 * @since 1.6.0
 */
export default class Inspector extends Component {
	/**
	 * Constructor
	 *
	 * @since 1.12.0
	 *
	 * @return {void}
	 */
	constructor() {
		super( ...arguments );
		this.state = {
			addingKey: '',
			addingKeys: false,
		};
	}

	/**
	 * Retrieve an array of objects to be used in data store related Select controls
	 *
	 * @since 1.12.0
	 *
	 * @param {string}   key         Describes which Select control to retrieve data for.
	 * @param {string}   location    When retrieving for the "keys" list control, additionally provide the location to provide keys for.
	 * @param {string[]} currentKeys Array of keys to add to the keys list control. Should include the default key (equal to the fields "name") as well as the currently selected key.
	 * @return {Object[]} Array of objects to be used for the options of a Select control.
	 */
	getDataStoreOptions( key, location = null, currentKeys = [] ) {
		const opts = applyFilters( 'llms.blockFields.dataStoreOptions', {
			users: {
				label: __( 'Users Table', 'lifterlms' ),
				keys: [ 'user_url', 'display_name' ],
			},
			usermeta: {
				label: __( 'User Meta Table', 'lifterlms' ),
				keys: [ 'nickname', 'description' ],
			},
		} );

		if ( 'locations' === key ) {
			return Object.keys( opts ).map( ( value ) => {
				return { value, label: opts[ value ].label };
			} );
		} else if ( 'keys' === key ) {
			let keys = opts[ location ].keys;
			if ( currentKeys.length ) {
				keys = keys.concat( currentKeys );
			}
			keys = [ ...new Set( keys ) ];
			return keys.map( ( value ) => {
				return { value, label: value };
			} );
		}

		return [];
	}

	/**
	 * Retrieve a specific block by it's ID attribute.
	 *
	 * @since 1.6.0
	 *
	 * @param {string} fieldId The field ID.
	 * @return {Object | boolean} A block object or false if not found.
	 */
	getBlockByFieldId( fieldId ) {
		const blocks = getBlocksFlat().filter(
			( block ) => fieldId === block.attributes.id
		);
		if ( blocks ) {
			return blocks[ 0 ];
		}

		return false;
	}

	/**
	 * Retrieve an array of objects to be used in the Matching Field select control.
	 *
	 * @since 1.6.0
	 *
	 * @return {Object[]} Array of objects for the select control options list.
	 */
	getMatchFieldOptions() {
		const { clientId, name } = this.props;

		const opts = [
			{
				value: '',
				label: __( 'Select a field', 'lifterlms' ),
			},
		];

		return opts.concat(
			getBlocksFlat()
				.filter(
					( block ) =>
						block.clientId !== clientId &&
						-1 !== name.indexOf( 'llms/form-field-' )
				)
				.map( ( block ) => {
					const { id, label } = block.attributes;

					return {
						value: id,
						label: `${ label } (${ id })`,
					};
				} )
		);
	}

	/**
	 * Determine if the block has inspector support
	 *
	 * The block must have support for at least one inspector control.
	 *
	 * @since 1.6.0
	 *
	 * @return {boolean} Returns `true` if the block has inspector support.
	 */
	hasInspectorSupport() {
		const { inspectorSupports } = this.props;
		return (
			Object.keys( inspectorSupports ).filter(
				( key ) => inspectorSupports[ key ]
			).length >= 1
		);
	}

	/**
	 * Determine if the block has inspector support for a specific control
	 *
	 * @since 1.6.0
	 *
	 * @param {string} control Control ID.
	 * @return {boolean} Returns `true` if the block has support for inspector controls.
	 */
	hasInspectorControlSupport( control ) {
		const { inspectorSupports } = this.props;
		return inspectorSupports[ control ];
	}

	/**
	 * Render the Block Inspector
	 *
	 * @since 1.6.0
	 * @since 1.12.0 Add inspector controls for data store mapping.
	 *
	 * @return {Fragment} Component HTML fragment.
	 */
	render() {
		const { attributes, setAttributes, clientId } = this.props,
			{
				id,
				match,
				name,
				required,
				placeholder,
				data_store,
				data_store_key,
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
								onChange={ () =>
									setAttributes( { required: ! required } )
								}
								help={
									!! required
										? __(
												'Field is required.',
												'lifterlms'
										  )
										: __(
												'Field is optional.',
												'lifterlms'
										  )
								}
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
								onChange={ ( placeholder ) =>
									setAttributes( { placeholder } )
								}
								help={ __(
									'Displays a placeholder option as the selected instead of a default value.',
									'lifterlms'
								) }
							/>
						) }

						{ this.hasInspectorControlSupport( 'customFill' ) && (
							<Slot
								name={ `llmsInspectorControlsFill.${ this.hasInspectorControlSupport(
									'customFill'
								) }.${ clientId }` }
							/>
						) }
					</PanelBody>

					{ this.hasInspectorControlSupport( 'storage' ) && (
						<PanelBody title={ __( 'Data Storage', 'lifterlms' ) }>
							<SelectControl
								label={ __( 'Location', 'lifterlms' ) }
								onChange={ ( data_store ) =>
									setAttributes( { data_store } )
								}
								help={ __(
									'Database table where field data will be stored for a user completing the form.',
									'lifterlms'
								) }
								value={ data_store }
								options={ this.getDataStoreOptions(
									'locations'
								) }
							/>

							<SelectControl
								label={ __( 'Key', 'lifterlms' ) }
								onChange={ ( data_store_key ) =>
									setAttributes( { data_store_key } )
								}
								help={ __(
									'Name of the field where data is stored.',
									'lifterlms'
								) }
								value={ data_store_key }
								options={ this.getDataStoreOptions(
									'keys',
									data_store,
									'users' === data_store
										? []
										: [ name, data_store_key ]
								) }
							/>

							{ 'users' !== data_store && (
								<Button
									isLink
									onClick={ () =>
										this.setState( {
											addingKeys: ! this.state.addingKeys,
										} )
									}
								>
									{ __( 'Add New Key', 'lifterlms' ) }
								</Button>
							) }

							{ 'users' !== data_store && this.state.addingKeys && (
								<Fragment>
									<PanelRow>
										<TextControl
											label={ __(
												'New Key Name',
												'lifterlms'
											) }
											onChange={ ( value ) =>
												this.setState( {
													addingKey: value.replace(
														/[^0-9a-zA-Z_-]/g,
														''
													),
												} )
											}
											help={ __(
												'Database field key name. Only accepts alphanumeric characters, hyphens, and underscores.',
												'lifterlms'
											) }
											value={ this.state.addingKey }
										/>
									</PanelRow>

									<Button
										isSecondary
										onClick={ () => {
											// Select the newly added key.
											setAttributes( {
												data_store_key: this.state
													.addingKey,
											} );

											// Clear the state.
											this.setState( {
												addingKeys: false,
												addingKey: '',
											} );
										} }
									>
										{ __( 'Add New Key', 'lifterlms' ) }
									</Button>
								</Fragment>
							) }
						</PanelBody>
					) }
				</InspectorControls>

				<InspectorAdvancedControls>
					{ this.hasInspectorControlSupport( 'name' ) && (
						<TextControl
							label={ __( 'Field Name', 'lifterlms' ) }
							onChange={ ( value ) =>
								setAttributes( { name: value } )
							}
							help={ __(
								"The field's HTML name attribute.",
								'lifterlms'
							) }
							value={ name }
						/>
					) }

					{ this.hasInspectorControlSupport( 'id' ) && (
						<TextControl
							label={ __( 'Field ID', 'lifterlms' ) }
							onChange={ ( value ) =>
								setAttributes( { id: value } )
							}
							help={ __(
								"The field's HTML id attribute.",
								'lifterlms'
							) }
							value={ id }
						/>
					) }

					{ this.hasInspectorControlSupport( 'match' ) && (
						<SelectControl
							label={ __( 'Confirmation Field', 'lifterlms' ) }
							onChange={ ( value ) => {
								// Save the matched field value.
								setAttributes( { match: value } );

								// Update the matched field to have the current field as its matcher.
								const match = this.getBlockByFieldId( value );
								if ( match ) {
									dispatch(
										'core/block-editor'
									).updateBlockAttributes( match.clientId, {
										match: id,
									} );
								}
							} }
							help={ __(
								'Requires this field to match the selected field.',
								'lifterlms'
							) }
							value={ match }
							options={ this.getMatchFieldOptions() }
						/>
					) }
				</InspectorAdvancedControls>
			</Fragment>
		);
	}
}
