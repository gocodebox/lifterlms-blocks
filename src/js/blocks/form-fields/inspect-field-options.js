/**
 * Inspector settings component for managing a field's options
 *
 * Used on Radios, Checkboxes, and Selects
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 */

// WP Deps.
import {
	Button,
	BaseControl,
	TextControl,
	Tooltip,
	RadioControl,
} from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

// External Deps.
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';
import { cloneDeep } from 'lodash';

/**
 * Move an item's position within an array.
 *
 * @since 1.6.0
 *
 * @param {Array}   array The array.
 * @param {number} from  Item's original index.
 * @param {number} to    Item's new index.
 * @return {Array} Modified array.
 */
const arrayMove = ( array, from, to ) => {
	array = array.slice();
	array.splice(
		to < 0 ? array.length + to : to,
		0,
		array.splice( from, 1 )[ 0 ]
	);
	return array;
};

/**
 * Drag Handle Component
 *
 * @since 1.6.0
 *
 * @return {Object} Component HTML Fragment.
 */
const DragHandle = SortableHandle( () => (
	<span className="llms-drag-handle" style={ { cursor: 'grab' } }>
		:::
	</span>
) );

/**
 * Sortable container component
 *
 * Holds the list of the field's options.
 *
 * @since 1.6.0
 *
 * @return {Object} Component HTML Fragment.
 */
const OptionsList = SortableContainer(
	( { items, onChange, onRemove, showKeys } ) => {
		return (
			<ul className="llms-field-options">
				{ items.map( ( option, index ) => (
					<OptionItem
						key={ `option-item-${ index }` }
						index={ index }
						i={ index } // index isn't passed to the SortableElement for some reason...
						item={ option }
						onChange={ onChange }
						onRemove={ onRemove }
						showKeys={ showKeys }
					/>
				) ) }
			</ul>
		);
	}
);

/**
 * Sortable element component
 *
 * Each element represents a single option.
 *
 * @since 1.6.0
 * @since 1.12.0 Added tooltip for the "Make Default" radio control & updated the icon used for item deletion.
 *
 * @return {Object} Component HTML Fragment.
 */
const OptionItem = SortableElement(
	( { item, i, onChange, onRemove, showKeys } ) => {
		return (
			<li className="llms-field-option">
				<DragHandle />
				<Tooltip text={ __( 'Make default', 'lifterlms' ) }>
					<div className="llms-field-opt-default-wrap">
						<RadioControl
							className="llms-field-opt-default"
							selected={ item.default }
							onChange={ ( val ) => {
								onChange( { ...item, default: val }, i );
							} }
							options={ [ { label: '', value: 'yes' } ] }
							tabIndex="-1"
						/>
					</div>
				</Tooltip>
				<div className="llms-field-opt-text-wrap">
					<TextControl
						className="llms-field-opt-text"
						value={ item.text }
						onChange={ ( val ) =>
							onChange( { ...item, text: val }, i )
						}
						placeholder={ __( 'Option text', 'lifterlms' ) }
					/>
					{ showKeys && (
						<TextControl
							className="llms-field-opt-text"
							value={ item.key }
							onChange={ ( val ) =>
								onChange( { ...item, key: val }, i )
							}
							placeholder={ __( 'Saved value', 'lifterlms' ) }
						/>
					) }
				</div>
				<div className="llms-del-field-opt-wrap">
					<Button
						style={ { flex: 1 } }
						icon="trash"
						label={ __( 'Delete Option', 'lifterlms' ) }
						onClick={ () => {
							onRemove( i );
						} }
						tabIndex="-1"
						isSmall
					/>
				</div>
			</li>
		);
	}
);

/**
 * Inspector "Options" component
 *
 * Used to CRUD options for select, checkboxes, and radio field blocks.
 *
 * @since 1.6.0
 */
export default class InspectorFieldOptions extends Component {
	/**
	 * Constructor
	 *
	 * @since 1.6.0
	 *
	 * @return {void}
	 */
	constructor() {
		super( ...arguments );

		const { options } = this.props.attributes;

		this.state = {
			showKeys: false,
			items: options,
		};
	}

