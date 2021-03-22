/**
 * BLOCK: llms/form-field-select-country
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as selectSettings } from './select';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-select-country';

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
 * and are not registered as a block by default.
 *
 * @type {string}
 */
const composed = false;

// Setup the field settings.
const settings = cloneDeep( selectSettings );

settings.title = __( 'Dropdown Countries', 'lifterlms' );
settings.description = __(
	'A searchable select field prepopulated with a list of countries.',
	'lifterlms'
);

settings.icon.src = 'admin-site';

settings.attributes.options_preset.__default = 'countries';
settings.attributes.placeholder.__default = __(
	'Select a Country',
	'lifterlms'
);

settings.supports.llms_field_inspector.options = false;

delete settings.transforms;

export { name, postTypes, composed, settings };
