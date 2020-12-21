/**
 * BLOCK: llms/form-field-textarea
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

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-textarea';

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

settings.title       = __( 'Paragraph Text', 'lifterlms' );
settings.description = __( 'A textarea input.', 'lifterlms' );

settings.supports.llms_field_inspector.customFill = 'fieldTextarea';

settings.icon.src = 'editor-paragraph';

settings.attributes.field.__default = 'textarea';

settings.attributes.attributes = {
	type: 'object',
	__default: {
		rows: 4,
	}
};

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since [version]
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @param {Object}   props         Original properties object passed to the block's edit() function.
 * @return {Fragment}
 */
settings.fillInspectorControls = ( attributes, setAttributes, props ) => {

	return (
		<Fragment>
			<TextControl
				label={ __( 'Rows', 'lifterlms' ) }
				help={ __( 'Specify the number of text rows for the textarea input.', 'lifterlms' ) }
				value={ attributes.attributes.rows }
				type="number"
				onChange={ rows => setAttributes( { attributes: { rows } } ) }
				min="2"
				step="1"
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

