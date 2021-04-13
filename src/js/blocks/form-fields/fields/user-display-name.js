/**
 * BLOCK: llms/form-field-user-display-name
 *
 * @since [version]
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
export const name = 'llms/form-field-user-display-name';

/**
 * Is this a default or composed field?
 *
 * @type {string}
 */
export const composed = true;

/**
 * Block settings
 *
 * @since [version]
 *
 * @type {Object}
 */
export const settings = getSettingsFromBase(
	baseSettings,
	{
		title: __( 'User Display Name', 'lifterlms' ),
		description: __(
			"Allows a user to choose how their name will be displayed publicly on the site.",
			'lifterlms'
		),
		icon: {
			src: 'nametag',
		},
		supports: {
			inserter: true,
			multiple: false,
			llms_field_inspector: {
				id: false,
				name: false,
				required: false,
				storage: false,
			},
		},
		attributes: {
			id: {
				__default: 'display_name',
			},
			field: {
				__default: 'text',
			},
			label: {
				__default: __( 'Display Name', 'lifterlms' ),
			},
			name: {
				__default: 'display_name',
			},
			required: {
				__default: true,
			},
			data_store: {
				__default: 'users',
			},
			data_store_key: {
				__default: 'display_name',
			},

		},
	},
	[ 'transforms', 'variations' ],
);

export { postTypes }
