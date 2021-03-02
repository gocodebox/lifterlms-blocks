/**
 * BLOCK: llms/form-field-radio
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support and default options.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import getDefaultSettings from '../settings';
import icon from '../../../icons/field-radio';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-radio';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const postTypes = [ 'llms_form' ];

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

settings.title = __( 'Radio', 'lifterlms' );
settings.description = __(
	'A group of radio inputs which can be populated with any number of options.',
	'lifterlms'
);

settings.icon.src = icon;

settings.attributes.field.__default = 'radio';
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

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'llms/form-field-radio', 'llms/form-field-select' ],
			transform: ( attributes ) =>
				createBlock( name, {
					...attributes,
					field: settings.attributes.field.__default,
				} ),
		},
	],
};

export { name, postTypes, composed, settings };
