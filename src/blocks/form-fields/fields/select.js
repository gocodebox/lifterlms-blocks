/**
 * BLOCK: llms/form-field-select
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
const { __ } = wp.i18n;

// Internal Deps.
import getDefaultSettings from '../settings';
import icon from '../../../icons/field-select';

/**
 * Block Name
 *
 * @type {String}
 */
const name = 'llms/form-field-select';

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

settings.title       = __( 'Dropdown', 'lifterlms' );
settings.description = __( 'A select field which can be populated with any number of options.', 'lifterlms' );

settings.icon.src = icon;

settings.attributes.field.__default = 'select';

settings.supports.llms_field_inspector.options     = true;
settings.supports.llms_field_inspector.placeholder = true;

export {
	name,
	post_types,
	composed,
	settings,
};

