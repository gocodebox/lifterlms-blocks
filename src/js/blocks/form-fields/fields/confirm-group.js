/**
 * BLOCK: llms/form-field-confirm-group
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
import { createBlock, getBlockType } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, Slot } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import {
	default as getDefaultSettings,
	getDefaultPostTypes,
} from '../settings';

import GroupLayoutControl from '../group-layout-control';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-confirm-group';

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
const settings = getDefaultSettings();

settings.title = __( 'Input Confirmation Group', 'lifterlms' );
settings.description = __( 'Adds a required confirmation field to an input field.', 'lifterlms' );

settings.icon.src = 'controls-repeat';


settings.attributes = {
	fieldLayout: {
		type: 'string',
		default: 'columns',
	},
};

settings.providesContext = {
	'llms/fieldGroup/fieldLayout': 'fieldLayout',
};

settings.supports = {
	...settings.supports,
	llms_field_group: true,
};

const ALLOWED = [
	'llms/form-field-text',
	'llms/form-field-user-email',
	'llms/form-field-user-password',
];

function getControllerBlockAttrs( attributes = {} ) {
	return {
		...attributes,
		columns: 6,
		last_column: false,
		isConfirmationControlField: true,
		llms_visibility: 'off',
	};

}

function getControlledBlockAttrs( attributes = {} ) {

	return {
		...attributes,
		label: attributes.label ? sprintf( __( 'Confirm %s', 'lifterlms' ), attributes.label ) : '',
		columns: 6,
		last_column: true,
		data_store: false,
		data_store_key: false,
		isConfirmationField: true,
		llms_visibility: 'off',
	};

}

function revertToSingle( block ) {

	const
		{ replaceBlock } = dispatch( 'core/block-editor' ),
		{ clientId, innerBlocks } = block,
		{ llms_visibility } = block.attributes,
		{ name, attributes } = innerBlocks[0];
	replaceBlock(
		clientId,
		createBlock(
			name,
			{
				...attributes,
				columns: 12,
				last_column: true,
				isConfirmationControlField: false,
				llms_visibility,
			}
		)
	);

};

settings.edit = function( props ) {

	const blockProps = useBlockProps();

	const { attributes, clientId, setAttributes } = props;

	const { hasConfirmation, fieldLayout } = attributes;

	const
		block           = select( 'core/block-editor' ).getBlock( clientId ),
		hasChildren     = ( block && block.innerBlocks.length > 0 ),
		firstChild      = hasChildren ? block.innerBlocks[0] : null,
		firstChildBlock = firstChild ? getBlockType( firstChild.name ) : null,
		editFills       = firstChildBlock ? firstChildBlock.supports.llms_edit_fill : { after: false };

	const TEMPLATE = hasChildren ? null : [
		[ 'llms/form-field-text', getControllerBlockAttrs() ],
		[ 'llms/form-field-text', getControlledBlockAttrs() ],
	];

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody>
					<GroupLayoutControl { ...{ ...props, block } } />
					<Button
						isDestructive
						onClick={ () => revertToSingle( block ) }
					>{ __( 'Remove confirmation field', 'lifterlms' ) }</Button>
				</PanelBody>
			</InspectorControls>
			<div className="llms-field-group llms-field--confirm-group" data-field-layout={ fieldLayout }>
				<InnerBlocks
					allowedBlocks={ ALLOWED }
					template={ TEMPLATE }
					templateLock="all"
				/>
			</div>

			{ editFills.after && (
				<Slot
					name={ `llmsEditFill.after.${ editFills.after }.${ firstChild.clientId }` }
				/>
			) }
		</div>
	);
};

/**
 * The save function defines the way in which the different attributes should be combined
 * into the final markup, which is then serialized by Gutenberg into post_content.
 *
 * The "save" property must be specified and must be a valid function.
 *
 * @since [version]
 *
 * @return {Object} Attributes object.
 */
settings.save = function() {
	const blockProps = useBlockProps.save();
	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
};

settings.transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'llms/form-field-text' ],
			transform: ( attributes ) => {
				return createBlock(
					name,
					{},
					[
						createBlock( 'llms/form-field-text', getControllerBlockAttrs( attributes ) ),
						createBlock( 'llms/form-field-text', getControlledBlockAttrs( attributes ) ),
					]
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'llms/form-field-user-email' ],
			transform: ( attributes ) => {
				return createBlock(
					name,
					{},
					[
						createBlock( 'llms/form-field-user-email', getControllerBlockAttrs( attributes ) ),
						createBlock( 'llms/form-field-text', getControlledBlockAttrs( attributes ) ),
					]
				);
			},
		},
		{
			type: 'block',
			blocks: [ 'llms/form-field-user-password' ],
			transform: ( attributes ) => {
				return createBlock(
					name,
					{},
					[
						createBlock( 'llms/form-field-user-password', getControllerBlockAttrs( attributes ) ),
						createBlock( 'llms/form-field-text', getControlledBlockAttrs( attributes ) ),
					]
				);
			},
		}
	]
};

export { name, postTypes, composed, settings };
