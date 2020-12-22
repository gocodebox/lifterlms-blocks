/**
 * Default settings for registering a field block.
 *
 * @since 1.6.0
 * @since 1.7.0 Unknown.
 * @since 1.8.0 Updated lodash imports.
 * @since [version] Add support for data stores & default examples object.
 */

// WP Deps.
const
	{ getBlockType } = wp.blocks,
	{ Fill }         = wp.components,
	{ Fragment }     = wp.element,
	{ doAction }     = wp.hooks,
	{ __ }           = wp.i18n;

// External Deps.
import {
	cloneDeep,
	snakeCase,
	kebabCase,
	uniqueId
} from 'lodash';

// Internal Deps.
import Field from './field';
import Inspector from './inspect';
import { isUnique } from './checks';

/**
 * Generate a unique "name" attribute.
 *
 * @since 1.6.0
 *
 * @param {String} name Base name, generally the field's "field" attribute. EG: "text".
 * @return {String} A unique name, in snake case, suitable to be used as a field's "name" attribute.
 */
const generateName = ( name ) => {
	return snakeCase( uniqueId( `${name}_field_` ) );
}

/**
 * Generate a unique "id" attribute.
 *
 * @since 1.6.0
 *
 * @param {String} name Base name, generally the field's "name" attribute. EG: "text_field_1".
 * @return {String} A unique name, in kebab case, suitable to be used as a field's "id" attribute.
 */
const generateId = ( name ) => {
	return kebabCase( name );
}

/**
 * Sets up block attributes, filling defaults and generating unique values.
 *
 * @since 1.6.0
 * @since [version] Add data_store_key generation.
 *
 * @param {Object} atts      Default block attributes object.
 * @param {Object} blockAtts Actual WP_Block attributes object.
 * @return {Object} Attribute object suitable for use when registering the block.
 */
const setupAtts = ( atts, blockAtts ) => {

	Object.keys( blockAtts ).forEach( ( key ) => {
		const default_val = blockAtts[ key ].__default;
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

	if ( ! atts.data_store_key ) {
		atts.data_store_key = atts.name;
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

	data_store: {
		type: 'string',
		__default: 'usermeta'
	},

	data_store_key: {
		type: 'string',
		__default: '',
	},

};

const settings = {

	icon: {
		foreground: '#466dd8',
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
			storage: true,
		},
	},
	example: {},

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
	 * @since 1.6.0
	 * @since 1.7.0 Backwards compatibility fixes for WP Core 5.2 and earlier.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	edit: function( props ) {

		const
			{ name } = props,
			block = getBlockType( name ),
			{
				clientId,
				setAttributes,
			} = props,
			inspectorSupports = block.supports.llms_field_inspector,
			{ fillInspectorControls } = block;

		let { attributes } = props;
		attributes = setupAtts( attributes, block.attributes );

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
	 * @since 1.6.0
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Block properties.
	 * @return {Function}
	 */
	save: function( props ) {

		const { attributes } = props;
		return attributes;

	},
};

export default () => {
	return cloneDeep( settings );
};
