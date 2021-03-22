/**
 * BLOCK: llms/form-field-password-strength-meter
 *
 * @since 1.6.0
 * @since 1.12.0 Add data store support.
 */

/* eslint camelcase: [ "error", { allow: [ "min_*" ] } ] */

// WP Deps.
import { SelectControl, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

// Internal Deps.
import getDefaultSettings from '../settings';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-password-strength-meter';

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
const composed = true;

// Setup the field settings.
const settings = getDefaultSettings();

settings.title = __( 'Password Strength Meter', 'lifterlms' );
settings.description = __(
	'Combine with a password field to help users create strong passwords.',
	'lifterlms'
);

settings.icon.src = 'dashboard';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.match = false;
settings.supports.llms_field_inspector.required = false;
settings.supports.llms_field_inspector.customFill = 'passwordStrengthMeter';
settings.supports.llms_field_inspector.storage = false;

settings.attributes.field.__default = 'html';
settings.attributes.id.__default = 'llms-password-strength-meter';
settings.attributes.description.__default = sprintf(
	// Translators: %1$s = password minimum strength merge code; %2$s = password minimum length merge code.
	__(
		'A %1$s password is required. The password must be at least %2$s characters in length. Consider adding letters, numbers, and symbols to increase the password strength.',
		'lifterlms'
	),
	'{min_strength}',
	'{min_length}'
);
settings.attributes.data_store.__default = false;

settings.attributes.min_strength = {
	type: 'string',
	__default: 'strong',
};
settings.attributes.min_length = {
	type: 'integer',
	__default: 6,
};

delete settings.transforms;

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since 1.6.0
 *
 * @param {Object} attributes Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @return {Fragment} Component HTML fragment.
 */
settings.fillInspectorControls = ( attributes, setAttributes ) => {
	const { min_strength, min_length } = attributes;

	return (
		<Fragment>
			<SelectControl
				label={ __( 'Minimum Password Strength', 'lifterlms' ) }
				help={ __(
					'Display in the meter description with: {min_strength}.',
					'lifterlms'
				) }
				value={ min_strength }
				onChange={ ( min_strength ) =>
					setAttributes( { min_strength } )
				}
				options={ [
					{ value: 'strong', label: __( 'Strong', 'lifterlms' ) },
					{ value: 'medium', label: __( 'Medium', 'lifterlms' ) },
					{ value: 'weak', label: __( 'Weak', 'lifterlms' ) },
				] }
			/>

			<TextControl
				label={ __( 'Minimum Password Length', 'lifterlms' ) }
				help={ __(
					'Display in the meter description with: {min_length}.',
					'lifterlms'
				) }
				value={ min_length }
				type="number"
				min="6"
				onChange={ ( min_length ) =>
					setAttributes( { min_length: min_length * 1 } )
				}
			/>
		</Fragment>
	);
};

/**
 * The save function defines the way in which the different attributes should be combined
 * into the final markup, which is then serialized by Gutenberg into post_content.
 *
 * The "save" property must be specified and must be a valid function.
 *
 * @since 1.6.0
 *
 * @param {Object} props Block properties.
 * @return {Object} Block attributes object.
 */
settings.save = ( props ) => {
	const { attributes } = props;

	if ( ! attributes.className ) {
		attributes.className = '';
	}

	if (
		-1 === attributes.className.indexOf( 'llms-password-strength-meter' )
	) {
		attributes.className += ' llms-password-strength-meter';
		attributes.className = attributes.className.trim();
	}

	return attributes;
};

export { name, postTypes, composed, settings };
