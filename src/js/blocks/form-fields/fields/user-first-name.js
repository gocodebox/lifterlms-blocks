/**
 * BLOCK: llms/form-field-user-first-name
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 * @since 1.12.0 Add data store support.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as textSettings, postTypes } from './text';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-user-first-name';

/**
 * Is this a default or composed field?
 *
 * Composed fields serve specific functions (like the User Email Address field)
 * and are automatically added to the form builder UI.
 *
 * Default (non-composed) fields can be added by developers to perform custom functions
 * and are not registered as a block by default
 *
 * @type {string}
 */
const composed = true;

// Setup the field settings.
const settings = cloneDeep( textSettings );

settings.title = __( 'User First Name', 'lifterlms' );
settings.description = __(
	"A special field used to collect a user's first name.",
	'lifterlms'
);

settings.icon.src = 'admin-users';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.match = false;
settings.supports.llms_field_inspector.storage = false;

settings.attributes.id.__default = 'first_name';
settings.attributes.label.__default = __( 'First Name', 'lifterlms' );
settings.attributes.name.__default = 'first_name';
settings.attributes.required.__default = true;

delete settings.transforms;

export { name, postTypes, composed, settings };