	/**
	 * Called when sorting completes, updates options order.
	 *
	 * @since 1.6.0
	 *
	 * @param {number} options
	 * @param {number} options.oldIndex The option's previous index.
	 * @param {number} options.newIndex The option's new index.
	 * @return {void}
	 */
	onSortEnd = ( { oldIndex, newIndex } ) => {
		this.updateOptions( arrayMove( this.state.items, oldIndex, newIndex ) );
	};

	/**
	 * Update options
	 *
	 * @since 1.6.0
	 *
	 * @param {Object[]} options Options array.
	 * @return {void}
	 */
	updateOptions = ( options ) => {
		const { setAttributes } = this.props;

		setAttributes( { options } );
		this.setState( { items: options } );
	};

	/**
	 * Component render
	 *
	 * @since 1.6.0
	 *
	 * @return {BaseControl} Component HTML fragment.
	 */
	render() {
		const { attributes, setAttributes } = this.props,
			{ id, field } = attributes,
			{ showKeys } = this.state;

		let { options } = attributes;

		options = cloneDeep( options );

		/**
		 * Add a new option.
		 *
		 * @since 1.6.0
		 * @since 1.12.0 Newly created options will be the default for radio and selects.
		 *              Added default text and keys when adding a new option.
		 *
		 * @return {void}
		 */
		const addOption = () => {
			const count = options.length;

			let isDefault = 'no';
			if ( [ 'radio', 'select' ].includes( field ) ) {
				isDefault = count ? 'no' : 'yes';
			}

			onOptionChange(
				{
					// Translators: %d = Option index in the list of options.
					text: sprintf( __( 'Option %d', 'lifterlms' ), count + 1 ),
					// Translators: %d = Option index in the list of options.
					key: sprintf( __( 'option_%d', 'lifterlms' ), count + 1 ),
					default: isDefault,
				},
				options.length
			);
		};

		/**
		 * Delete an existing option
		 *
		 * @since 1.6.0
		 * @since 1.12.0 When deleting a default option, set the first item as the new default.
		 *
		 * @param {number} index Index of the deleted option.
		 * @return {void}
		 */
		const removeOption = ( index ) => {
			const wasDefault = 'yes' === options[ index ].default,
				newOptions = options.filter( ( opt, i ) => i !== index );

			// If it was the default option and there's at least one option left make the first item in the list the new default.
			if ( wasDefault && newOptions.length ) {
				newOptions[ 0 ].default = 'yes';
			}

			setAttributes( { options: newOptions } );
		};

		/**
		 * Callback when options are changed.
		 *
		 * @since 1.6.0
		 * @since [version] Pass an id to <BaseControl>
		 *
		 * @param {Object}  option Option data.
		 * @param {number} index  Option index.
		 * @return {void}
		 */
		const onOptionChange = ( option, index ) => {
			const prevOption = options[ index ] ? options[ index ] : false;

			options[ index ] = option;
			this.updateOptions( options );

			// When setting an option as the "default", set all other options to not be the default.
			if (
				'yes' === option.default &&
				prevOption &&
				prevOption.default !== option.default
			) {
				options.forEach( ( opt, i ) => {
					if ( i !== index ) {
						onOptionChange( { ...opt, default: 'no' }, i );
					}
				} );
			}
		};

		return (
			<BaseControl id={ id } label={ __( 'Options', 'lifterlms' ) }>
				<OptionsList
					items={ options }
					onSortEnd={ this.onSortEnd }
					useDragHandle={ true }
					helperClass="llms-sort-helper"
					onChange={ onOptionChange }
					onRemove={ removeOption }
					showKeys={ showKeys }
				/>

				<Button
					isDefault
					onClick={ () => {
						addOption();
					} }
				>
					{ __( 'Add option', 'lifterlms' ) }
				</Button>

				<Button
					isTertiary
					onClick={ () => this.setState( { showKeys: ! showKeys } ) }
				>
					{ showKeys
						? __( 'Hide keys', 'lifterlms' )
						: __( 'Show keys', 'lifterlms' ) }
				</Button>
			</BaseControl>
		);
	}
}
