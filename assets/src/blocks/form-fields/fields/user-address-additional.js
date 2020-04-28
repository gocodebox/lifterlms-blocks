/**
 * BLOCK: llms/form-field-user-address-additional
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as textSettings } from './text';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-address-additional';

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

settings.title       = __( 'User Address (Line 2)', 'lifterlms' );
settings.description = __( 'A special field used to collect a user\'s billing address additional information.', 'lifterlms' );

settings.icon.src = 'location';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.match = false;

settings.attributes.id.__default               = 'llms_billing_address_2';
settings.attributes.placeholder.__default      = __( 'Apartment, suite, or unit', 'lifterlms' );
settings.attributes.name.__default             = 'llms_billing_address_2';
settings.attributes.label_show_empty.__default = true;


export {
	name,
	post_types,
	composed,
	settings,
};
