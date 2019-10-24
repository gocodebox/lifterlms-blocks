/**
 * BLOCK: llms/form-field-password
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const { __, sprintf } = wp.i18n;

// Internal Deps.
import getDefaultSettings from '../settings';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-password';

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

settings.title       = __( 'Password', 'lifterlms' );
settings.description = __( 'A password input field.', 'lifterlms' );

settings.icon.src = 'lock';

settings.attributes.field.__default = 'password';

export {
	name,
	post_types,
	composed,
	settings,
};

