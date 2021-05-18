/**
 * Inspector settings for the Course Information Block.
 *
 * @since 1.6.0
 * @version 1.12.0
 */

// WP Deps.
import {
	InspectorControls,
	InspectorAdvancedControls,
	store as blockEditorStore,
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
import { select, dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	switchToBlockType,
	getPossibleBlockTransformations,
	getBlockType,
} from '@wordpress/blocks';

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

	getColumnsOptions( context ) {
		let options = [];

		// Full width is allowed inside stacked groups or when the field is being used solo.
		if (
			! context ||
			( context &&
				( ! context[ 'llms/fieldGroup/fieldLayout' ] ||
					'stacked' === context[ 'llms/fieldGroup/fieldLayout' ] ) )
		) {
			options.push( {
				value: 12,
				label: __( '100%', 'lifterlms' ),
			} );
		}

		options = options.concat( [
			{
				value: 9,
				label: __( '75%', 'lifterlms' ),
			},
			{
				value: 8,
				label: __( '66.66%', 'lifterlms' ),
			},
			{
				value: 6,
				label: __( '50%', 'lifterlms' ),
			},
			{
				value: 4,
				label: __( '33.33%', 'lifterlms' ),
			},
			{
				value: 3,
				label: __( '25%', 'lifterlms' ),
			},
		] );

		return options;
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

	canTransformToGroup( block ) {
		// If the block is already within a confirmation block then we can't add a confirmation group.
		if ( ! block || this.isInAConfirmGroup( block ) ) {
			return false;
		}
		return getPossibleBlockTransformations( [ block ] )
			.map( ( { name } ) => name )
			.includes( 'llms/form-field-confirm-group' );
	}

	isInAConfirmGroup( block ) {
		return this.getParentGroupClientId( block ) ? true : false;
	}

	getParentGroupClientId( block ) {
		if ( ! block ) {
			return false;
		}

		const { clientId } = block,
			{ getBlockParentsByBlockName } = select( blockEditorStore ),
			parents = getBlockParentsByBlockName(
				clientId,
				'llms/form-field-confirm-group'
			);

		return parents.length ? parents[ 0 ] : false;
	}

	getBlockSiblings( block ) {
		const parentClientId = this.getParentGroupClientId( block );

		if ( ! parentClientId ) {
			return [];
		}

		const { getBlock } = select( blockEditorStore ),
			parentBlock = getBlock( parentClientId );

		return parentBlock.innerBlocks.filter(
			( { clientId } ) => clientId !== block.clientId
		);
	}

	/**
	 * Update a field's "name" attribute
	 *
	 * Validates against the global field name list found in `window.llms.fieldNames`
	 * to ensure global uniqueness and throws an error notice when a non-unique name
	 * is submitted.
	 *
	 * @since [version]
	 *
	 * @param {string} name The new field name
	 * @return {void}
	 */
	updateFieldNameAttribute( name ) {
		const { attributes, setAttributes } = this.props,
			currentName = attributes.name;

		// We don't have to do anything here.
		if ( name === currentName ) {
			return;
		}

		const { fieldNames } = window.llms,
			isValid = ! fieldNames.includes( name );

		if ( ! isValid ) {
			const noticeId = `llms-name-validation-err-${ attributes.uuid }`,
				{ createErrorNotice, removeNotice } = dispatch(
					'core/notices'
				);

			removeNotice( noticeId );
			createErrorNotice(
				__( 'Please choose a unique field name.', 'lifterlms' ),
				{ id: noticeId }
			);

			return;
		}

		// It's valid, update the name.
		setAttributes( { name } );

		// Remove the old name from the list.
		delete fieldNames[ fieldNames.indexOf( currentName ) ];

		// Add the new name to the list.
		fieldNames.push( name );

		// Persist to the window variable, filtering removes the deleted items.
		window.llms.fieldNames = fieldNames.filter( ( i ) => i );
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
		// Return early if there's no inspector options to display.
		if ( ! this.hasInspectorSupport() ) {
			return '';
		}

		const { attributes, setAttributes, clientId, context } = this.props,
			block = select( blockEditorStore ).getBlock( clientId ),
			{
				id,
				name,
				required,
				placeholder,
				data_store,
				data_store_key,
				columns,
				isConfirmationField,
				isConfirmationControlField,
			} = attributes;

		const canTransformToGroup = this.canTransformToGroup( block ),
			isInAConfirmGroup = this.isInAConfirmGroup( block );

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody>
						{ ! isConfirmationField &&
							this.hasInspectorControlSupport( 'required' ) && (
								<ToggleControl
									className="llms-required-field-toggle"
									label={ __( 'Required', 'lifterlms' ) }
									checked={ !! required }
									onChange={ () =>
										setAttributes( {
											required: ! required,
										} )
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

						<SelectControl
							className="llms-field-width-select"
							label={ __( 'Field Width', 'lifterlms' ) }
							onChange={ ( columns ) => {
								columns = parseInt( columns, 10 );
								setAttributes( { columns } );

								const sibling = this.getBlockSiblings( block );

								if (
									sibling.length &&
									columns + sibling[ 0 ].attributes.columns >
										12
								) {
									const { updateBlockAttributes } = dispatch(
										blockEditorStore
									);
									updateBlockAttributes(
										sibling[ 0 ].clientId,
										{
											columns: 12 - columns,
										}
									);
								}
							} }
							help={ __(
								'Determines the width of the form field.',
								'lifterlms'
							) }
							value={ columns }
							options={ this.getColumnsOptions( context ) }
						/>

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

						{ ( canTransformToGroup ||
							( isConfirmationControlField &&
								isInAConfirmGroup ) ) && (
							<ToggleControl
								className="llms-confirmation-field-toggle"
								label={ __(
									'Confirmation Field',
									'lifterlms'
								) }
								checked={ isInAConfirmGroup }
								onChange={ () => {
									const {
											replaceBlock,
											selectBlock,
										} = dispatch( blockEditorStore ),
										{
											findControllerBlockIndex,
										} = getBlockType(
											'llms/form-field-confirm-group'
										),
										{ getBlock } = select(
											blockEditorStore
										);

									let replaceClientId = clientId,
										newBlockType =
											'llms/form-field-confirm-group',
										blockToSwitch = block,
										selectBlockId = null;

									if ( isInAConfirmGroup ) {
										replaceClientId = this.getParentGroupClientId(
											block
										);
										blockToSwitch = getBlock(
											replaceClientId
										);
										newBlockType = block.name;
									}

									const switched = switchToBlockType(
										blockToSwitch,
										newBlockType
									);
									replaceBlock( replaceClientId, switched );

									if ( ! isInAConfirmGroup ) {
										const { innerBlocks } = getBlock(
												clientId
											),
											controllerIndex = findControllerBlockIndex(
												innerBlocks
											);

										selectBlockId =
											innerBlocks[ controllerIndex ]
												.clientId;
									} else {
										selectBlockId = switched[ 0 ].clientId;
									}

									selectBlock( selectBlockId );
								} }
								help={
									isInAConfirmGroup
										? __(
												'A Confirmation field is active.',
												'lifterlms'
										  )
										: __(
												'No confirmation field.',
												'lifterlms'
										  )
								}
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

					{ ! isConfirmationField &&
						this.hasInspectorControlSupport( 'storage' ) && (
							<PanelBody
								title={ __( 'Data Storage', 'lifterlms' ) }
							>
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
												addingKeys: ! this.state
													.addingKeys,
											} )
										}
									>
										{ __( 'Add New Key', 'lifterlms' ) }
									</Button>
								) }

								{ 'users' !== data_store &&
									this.state.addingKeys && (
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
													value={
														this.state.addingKey
													}
												/>
											</PanelRow>

											<Button
												isSecondary
												onClick={ () => {
													// Select the newly added key.
													setAttributes( {
														data_store_key: this
															.state.addingKey,
													} );

													// Clear the state.
													this.setState( {
														addingKeys: false,
														addingKey: '',
													} );
												} }
											>
												{ __(
													'Add New Key',
													'lifterlms'
												) }
											</Button>
										</Fragment>
									) }
							</PanelBody>
						) }
				</InspectorControls>

				<InspectorAdvancedControls>
					{ ! isConfirmationField &&
						this.hasInspectorControlSupport( 'name' ) && (
							<TextControl
								label={ __( 'Field Name', 'lifterlms' ) }
								onChange={ ( newName ) =>
									this.updateFieldNameAttribute( newName )
								}
								help={ __(
									"The field's HTML name attribute.",
									'lifterlms'
								) }
								value={ name }
							/>
						) }

					{ ! isConfirmationField &&
						this.hasInspectorControlSupport( 'id' ) && (
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
				</InspectorAdvancedControls>
			</Fragment>
		);
	}
}
