/**
 * BLOCK: llms/form-field-user-first-name
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import cloneDeep from 'lodash/clonedeep';

// Internal Deps.
import { settings as textSettings } from './text';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-first-name';

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

settings.title       = __( 'User First Name', 'lifterlms' );
settings.description = __( 'A special field used to collect a user\'s first name.', 'lifterlms' );

settings.icon.src = 'admin-users';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;

settings.attributes.id.__default       = 'first_name';
settings.attributes.label.__default    = __( 'First Name', 'lifterlms' );
settings.attributes.name.__default     = 'first_name';
settings.attributes.required.__default = true;
settings.supports.llms_field_inspector.match = false;

export {
	name,
	post_types,
	composed,
	settings,
};
