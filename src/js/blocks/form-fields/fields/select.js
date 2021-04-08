/**
 * BLOCK: llms/form-field-select
 *
 * @since 1.6.0
 * @since 1.12.0 Add transform support and default options.
 * @since [version] Add reusable block support.
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

// Internal Deps.
import {
	getSettingsFromBase,
	getDefaultPostTypes,
	getDefaultOptionsArray,
} from '../settings';
import icon from '../../../icons/field-select';
import { settings as baseSettings } from './radio';


/**
 * Block Name
 *
 * @type {string}
 */
export const name = 'llms/form-field-select';

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
	baseSettings,
	{
		title: __( 'Dropdown', 'lifterlms' ),
		description: __(
			'A select field which can be populated with any number of options.',
			'lifterlms'
		),
		icon: {
			src: icon,
		},
		attributes: {
			field: {
				__default: 'select',
			},
		},
		supports: {
			llms_field_inspector: {
				placeholder: true,
			},
		},
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'llms/form-field-checkboxes', 'llms/form-field-radio' ],
					transform: ( attributes ) => createBlock( name, {
						...attributes,
						field: settings.attributes.field.__default,
					} ),
				},
			],
		},
	}
);
