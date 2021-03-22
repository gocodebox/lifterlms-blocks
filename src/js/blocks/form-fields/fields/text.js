/**
 * BLOCK: llms/form-field-text
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import getDefaultSettings from '../settings';
import icon from '../../../icons/field-text';

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

settings.title = __( 'Text', 'lifterlms' );
settings.description = __( 'A simple text input field.', 'lifterlms' );

settings.icon.src = icon;

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [
				'llms/form-field-email',
				'llms/form-field-password',
				'llms/form-field-phone',
				'llms/form-field-number',
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
