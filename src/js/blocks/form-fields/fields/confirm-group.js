/**
 * BLOCK: llms/form-field-confirm-group
 *
 * @since [version]
 * @version [version]
 */

// WP Deps.
import { createBlock } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __, isRTL, sprintf } from '@wordpress/i18n';

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
export const name = 'llms/form-field-confirm-group';

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
export const composed = true;

/**
 * Retrieve block attributes for a controller block
 *
 * @since [version]
 *
 * @param {Object} attributes Existing attributes to merge defaults into.
 * @return {Object} Updated block attributes.
 */
function getControllerBlockAttrs( attributes = {} ) {
	return {
		...attributes,
		columns: 6,
		last_column: false,
		isConfirmationControlField: true,
		llms_visibility: 'off',
	};
}

/**
 * Retrieve block attributes for a controlled (confirmation) block
 *
 * @since [version]
 *
 * @param {Object} attributes Existing attributes to merge defaults into.
 * @return {Object} Updated block attributes.
 */
function getControlledBlockAttrs( attributes = {} ) {
	return {
		...attributes,
		label: attributes.label
			? // Translators: %s label of the controller field.
			  sprintf( __( 'Confirm %s', 'lifterlms' ), attributes.label )
			: '',
		columns: 6,
		last_column: true,
		data_store: false,
		data_store_key: false,
		isConfirmationField: true,
		llms_visibility: 'off',
	};
}

/**
 * Revert the confirmation group to a single field
 *
 * Replaces the group block with the controller block (first inner child) of the group.
 *
 * @since [version]
 *
 * @param {string} clientId Client ID of the group block.
 * @return {void}
 */
function revertToSingle( clientId ) {
	const { getBlock } = select( blockEditorStore ),
		{ replaceBlock } = dispatch( blockEditorStore ),
		block = getBlock( clientId ),
		{ innerBlocks } = block,
		{ llms_visibility } = block.attributes,
		{ name, attributes } = innerBlocks[
			findControllerBlockIndex( innerBlocks )
		];

	replaceBlock(
		clientId,
		createBlock( name, {
			...attributes,
			columns: 12,
			last_column: true,
			isConfirmationControlField: false,
			match: '',
			llms_visibility,
		} )
	);
}

/**
 * Allowed blocks list.
 *
 * @type {string[]}
 */
const allowed = [
	'llms/form-field-text',
	'llms/form-field-user-email',
	'llms/form-field-user-login',
	'llms/form-field-user-password',
];

/**
 * Block transforms.
 *
 * @type {Object}
 */
const transforms = {
	from: [],
	to: [],
};

/**
 * Create a block transform for each of the allowed blocks
 *
 * When creating a confirm group from a single block the first child
 * should be a direct copy of the block itself (EG: user-email -> user->email).
 *
 * The second child should be a simple text block with the type of the first block
 * (eg: user-email to text with a field type email).
 *
 * Therefore each transform is identical except for the block type of the first child
 * block.
 *
 * @since [version]
 *
 * @param {string} blockName Name of the block being transformed into a group.
 * @return {void}
 */
allowed.forEach( ( blockName ) => {
	transforms.from.push( {
		type: 'block',
		blocks: [ blockName ],
		transform: ( attributes ) => {
			const { llms_visibility } = attributes;

			const children = [
				createBlock( blockName, getControllerBlockAttrs( attributes ) ),
				createBlock(
					'llms/form-field-text',
					getControlledBlockAttrs( attributes )
				),
			];

			return createBlock(
				name,
				{ llms_visibility },
				isRTL() ? children.reverse() : children
			);
		},
	} );

	transforms.to.push( {
		type: 'block',
		blocks: [ blockName ],
		isMatch: () => {
			const { getSelectedBlock } = select( blockEditorStore ),
				{ innerBlocks } = getSelectedBlock(),
				controllerBlock =
					innerBlocks[ findControllerBlockIndex( innerBlocks ) ],
				{ name } = controllerBlock || {};

			return name === blockName;
		},
		transform: ( groupAttributes, innerBlocks ) => {
			const { llms_visibility } = groupAttributes,
				controllerBlock =
					innerBlocks[ findControllerBlockIndex( innerBlocks ) ],
				{ name, attributes } = controllerBlock;

			return createBlock( name, {
				...attributes,
				columns: 12,
				last_column: true,
				isConfirmationControlField: false,
				match: '',
				llms_visibility,
			} );
		},
	} );
} );

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since [version]
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @param {Object}   props         Block properties.
 * @return {Button} Component HTML Fragment.
 */
const fillInspectorControls = ( attributes, setAttributes, props ) => {
	const { clientId } = props;

	return (
		<Button isDestructive onClick={ () => revertToSingle( clientId ) }>
			{ __( 'Remove confirmation field', 'lifterlms' ) }
		</Button>
	);
};

/**
 * Finds the index of the primary (controller) field in the group
 *
 * @since [version]
 *
 * @param {Object[]} innerBlocks ) Inner blocks array.
 * @return {number} Array index of the primary block within the inner blocks array.
 */
const findControllerBlockIndex = ( innerBlocks ) =>
	innerBlocks.findIndex(
		( { attributes } ) => attributes.isConfirmationControlField
	);

/**
 * Block settings
 *
 * @type {Object}
 */
export const settings = getSettingsFromBase( getDefaultSettings( 'group' ), {
	title: __( 'Input Confirmation Group', 'lifterlms' ),
	description: __(
		'Adds a required confirmation field to an input field.',
		'lifterlms'
	),
	icon: {
		src: 'controls-repeat',
	},
	category: 'llms-custom-fields',
	transforms,
	fillInspectorControls,
	findControllerBlockIndex,
	supports: {
		llms_field_inspector: {
			customFill: 'confirmGroupAdditionalControls',
		},
		inserter: false,
	},
	llmsInnerBlocks: {
		allowed,

		/**
		 * Create block template depending on it's innerBlocks
		 *
		 * If the block has no children, setup matching text fields (type can be changed later).
		 *
		 * Otherwise pass in `null` which will allow various composed fields to be setup through
		 * transformation. They'll be locked by template locking even though no template is provided.
		 *
		 * @since [version]
		 *
		 * @param {Object}  options
		 * @param {?Object} options.block Block object.
		 * @return {?Array} An InnerBlocks template array.
		 */
		template: ( { block } ) => {
			let template = null;

			if ( ! block || ! block.innerBlocks.length ) {
				template = [
					[ 'llms/form-field-text', getControllerBlockAttrs() ],
					[ 'llms/form-field-text', getControlledBlockAttrs() ],
				];
			}

			return template;
		},
	},
} );
