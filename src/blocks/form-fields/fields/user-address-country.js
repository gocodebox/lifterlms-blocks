/**
 * BLOCK: llms/form-field-user-address-country
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import cloneDeep from 'lodash/clonedeep';

// Internal Deps.
import { settings as countrySelectSettings } from './select-country';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-user-address-country';

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
let settings = cloneDeep( countrySelectSettings );

settings.title       = __( 'User Country', 'lifterlms' );
settings.description = __( 'A special field used to collect a user\'s billing address country.', 'lifterlms' );

settings.supports.multiple = false; // Can only have a single email address field.

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.required = false;
settings.supports.llms_field_inspector.match = false;

settings.attributes.id.__default          = 'llms_billing_country';
settings.attributes.label.__default       = __( 'Country / Region', 'lifterlms' );
settings.attributes.name.__default        = 'llms_billing_country';
settings.attributes.required.__default    = true;
settings.attributes.placeholder.__default = '';

export {
	name,
	post_types,
	composed,
	settings,
};
