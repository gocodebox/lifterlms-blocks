/**
 * BLOCK: llms/form-field-user-password-confirm
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
import { settings as userPasswordSettings } from './user-password';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-password-confirm';

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
let settings = cloneDeep( userPasswordSettings );

settings.title       = __( 'User Password (confirmation)', 'lifterlms' );
settings.description = __( 'A special field used to collect a user\'s account password.', 'lifterlms' );

settings.attributes.id.__default         = 'password_confirm';
settings.attributes.label.__default      = __( 'Confirm Password', 'lifterlms' );
settings.attributes.name.__default       = 'password_confirm';
settings.attributes.match.__default      = 'password';
settings.attributes.data_store.__default = false;

export {
	name,
	post_types,
	composed,
	settings,
};
