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

// Internal Deps.
import { settings as baseSettings, postTypes } from './user-first-name';
import { getSettingsFromBase } from '../settings';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-user-last-name';

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
const settings = getSettingsFromBase( baseSettings, {
	title: __( 'Last Name', 'lifterlms' ),
	description: __(
		"A special field used to collect a user's last name.",
		'lifterlms'
	),
	attributes: {
		id: { __default: 'last_name', },
		label: { __default: __( 'Last Name', 'lifterlms' ), },
		name: { __default: 'last_name', },
		data_store_key: { __default: 'last_name', },
	}
} );

delete settings.transforms;
delete settings.variations;

export { name, postTypes, composed, settings };
