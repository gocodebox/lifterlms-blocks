/**
 * BLOCK: llms/form-field-user-address-state
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
import { settings as stateSelectSettings } from './select-state-l10n';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-user-address-state';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const postTypes = [ 'llms_form' ];

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
const settings = cloneDeep( stateSelectSettings );

settings.title = __( 'User State', 'lifterlms' );

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.required = false;
settings.supports.llms_field_inspector.match = false;
settings.supports.llms_field_inspector.storage = false;

settings.attributes.id.__default = 'llms_billing_state';
settings.attributes.label.__default = __( 'State / Province', 'lifterlms' );
settings.attributes.name.__default = 'llms_billing_state';
settings.attributes.required.__default = true;
settings.attributes.placeholder.__default = '';

delete settings.transforms;

export { name, postTypes, composed, settings };
