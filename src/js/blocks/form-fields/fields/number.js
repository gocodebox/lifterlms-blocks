/**
 * BLOCK: llms/form-field-number
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const
	{
		TextControl,
	}               = wp.components,
	{
		Component,
		Fragment,
	}               = wp.element,
	{ __, sprintf } = wp.i18n;

// Internal Deps.
import getDefaultSettings from '../settings';
import icon from '../../../icons/field-number';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-number';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const post_types = [ 'llms_form' ];

/**
 * Is this a default or composed field?
 *
 * Composed fields serve specific functions (like the User Email Address field)
 * and are automatically added to the form builder UI.
 *
 * Default (non-composed) fields can be added by developers to perform custom functions
 * and are not registered as a block by default.
 *
 * @type {String}
 */
const composed = false;

// Setup the field settings.
let settings = getDefaultSettings();

settings.title       = __( 'Number', 'lifterlms' );
settings.description = __( 'An input field which accepts numbers.', 'lifterlms' );

settings.supports.llms_field_inspector.customFill = 'fieldNumber';

settings.icon.src = icon;

settings.attributes.field.__default = 'number';

settings.attributes.attributes = {
	type: 'object',
	__default: {
		min: '',
		max: '',
	}
};

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since 1.6.0
 *
 * @param {Object} attributes Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @param {Object} props Original properties object passed to the block's edit() function.
 * @return {Fragment}
 */
settings.fillInspectorControls = ( attributes, setAttributes, props ) => {

	const { min, max } = attributes.attributes;

	return (
		<Fragment>

			<TextControl
				label={ __( 'Minimum Value', 'lifterlms' ) }
				help={ __( 'Specify the minimum allowed value. Leave blank for no minimum.', 'lifterlms' ) }
				value={ min }
				type="number"
				onChange={ val => setAttributes( { attributes: { min: val, max: max } } ) }
			/>

			<TextControl
				label={ __( 'Maximum Value', 'lifterlms' ) }
				help={ __( 'Specify the maximum allowed value. Leave blank for no maximum.', 'lifterlms' ) }
				value={ max }
				type="number"
				onChange={ val => setAttributes( { attributes: { min: min, max: val } } ) }
			/>

		</Fragment>
	);

};

export {
	name,
	post_types,
	composed,
	settings,
};

