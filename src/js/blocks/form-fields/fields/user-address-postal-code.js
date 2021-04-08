/**
 * BLOCK: llms/form-field-user-address-postal-code
 *
 * @since 1.6.0
 * @version [version]
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
export const name = 'llms/form-field-user-address-postal-code';

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
		title: __( 'User Postal Code', 'lifterlms' ),
		description: __(
			"A special field used to collect a user's postal or zip code.",
			'lifterlms'
		),
		icon: {
			src: 'post-status',
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
				__default: 'llms_billing_zip',
			},
			label: {
				__default: __( 'Postal / Zip Code', 'lifterlms' ),
			},
			name: {
				__default: 'llms_billing_zip',
			},
			required: {
				__default: true,
			},
			data_store: {
				__default: 'usermeta',
			},
			data_store_key: {
				__default: 'llms_billing_zip',
			},
		},
		parent: [ 'llms/form-field-user-address-region' ],
		usesContext: [
			'llms/fieldGroup/fieldLayout',
		],
	},
	[ 'transforms', 'variations' ]
);

export { postTypes };
