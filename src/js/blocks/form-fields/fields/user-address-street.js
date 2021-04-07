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
const name = 'llms/form-field-user-address-street';

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
const settings = getSettingsFromBase( getDefaultSettings(), {
	title: __( 'User Street Address', 'lifterlms' ),
	description: __( "Collect a user's street address.", 'lifterlms' ),
	icon: {
		src: 'id-alt',
	},
	attributes: {
		fieldLayout: {
			type: 'string',
			default: 'columns',
		},
	},
	supports: {
		multiple: false,
		llms_field_group: true,
	},
	providesContext: {
		'llms/fieldGroup/fieldLayout': 'fieldLayout',
	},
	parent: [ 'llms/form-field-user-name' ],
	edit: function( props ) {

		const blockProps = useBlockProps(),
			{ attributes, clientId, setAttributes } = props,
			block = select( 'core/block-editor' ).getBlock( clientId ),
			{ fieldLayout } = attributes,
			INNER_ORIENTATION = 'columns' === fieldLayout ? 'horizontal' : 'vertical',
			INNER_ALLOWED = [
				'llms/form-field-user-address-street-primary',
				'llms/form-field-user-address-street-secondary',
			],
			INNER_TEMPLATE = [
				[ 'llms/form-field-user-address-street-primary', { columns: 8, last_column: false } ],
				[ 'llms/form-field-user-address-street-secondary', { columns: 4, last_column: true } ],
			];

		return (
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody>
						<GroupLayoutControl { ...{ ...props, block } } />
					</PanelBody>
				</InspectorControls>

				<div className="llms-field-group llms-field--user-address--street" data-field-layout={ fieldLayout }>
					<InnerBlocks
						allowedBlocks={ INNER_ALLOWED }
						template={ INNER_TEMPLATE }
						templateLock="insert"
						orientation={ INNER_ORIENTATION }
					/>
				</div>
			</div>
		);
	},
	save: function() {

		const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);

	}
} );

export { name, postTypes, composed, settings };
