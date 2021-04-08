/**
 * BLOCK: llms/form-field-user-address-state
 *
 * @since 1.6.0
 * @version [version]
 */

// WP Deps.
import { __ } from '@wordpress/i18n';

// Internal Deps.
import { settings as baseSettings, postTypes } from './select';
import { getSettingsFromBase } from '../settings';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/form-field-user-address-state';

/**
 * Is this a default or composed field?
 *
 * @type {string}
 */
export const composed = true;

/**
 * Block settings
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 * @since 1.12.0 Add data store support.
 * @since [version] Add reusable block support.
 *
 * @type {Object}
 */
export const settings = getSettingsFromBase(
	baseSettings,
	{
		title: __( 'User Country', 'lifterlms' ),
		description: __(
			"A special field used to collect a user's billing country.",
			'lifterlms'
		),
		icon: {
			src: 'location',
		},
		supports: {
			multiple: false,
			llms_field_inspector: {
				id: false,
				name: false,
				required: true,
				storage: false,
				options: false,
			},
		},
		attributes: {
			id: {
				__default: 'llms_billing_state',
			},
			label: {
				__default: __( 'State / Region', 'lifterlms' ),
			},
			name: {
				__default: 'llms_billing_state',
			},
			required: {
				__default: true,
			},
			data_store: {
				__default: 'usermeta',
			},
			data_store_key: {
				__default: 'llms_billing_state',
			},
			options_preset: {
				__default: 'states',
			},
			placeholder: {
				__default: __( 'Select a State / Region', 'lifterlms' ),
			}
		},
		parent: [ 'llms/form-field-user-address-region' ],
		usesContext: [
			'llms/fieldGroup/fieldLayout',
		],
	},
	[ 'transforms' ]
);

export { postTypes };
