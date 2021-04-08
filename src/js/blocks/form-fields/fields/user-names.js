/**
 * BLOCK: llms/form-field-passwords
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { createBlock, getBlockType } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import {
	default as getDefaultSettings,
	getSettingsFromBase,
	getDefaultPostTypes,
} from '../settings';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/form-field-user-name';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = getDefaultPostTypes();

/**
 * Is this a default or composed field?
 *
 * @type {string}
 */
export const composed = false;

// Setup the field settings.
export const settings = getSettingsFromBase(
	getDefaultSettings( 'group' ),
	{
		title: __( 'User name', 'lifterlms' ),
		description: __( "A special field used to collect a user's first and last name.", 'lifterlms' ),
		icon: {
			src: 'admin-users',
		},
		supports: {
			multiple: false,
		},
		llmsInnerBlocks: {
			allowed: [
				'llms/form-field-user-first-name',
				'llms/form-field-user-last-name',
			],
			template: [
				[ 'llms/form-field-user-first-name', { columns: 6, last_column: false } ],
				[ 'llms/form-field-user-last-name', { columns: 6, last_column: true } ],
			],
		},
	}
);
