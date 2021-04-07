/**
 * BLOCK: llms/form-field-text
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import {
	default as getDefaultSettings,
	getDefaultPostTypes,
} from '../settings';
import defaultIcon from '../../../icons/field-text';
import numberIcon from '../../../icons/field-number';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-text';

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

settings.title = __( 'Text', 'lifterlms' );
settings.description = __( 'A simple text input field.', 'lifterlms' );

settings.icon.src = defaultIcon;

settings.variations = [
	{
		name: 'text',
		title: __( 'Text', 'lifterlms' ),
		description: __( 'An input field which accepts any form of text.', 'lifterlms' ),
		isDefault: true,
		icon: defaultIcon
	},
	{
		name: 'email',
		title: __( 'Email', 'lifterlms' ),
		description: __( 'A text input field which only accepts an email address.', 'lifterlms' ),
		icon:  'email-alt',
	},
	{
		name: 'password',
		title: __( 'Password', 'lifterlms' ),
		description: __( 'User password confirmation field.', 'lifterlms' ),
		icon:  'lock',
		scope: [],
	},
	{
		name: 'number',
		title: __( 'Number', 'lifterlms' ),
		description: __( 'An input field which only accepts numeric input.', 'lifterlms' ),
		icon: numberIcon,
		attributes: {
			html_attrs: {
				min: '',
				max: '',
			},
		},
	},
	{
		name: 'tel',
		title: __( 'Phone Number', 'lifterlms' ),
		description: __( 'An input field which only accepts phone numbers.', 'lifterlms' ),
		icon: 'phone',
	},
	{
		name: 'url',
		title: __( 'Website Address / URL', 'lifterlms' ),
		description: __( 'An input field which only accepts a website address or URL.', 'lifterlms' ),
		icon: 'admin-links',
	},
];

settings.usesContext = [
	'llms/fieldGroup/fieldLayout',
];

settings.supports.llms_field_inspector.customFill = 'fieldTextAdditionalControls';

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since [version]
 *
 * @param {Object} attributes Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @return {Fragment} Component HTML Fragment.
 */
settings.fillInspectorControls = ( attributes, setAttributes ) => {

	if ( attributes.isConfirmationField || 'number' !== attributes.field ) {
		return;
	}

	// Add min/max options to a number field.
	const { html_attrs } = attributes,
		{ min, max } = html_attrs;

	return (
		<Fragment>
			<TextControl
				label={ __( 'Minimum Value', 'lifterlms' ) }
				help={ __(
					'Specify the minimum allowed value. Leave blank for no minimum.',
					'lifterlms'
				) }
				value={ min }
				type="number"
				onChange={ ( min ) =>
					setAttributes( { html_attrs: { ...html_attrs, min } } )
				}
			/>

			<TextControl
				label={ __( 'Maximum Value', 'lifterlms' ) }
				help={ __(
					'Specify the maximum allowed value. Leave blank for no maximum.',
					'lifterlms'
				) }
				value={ max }
				type="number"
				onChange={ ( max ) =>
					setAttributes( { html_attrs: { ...html_attrs, max } } )
				}
			/>
		</Fragment>
	);
};



// Add some data to all variations.
settings.variations.forEach( ( variation ) => {

	// Setup scope.
	variation.scope = variation.scope || [ 'block', 'inserter', 'transform' ];

	// Update the icon (add the default foreground color.
	variation.icon = {
		...settings.icon,
		src: variation.icon
	};

	// Add a "field" attribute based off the variation name.
	if ( ! variation.attributes ) {
		variation.attributes = {};
	}
	variation.attributes.field = variation.name;

	// Add an isActive function.
	variation.isActive = ( blockAttributes, variationAttributes ) =>
		blockAttributes.field ===
		variationAttributes.field;
} );

export { name, postTypes, composed, settings };
