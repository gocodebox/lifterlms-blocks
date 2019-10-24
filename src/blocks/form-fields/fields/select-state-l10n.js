/**
 * BLOCK: llms/form-field-select-state-l10n
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const { __ } = wp.i18n;

// External Deps.
import cloneDeep from 'lodash/clonedeep';

// Internal Deps.
import { settings as selectSettings } from './select';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-select-state-l10n';

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
let settings = cloneDeep( selectSettings );

settings.title       = __( 'Dropdown States', 'lifterlms' );
settings.description = __( 'A searchable select field prepopulated with a country states / regions. When combined with a "Dropdown Countries" field, this field will automatically update to display options for the currently selected country.', 'lifterlms' );

settings.icon.src = 'admin-site-alt';

settings.attributes.options_preset.__default = 'states';
settings.attributes.placeholder.__default    = __( 'Select a State', 'lifterlms' );

settings.supports.llms_field_inspector.options = false;

export {
	name,
	post_types,
	composed,
	settings,
};

