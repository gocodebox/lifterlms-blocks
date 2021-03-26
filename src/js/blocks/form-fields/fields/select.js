/**
 * BLOCK: llms/form-field-select
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support and default options.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import { default as getDefaultSettings, getDefaultPostTypes } from '../settings';
import icon from '../../../icons/field-select';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-select';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const postTypes = getDefaultPostTypes();

/**
 * Is this a default or composed field?
 *
 * Composed fields serve specific functions (like the User Email Address field)
 * and are automatically added to the form builder UI.
 *
 * Default (non-composed) fields can be added by developers to perform custom functions
 * and are not registered as a block by default.
 *
 * @type {string}
 */
const composed = false;

// Setup the field settings.
const settings = getDefaultSettings();

settings.title = __( 'Dropdown', 'lifterlms' );
settings.description = __(
	'A select field which can be populated with any number of options.',
	'lifterlms'
);

settings.icon.src = icon;

settings.attributes.field.__default = 'select';
settings.attributes.options.__default = [
	{
		default: 'yes',
		text: __( 'Option 1', 'lifterlms' ),
	},
	{
		default: 'no',
		text: __( 'Option 2', 'lifterlms' ),
	},
];

settings.supports.llms_field_inspector.options = true;
settings.supports.llms_field_inspector.placeholder = true;

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'llms/form-field-checkboxes', 'llms/form-field-radio' ],
			transform: ( attributes ) =>
				createBlock( name, {
					...attributes,
					field: settings.attributes.field.__default,
				} ),
		},
	],
};

export { name, postTypes, composed, settings };
