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
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import {
	default as getDefaultSettings,
	getSettingsFromBase,
	getDefaultPostTypes,
} from '../settings';

import GroupLayoutControl from '../group-layout-control';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-user-address-region';

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
		title: __( 'User Street Address', 'lifterlms' ),
		description: __( "Collect a user's street address.", 'lifterlms' ),
		icon: {
			src: 'id-alt',
		},
		supports: {
			multiple: false,
		},
		parent: [ 'llms/form-field-user-name' ],
		llmsInnerBlocks: {
			allowed: [
				'llms/form-field-user-address-state',
				'llms/form-field-user-address-postal-code',
			],
			template: [
				[ 'llms/form-field-user-address-state', { columns: 6, last_column: false } ],
				[ 'llms/form-field-user-address-postal-code', { columns: 6, last_column: true } ],
			],
		},
	}
);

export { name, postTypes, composed, settings };
