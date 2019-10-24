/**
 * BLOCK: llms/form-field-phone
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const { __ } = wp.i18n;

// Internal Deps.
import getDefaultSettings from '../settings';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-phone';

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

settings.title       = __( 'Phone', 'lifterlms' );
settings.description = __( 'An input that accepts and validates telephone numbers.', 'lifterlms' );

settings.attributes.field.__default = 'tel';

settings.icon.src = 'phone';

export {
	name,
	post_types,
	composed,
	settings,
};

