/**
 * Default settings for registering a field block.
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const
	{ getBlockType } = wp.blocks,
	{ Fill }         = wp.components,
	{ Fragment }     = wp.element,
	{ doAction }     = wp.hooks,
	{ __ }           = wp.i18n;

// External Deps.
import cloneDeep from 'lodash/clonedeep';
import snakeCase from 'lodash/snakecase';
import kebabCase from 'lodash/kebabcase';
import uniqueId from 'lodash/uniqueid';

// Internal Deps.
import Field from './field';
import Inspector from './inspect';
import { isUnique } from './checks';

const generateName = ( name ) => {
	return snakeCase( uniqueId( `${name}_field_` ) );
}

const generateId = ( name ) => {
	return kebabCase( name );
}

const setup_atts = ( atts, block_atts ) => {

	Object.keys( block_atts ).forEach( ( key ) => {
		const default_val = block_atts[ key ].__default;
		if ( 'undefined' !== typeof default_val && 'undefined' === typeof atts[ key ] ) {
			atts[ key ] = default_val;
		}
	} );

	if ( ! atts.name ) {
		let name = generateName( atts.field );
		while ( ! isUnique( 'name', name ) ) {
			name = generateName( atts.field );
		};
		atts.name = name;
	}

	if ( ! atts.id ) {
		let id = generateId( atts.name );
		while ( ! isUnique( 'id', id ) ) {
			id = generateId( uniqueId( `${atts.field}-field-` ) );
		};
		atts.id = id;

	}

	return atts;

};

const attributes = {

	description: {
		type: 'string',
		__default: '',
	},

	field: {
		type: 'string',
		__default: 'text',
	},

	required: {
		type: 'boolean',
		__default: false,
	},

	label: {
		type: 'string',
		__default: '',
	},

	label_show_empty: {
		type: 'string',
		__default: false,
	},

	match: {
		type: 'string',
		__default: '',
	},

	options: {
		type: 'array',
		__default: [],
	},

	options_preset: {
		type: 'string',
		__default: '',
	},

	placeholder: {
		type: 'string',
		__default: '',
	},

	name: {
		type: 'string',
		__default: '',
	},

	id: {
		type: 'string',
		__default: '',
	},

};

const settings = {

	icon: {
		foreground: '#2295ff',
	},
	category: 'llms-fields',
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],
	attributes: attributes,
	supports: {
		llms_visibility: true,
		llms_field_inspector: {
			id: true,
			match: true,
			name: true,
			options: false,
			placeholder: false,
			required: true,
			customFill: false,
		},
	},

	/**
	 * Render controls to be rendered into the LLMSFieldInspectorControls slot.
	 *
	 * This stub can be overwritten when registering a new field block. It should return
	 * a <Fragment> containing controls any custom controls and HTML for the block.
	 *
	 * @since 1.6.0
	 *
	 * @param {Object} attributes Block attributes.
	 * @param {Function} setAttributes Reference to the block's setAttributes() function.
	 * @param {Object} props Original properties object passed to the block's edit() function.
	 * @return {Void}
	 */
	fillInspectorControls: function( attributes, setAttributes, props ) {},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @since   1.0.0
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 */
	edit: function( props ) {

		const
			{ name } = props,
			block = getBlockType( name ),
			{
				clientId,
				blockSettings,
				setAttributes,
			} = props,
			inspectorSupports = blockSettings.supports.llms_field_inspector,
			{
				fillInspectorControls,
				fillAdvancedInspectorControls,
			} = blockSettings;

		let { attributes } = props;
		attributes = setup_atts( attributes, block.attributes );

		return (
			<Fragment>
				<Inspector { ...{ attributes, clientId, name, setAttributes, inspectorSupports } } />
				<Field { ...{ attributes, setAttributes } } />
				{ inspectorSupports.customFill && (
					<Fill name={ `llmsInspectorControlsFill.${ inspectorSupports.customFill }` }>{ fillInspectorControls( attributes, setAttributes, props ) }</Fill>
				) }
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @since   1.0.0
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 */
	save: function( props ) {

		const { attributes } = props;
		return attributes;

	},
};

export default () => {
	return cloneDeep( settings );
};
