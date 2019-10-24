/**
 * BLOCK: llms/form-field-user-email-confirm
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import cloneDeep from 'lodash/clonedeep';

// Internal Deps.
import { settings as userEmailSettings } from './user-email';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-email-confirm';

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
let settings = cloneDeep( userEmailSettings );

settings.title       = __( 'User Email (confirmation)', 'lifterlms' );
settings.description = __( 'A special field used to confirm a user\'s account email address.', 'lifterlms' );

settings.attributes.id.__default    = 'email_address_confirm';
settings.attributes.label.__default = __( 'Confirm Email Address', 'lifterlms' );
settings.attributes.name.__default  = 'email_address_confirm';
settings.attributes.match.__default = 'email_address';

export {
	name,
	post_types,
	composed,
	settings,
};
