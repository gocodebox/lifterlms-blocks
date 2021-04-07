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
import { settings as baseSettings, postTypes } from './text';
import { getSettingsFromBase } from '../settings';

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
const settings = getSettingsFromBase( baseSettings, {
	title: __( 'First Name', 'lifterlms' ),
	description: __(
		"A special field used to collect a user's first name.",
		'lifterlms'
	),
	icon: {
		src: 'admin-users',
	},
	supports: {
		multiple: false,  // Can only have a single email address field.
		llms_field_inspector: {
			id: false,
			name: false,
			required: true,
			match: false,
			storage: false,
		},
	},
	attributes: {
		id: { __default: 'first_name', },
		field: { __default: 'text', },
		label: { __default: __( 'First Name', 'lifterlms' ), },
		name: { __default: 'first_name', },
		required: { __default: true, },
		data_store: { __default: 'usermeta', },
		data_store_key: { __default: 'first_name', },
	},
	parent: [ 'llms/form-field-user-name' ],
	usesContext: [
		'llms/fieldGroup/fieldLayout',
	],
} );

delete settings.transforms;
delete settings.variations;

export { name, postTypes, composed, settings };
