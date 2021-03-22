/**
 * BLOCK: llms/form-field-textarea
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support.
 */

// WP Deps.
import { TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import getDefaultSettings from '../settings';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-textarea';

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

settings.title = __( 'Paragraph Text', 'lifterlms' );
settings.description = __( 'A textarea input.', 'lifterlms' );

settings.supports.llms_field_inspector.customFill = 'fieldTextarea';

settings.icon.src = 'editor-paragraph';

settings.attributes.field.__default = 'textarea';

settings.attributes.attributes = {
	type: 'object',
	__default: {
		rows: 4,
	},
};

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since 1.12.0
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @return {Fragment} Component html fragment.
 */
settings.fillInspectorControls = ( attributes, setAttributes ) => {
	return (
		<Fragment>
			<TextControl
				label={ __( 'Rows', 'lifterlms' ) }
				help={ __(
					'Specify the number of text rows for the textarea input.',
					'lifterlms'
				) }
				value={ attributes.attributes.rows }
				type="number"
				onChange={ ( rows ) =>
					setAttributes( { attributes: { rows } } )
				}
				min="2"
				step="1"
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
				'llms/form-field-number',
				'llms/form-field-password',
				'llms/form-field-phone',
				'llms/form-field-text',
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
