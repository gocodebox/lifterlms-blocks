/**
 * BLOCK: llms/form-field-user-address
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 * @since 1.12.0 Add data store support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as textSettings } from './text';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-address';

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
 * and are not registered as a block by default
 *
 * @type {String}
 */
const composed = true;

// Setup the field settings.
let settings = cloneDeep( textSettings );

settings.title       = __( 'User Address', 'lifterlms' );
settings.description = __( 'A special field used to collect a user\'s billing street address.', 'lifterlms' );

settings.icon.src = 'location';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id      = false;
settings.supports.llms_field_inspector.name    = false;
settings.supports.llms_field_inspector.match   = false;
settings.supports.llms_field_inspector.storage = false;

settings.attributes.id.__default       = 'llms_billing_address_1';
settings.attributes.label.__default    = __( 'Address', 'lifterlms' );
settings.attributes.name.__default     = 'llms_billing_address_1';
settings.attributes.required.__default = true;

delete settings.transforms;

export {
	name,
	post_types,
	composed,
	settings,
};
