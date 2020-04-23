/**
 * BLOCK: llms/form-field-user-password-current
 *
 * @since 1.7.1
 * @since [version] Updated lodash imports.
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as userPasswordSettings } from './user-password';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-password-current';

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

settings.title       = __( 'User Password (current)', 'lifterlms' );
settings.description = __( 'A special field used to validate the user\'s current password during a password change attempt.', 'lifterlms' );

settings.attributes.id.__default    = 'password_current';
settings.attributes.label.__default = __( 'Current Password', 'lifterlms' );
settings.attributes.name.__default  = 'password_current';

delete settings.attributes.match.__default;

export {
	name,
	post_types,
	composed,
	settings,
};
