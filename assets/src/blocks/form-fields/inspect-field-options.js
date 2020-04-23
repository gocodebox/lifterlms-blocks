/**
 * Inspector settings component for managing a field's options
 *
 * Used on Radios, Checkboxes, and Selects
 *
 * @since 1.6.0
 * @since [version] Updated lodash imports.
 */

const
	{
		Button,
		BaseControl,
		IconButton,
		TextControl,
		Tooltip,
		RadioControl,
	}                  = wp.components,
	{ withInstanceId } = wp.compose,
	{ Component}       = wp.element,
	{ __ }             = wp.i18n;

// External Deps.
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';

import { cloneDeep } from 'lodash';

const arrayMove = ( array, from, to ) => {
	array = array.slice();
	array.splice( to < 0 ? array.length + to : to, 0, array.splice( from, 1 )[ 0 ] );
	return array;
};

const DragHandle = SortableHandle( () => <span className="llms-drag-handle" style={ { cursor: 'grab' } }>:::</span> )

const OptionsList = SortableContainer( ( { items, onChange, onRemove, showKeys } ) => {

	return (
		<ul className="llms-field-options">
			{ items.map( ( option, index ) => (
				<OptionItem
					key={ `option-item-${index}` }
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
} );

const OptionItem = SortableElement( ( { item, i, onChange, onRemove, showKeys } ) => {

	return (
		<li className="llms-field-option">
			<DragHandle />
			<RadioControl
				className="llms-field-opt-default"
				selected={ item.default }
				onChange={ ( val ) => { onChange( { ...item, default: val }, i ) } }
				options={ [ { label: '', value: 'yes' } ] }
				tabIndex="-1"
			/>
			<div className="llms-field-opt-text-wrap">
				<TextControl
					className="llms-field-opt-text"
					value={ item.text }
					onChange={ ( val ) => onChange( { ...item, text: val }, i ) }
					placeholder={ __( 'Option text', 'lifterlms' ) }
				/>
				{ showKeys && (
					<TextControl
						className="llms-field-opt-text"
						value={ item.key }
						onChange={ ( val ) => onChange( { ...item, key: val }, i ) }
						placeholder={ __( 'Saved value', 'lifterlms' ) }
					/>
				) }
			</div>
			<div className="llms-del-field-opt-wrap">
				<IconButton
					style={ { flex: 1 } }
					icon="dismiss"
					label={ __( 'Delete', 'lifterlms' ) }
					onClick={ () => { onRemove( i ) } }
					tabIndex="-1"
				/>
			</div>
		</li>
	);

} )

export default class InspectorFieldOptions extends Component {

	constructor() {

		super( ...arguments );

		const { options } = this.props.attributes;

		this.state = {
			showKeys: false,
			items: options,
		};

	};

	onSortEnd = ( { oldIndex, newIndex } ) => {

		this.updateOptions( arrayMove( this.state.items, oldIndex, newIndex ) );

	};

	updateOptions = ( options ) => {

		const { setAttributes } = this.props;

		setAttributes( { options } );
		this.setState( { items: options } );

	};

	render() {

		const
			{
				attributes,
				setAttributes,
			}               = this.props,
			{ field, placeholder } = attributes,
			{ showKeys }    = this.state;

		let
			{
				options,
			} = attributes;

		options = cloneDeep( options );

		const addOption = () => {

			let isDefault = 'no';
			if ( 'select' === field ) {
				isDefault = options.length ? 'no' : 'yes'
			}

			onOptionChange (
				{
					text: '',
					default: isDefault,
				},
				options.length
			);

		};

		const removeOption = ( index ) => {

			const newOptions = options.filter( ( opt, i ) => i !== index );
			setAttributes( { options: newOptions } );

		};

		const onOptionChange = ( option, index ) => {

			const prevOption = options[ index ] ? options[ index ] : false;

			options[ index ] = option;
			this.updateOptions( options );

			// When setting an option as the "default", set all other options to not be the default.
			if ( 'yes' === option.default && prevOption && prevOption.default !== option.default ) {
				options.forEach( ( opt, i ) => {
					if ( i !== index ) {
						onOptionChange( { ...opt, default: 'no' }, i );
					}
				} );
			}

		};

		return (
			<BaseControl label={ __( 'Options', 'lifterlms' ) } >

				<OptionsList
					items={ options }
					onSortEnd={ this.onSortEnd }
					useDragHandle={ true }
					helperClass="llms-sort-helper"
					onChange={ onOptionChange }
					onRemove={ removeOption }
					showKeys={ showKeys }
				/>

				<Button isDefault onClick={ () => { addOption() } }>
					{ __( 'Add option', 'lifterlms' ) }
				</Button>

				<Button isTertiary onClick={ () => this.setState( { showKeys: ! showKeys } ) }>
					{ showKeys ? __( 'Hide keys', 'lifterlms' ) : __( 'Show keys', 'lifterlms' ) }
				</Button>

			</BaseControl>
		);

	}

};

