/**
 * BLOCK: llms/form-field-checkboxes
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support and default options.
 * @since [version] Add reusable block support.
 * @since [version] Added default keys.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import {
	default as getDefaultSettings,
	getSettingsFromBase,
	getDefaultPostTypes,
	getDefaultOptionsArray,
} from '../settings';
import icon from '../../../icons/field-checkbox';

/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/form-field-checkboxes';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const postTypes = getDefaultPostTypes();

/**
 * Field composition type.
 *
 * @type {string}
 */
export const composed = false;

/**
 * Block settings
 *
 * @type {Object}
 */
export const settings = getSettingsFromBase(
	getDefaultSettings(),
	{
		title: __( 'Checkboxes', 'lifterlms' ),
		description: __(
			'A single checkbox toggle or a group of multiple checkboxes.',
			'lifterlms'
		),
		icon: {
			src: icon,
		},
		supports: {
			llms_field_inspector: {
				options: true,
			},
		},
		attributes: {
			field: {
				__default: 'checkbox',
			},
			options: {
				__default: getDefaultOptionsArray( 2, 0 ),
			}
		},
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'llms/form-field-radio', 'llms/form-field-select' ],
					transform: ( attributes ) => createBlock( name, {
						...attributes,
						field: settings.attributes.field.__default,
					} ),
				},
			],
		},
	}
);
