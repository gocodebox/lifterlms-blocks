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
const name = 'llms/form-field-user-name';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const postTypes = getDefaultPostTypes();

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
const settings = getSettingsFromBase(
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

export { name, postTypes, composed, settings };
