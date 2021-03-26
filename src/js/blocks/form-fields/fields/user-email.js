/**
 * BLOCK: llms/form-field-user-email
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
import { settings as emailSettings, postTypes } from './email';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-user-email';

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
const settings = cloneDeep( emailSettings );

settings.title = __( 'User Email', 'lifterlms' );
settings.description = __(
	"A special field used to collect a user's account email address.",
	'lifterlms'
);

settings.supports.multiple = false; // Can only have a single email address field.

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.required = false;
settings.supports.llms_field_inspector.match = false;
settings.supports.llms_field_inspector.storage = false;

settings.attributes.id.__default = 'email_address';
settings.attributes.label.__default = __( 'Email Address', 'lifterlms' );
settings.attributes.name.__default = 'email_address';
settings.attributes.required.__default = true;
settings.attributes.match.__default = 'email_address_confirm';
settings.attributes.data_store.__default = 'users';
settings.attributes.data_store_key.__default = 'user_email';

delete settings.transforms;

export { name, postTypes, composed, settings };
