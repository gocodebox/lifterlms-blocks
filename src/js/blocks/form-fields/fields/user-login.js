/**
 * BLOCK: llms/form-field-user-login
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
export const name = 'llms/form-field-user-login';

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
		title: __( 'User Login', 'lifterlms' ),
		description: __(
			"Field used to collect a user's account username. If this field is omitted a username will be automatically generated based off their email address. Users can always login using either their email address or username.",
			'lifterlms'
		),
		icon: {
			src: 'admin-users',
		},
		supports: {
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
				__default: 'user_login',
			},
			field: {
				__default: 'text',
			},
			label: {
				__default: __( 'Username', 'lifterlms' ),
			},
			name: {
				__default: 'user_login',
			},
			required: {
				__default: true,
			},
			data_store: {
				__default: 'users',
			},
			data_store_key: {
				__default: 'user_login',
			},
		},
	}
	[ 'transforms', 'variations' ],
);

export { postTypes };
