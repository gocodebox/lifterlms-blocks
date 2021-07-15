/**
 * Watch the blocks tree and sync changes to the llms/user-info-fields data store
 *
 * @since 2.0.0
 * @version [version]
 */

// External deps.
import { debounce, differenceBy } from 'lodash';

// WP Deps.
import { dispatch, select, subscribe } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

// Internal deps.
import { flattenBlocks, getBlocksFlat } from '../../util/';
import { store as fieldsStore } from '../../data/fields';

/**
 * Stores the last state of the block list as used by updateBlocks().
 *
 * @type {Array}
 */
let oldBlocks = [];

/**
 * Add a block type registration filter which we use to modify the transform functions
 * used for transforming blocks to group and column blocks.
 *
 * We need to prevent the field block name, id, etc... attributes from being automatically
 * changed during a transform.
 *
 * We need to unload fields being moved into groups/columns so that they are not identified as duplicates
 * when the field is rendered after the transform takes place.
 *
 * This happens because the transform functions of groups / columns *create a new block* using the attributes
 * of the existing block (a perfect copy) which is ideal except there's no way for us to identify
 * that this kind of copy is *acceptable*.
 *
 * If we don't modify the transform function as we do the new field blocks found inside the group/columns will
 * have an incremented id and name property. We don't want these field properties to change when they're
 * recreated.
 */
addFilter(
	'blocks.registerBlockType',
	'llms/blocks-watcher/registerBlockType',
	maybeModifyBlockSettings
);

/**
 * Find the index of the transformation function to be replaced during block registration
 *
 * @since [version]
 *
 * @param {string} blockName Name of the block the blocks are being transformed to.
 * @param {Object} settings  Block type settings.
 * @return {number|null} Returns `null` when the block shouldn't be modified or there is no valid transform to modify
 *                       or returns the index of the transform to modify as an integer.
 */
function getTransformReplacementIndex( blockName, settings ) {
	// Only modify these blocks.
	const supportedBlocks = [ 'core/group', 'core/columns' ];
	if ( ! supportedBlocks.includes( blockName ) ) {
		return null;
	}

	// Find the relevant transform from.
	const { from } = settings?.transforms;
	if ( from && from.length ) {
		return from.findIndex( ( { blocks } ) => blocks.includes( '*' ) );
	}

	// Not found.
	return null;
}

/**
 * Replaces qualifying transform from functions with a wrapper function
 *
 * Callback for blocks.registerBlockType.
 *
 * The wrapper function unloads any field blocks found within the group/column
 * and then clears the `oldBlocks` array so that on the next tick of the `subscribe()`
 * method these fields will be automatically reloaded.
 *
 * Note: this function will run twice during a transform: the first time is when the preview
 * is shown on hover and the second time is when the transform is run to create the blocks
 * which replace the blocks in the block list in the editor
 *
 * The resetting of `oldBlocks` is necessary for a scenario when the user hovers (creating the preview)
 * but decides *not* to actually insert the blocks. In this scenario the blocklist *does not change* and
 * the field will remain unloaded.
 *
 * @since [version]
 *
 * @param {Object} settings  Block type settings.
 * @param {string} blockName Block type name.
 * @return {Object} Block type settings.
 */
function maybeModifyBlockSettings( settings, blockName ) {
	const transformIndex = getTransformReplacementIndex( blockName, settings );

	// Don't touch the block.
	if ( null === transformIndex ) {
		return settings;
	}

	const { __experimentalConvert } = settings.transforms.from[
		transformIndex
	];
	settings.transforms.from[ transformIndex ].__experimentalConvert = (
		blocks
	) => {
		unloadBlocks( flattenBlocks( blocks ) );

		const originalReturn = __experimentalConvert( blocks );

		oldBlocks = [];

		return originalReturn;
	};

	return settings;
}

/**
 * Retrieve the difference in two sets of blocks.
 *
 * @since 2.0.0
 *
 * @param {Object[]} a Control block list.
 * @param {Object[]} b New block list.
 * @return {Object[]} List of changes.
 */
const fieldBlocksDifferenceBy = ( a, b ) =>
	differenceBy( a, b, 'clientId' ).filter(
		( { name } ) => 0 === name.indexOf( 'llms/form-' )
	);

/**
 * Handle deleted blocks.
 *
 * Unloads persisted blocks and deletes unpersisted blocks.
 *
 * @since 2.0.0
 *
 * @param {Object[]} deletedBlocks List of blocks that have been deleted since the last check.
 * @return {void}
 */
const unloadBlocks = ( deletedBlocks ) => {
	deletedBlocks.forEach( ( { attributes } ) => {
		const { name } = attributes,
			{ getField } = select( fieldsStore ),
			{ deleteField, unloadField } = dispatch( fieldsStore ),
			field = getField( name );

		if ( field ) {
			setTimeout( () => {
				// console.log(
				// 	field.isPersisted ? 'unloading:' : 'deleting:',
				// 	name
				// );
				if ( field.isPersisted ) {
					unloadField( name );
				} else {
					deleteField( name );
				}
			} );
		}
	} );
};

/**
 * Handle created blocks.
 *
 * Loads existing fields and creates non-existent fields.
 *
 * @since 2.0.0
 *
 * @param {Object[]} createdBlocks List of blocks that have been added since the last check.
 * @return {void}
 */
const loadBlocks = ( createdBlocks ) => {
	const { fieldExists } = select( fieldsStore ),
		{ loadField, addField } = dispatch( fieldsStore );

	createdBlocks.forEach( ( { attributes, clientId } ) => {
		const { name } = attributes;
		setTimeout( () => {
			// console.log(
			// 	fieldExists( name ) ? 'loading:' : 'adding:',
			// 	name,
			// 	clientId
			// );
			if ( fieldExists( name ) ) {
				loadField( name, clientId );
			} else {
				addField( {
					name,
					clientId,
					id: attributes.id,
					label: attributes.label,
					data_store: attributes.data_store,
					data_store_key: attributes.data_store_key,
				} );
			}
		} );
	} );
};

/**
 * Signals a check to determine if field blocks should be loaded & unloaded based on the current state of the block list
 *
 * @since [version]
 *
 * @return {void}
 */
function updateBlocks() {
	const blocks = getBlocksFlat(),
		deletedBlocks = fieldBlocksDifferenceBy( oldBlocks, blocks ),
		createdBlocks = fieldBlocksDifferenceBy( blocks, oldBlocks );

	oldBlocks = blocks;

	unloadBlocks( deletedBlocks );
	loadBlocks( createdBlocks );
}

/**
 * Subscription handler
 *
 * @since 2.0.0
 * @since [version] Use `updateBlocks()` instead of anonymous function.
 *
 * @return {void}
 */
export default function () {
	subscribe( debounce( updateBlocks, 500 ) );
}
