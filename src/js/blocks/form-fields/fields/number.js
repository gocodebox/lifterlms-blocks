/**
 * BLOCK: llms/form-field-number
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
import icon from '../../../icons/field-number';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-number';

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

settings.title = __( 'Number', 'lifterlms' );
settings.description = __(
	'An input field which accepts numbers.',
	'lifterlms'
);

settings.supports.llms_field_inspector.customFill = 'fieldNumber';

settings.icon.src = icon;

settings.attributes.field.__default = 'number';

settings.attributes.attributes = {
	type: 'object',
	__default: {
		min: '',
		max: '',
	},
};

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since 1.6.0
 *
 * @param {Object} attributes Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @return {Fragment} Component HTML Fragment.
 */
settings.fillInspectorControls = ( attributes, setAttributes ) => {
	const { min, max } = attributes.attributes;

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
				onChange={ ( val ) =>
					setAttributes( { attributes: { min: val, max } } )
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
				onChange={ ( val ) =>
					setAttributes( { attributes: { min, max: val } } )
				}
			/>
		</Fragment>
	);
};

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [
				'llms/form-field-email',
				'llms/form-field-password',
				'llms/form-field-phone',
				'llms/form-field-text',
				'llms/form-field-textarea',
				'llms/form-field-url',
			],
			transform: ( attributes ) =>
				createBlock( name, {
					...attributes,
					field: settings.attributes.field.__default,
				} ),
		},
	],
};

export { name, postTypes, composed, settings };
