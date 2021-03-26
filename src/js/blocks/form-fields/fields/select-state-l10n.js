/**
 * BLOCK: llms/form-field-select-state-l10n
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as selectSettings, postTypes } from './select';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-select-state-l10n';

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

settings.title = __( 'Dropdown States', 'lifterlms' );
settings.description = __(
	'A searchable select field prepopulated with a country states / regions. When combined with a "Dropdown Countries" field, this field will automatically update to display options for the currently selected country.',
	'lifterlms'
);

settings.icon.src = 'admin-site-alt';

settings.attributes.options_preset.__default = 'states';
settings.attributes.placeholder.__default = __( 'Select a State', 'lifterlms' );

settings.supports.llms_field_inspector.options = false;

delete settings.transforms;

export { name, postTypes, composed, settings };
