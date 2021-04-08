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
export const name = 'llms/form-field-user-address-city';

/**
 * Is this a default or composed field?
 *
 * @type {string}
 */
export const composed = true;

// Setup the field settings.
export const settings = getSettingsFromBase(
	baseSettings,
	{
		title: __( 'User City', 'lifterlms' ),
		description: __(
			"A special field used to collect a user's billing city.",
			'lifterlms'
		),
		icon: {
			src: 'location-alt',
		},
		supports: {
			multiple: false,
			llms_field_inspector: {
				id: false,
				name: false,
				required: true,
				match: false,
				storage: false,
			},
		},
		attributes: {
			id: {
				__default: 'llms_billing_city',
			},
			label: {
				__default: __( 'City', 'lifterlms' ),
			},
			name: {
				__default: 'llms_billing_city',
			},
			required: {
				__default: true,
			},
			data_store: {
				__default: 'usermeta',
			},
			data_store_key: {
				__default: 'llms_billing_city',
			},
		},
		parent: [ 'llms/form-field-user-address' ],
	},
	[ 'transforms', 'variations' ]
);

export { postTypes };
