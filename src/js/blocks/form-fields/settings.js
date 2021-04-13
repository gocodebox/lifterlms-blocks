/**
 * Default settings for registering a field block.
 *
 * @since 1.6.0
 * @since 1.7.0 Unknown.
 * @since 1.8.0 Updated lodash imports.
 * @since 1.12.0 Add support for data stores & default examples object.
 */

// WP Deps.
import { select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

// External Deps.
import { cloneDeep, merge } from 'lodash';

// Internal Deps.
import { editField, editGroup } from './edit';
import { saveField, saveGroup } from './save';


const settingsBase = {

	apiVersion: 2,

	icon: {
		foreground: '#466dd8',
	},

	category: 'llms-user-info-fields',

	keywords: [ __( 'LifterLMS', 'lifterlms' ), 'llms' ],

	attributes: {},

	supports: {
		llms_visibility: true,
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
	 * @return {void}
	 */
	fillInspectorControls( attributes, setAttributes, props ) {}, // eslint-disable-line no-unused-vars

	fillEditAfter( attributes, setAttributes, props ) {},

};

const settingsField = {
	attributes: {
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

		columns: {
			type: 'integer',
			__default: 12,
		},
		last_column: {
			type: 'boolean',
			__default: true,
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
			__default: 'usermeta',
		},

		data_store_key: {
			type: 'string',
			__default: '',
		},

		html_attrs: {
			type: 'object',
			__default: {},
		},

		isConfirmationField: {
			type: 'boolean',
			__default: false,
		},
		isConfirmationControlField: {
			type: 'boolean',
			__default: false,
		},
	},
	supports: {
		llms_field_inspector: {
			id: true,
			name: true,
			options: false,
			placeholder: false,
			required: true,
			customFill: false,
			storage: true,
		},
		llms_edit_fill: {
			after: false,
		},
		llms_field_group: false,
	},
	edit: editField,
	save: saveField,
};

const settingsGroup = {
	attributes: {
		fieldLayout: {
			type: 'string',
			default: 'columns',
		},
	},
	supports: {
		llms_field_group: true,
		llms_field_inspector: false,
	},
	providesContext: {
		'llms/fieldGroup/fieldLayout': 'fieldLayout',
	},
	llmsInnerBlocks: {
		template: [],
		allowed: [],
		lock: 'insert',
	},
	edit: editGroup,
	save: saveGroup,
};



/**
 * Retrieve a copy of the default settings object
 *
 * @since Unknown
 *
 * @return {Object} A settings object.
 */
export default ( type = 'field' ) => {

	const addSettings = 'field' === type ? settingsField : settingsGroup;

	return merge(
		{},
		cloneDeep( settingsBase ),
		addSettings
	);
};

/**
 * Retrieve a copy of an array of default post types that support fields
 *
 * @since [version]
 *
 * @return {string[]} Array of post type names.
 */
export function getDefaultPostTypes() {
	return cloneDeep( [ 'llms_form', 'wp_block' ] );
}

export function getSettingsFromBase( baseSettings, overrides = {}, exclude = [] ) {

	baseSettings = cloneDeep( baseSettings );
	for ( let i = 0; i < exclude.length; i++ ) {
		delete baseSettings[ exclude[ i ] ];
	}

	return merge(
		{},
		baseSettings,
		overrides
	);

}

export function getDefaultOptionsArray( count = 2, defaults = 1 ) {

	const opts = [];

	for ( let i = 1; i <= count; i++ ) {

		opts.push( {
			default: defaults && defaults > 0 ? 'yes' : 'no',
			text: sprintf( __( 'Option %d', 'lifterlms' ), i ),
			key: sprintf( __( 'option_%d', 'lifterlms' ), i )
		} );

		defaults--;

	}

	return opts;

}
