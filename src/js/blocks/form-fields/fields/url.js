/**
 * BLOCK: llms/form-field-url
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import getDefaultSettings from '../settings';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-url';

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

settings.title       = __( 'Website / URL', 'lifterlms' );
settings.description = __( 'An input field which accepts and web addresses.', 'lifterlms' );

settings.icon.src = 'admin-links';

settings.attributes.field.__default = 'url';

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [
				'llms/form-field-password',
				'llms/form-field-email',
				'llms/form-field-number',
				'llms/form-field-phone',
				'llms/form-field-text',
				'llms/form-field-textarea',
			],
			transform: ( attributes ) => createBlock( name, { ...attributes, field: settings.attributes.field.__default } ),
		},
	],
}

export {
	name,
	post_types,
	composed,
	settings,
};

