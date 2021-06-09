/**
 * Watch the blocks tree and sync changes to the llms/user-info-fields data store
 *
 * @since [version]
 * @version [version]
 */

// External deps.
import { debounce, differenceBy } from 'lodash';

// WP Deps.
import { dispatch, select, subscribe } from '@wordpress/data';

// Internal deps.
import { getBlocksFlat } from '../../util/';
import { store as fieldsStore } from '../../data/fields';

/**
 * Retrieve the difference in two sets of blocks.
 *
 * @since [version]
 *
 * @param {Object[]} a Control block list.
 * @param {Object[]} b New block list.
 * @return {Object[]} List of changes.
 */
const fieldBlocksDifferenceBy = ( a, b ) => differenceBy( a, b, 'clientId' ).filter( ( { name } ) => 0 === name.indexOf( 'llms/form-' ) );

/**
 * Handle deleted blocks.
 *
 * Unloads persisted blocks and deletes unpersisted blocks.
 *
 * @since [version]
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
				console.log( field.isPersisted ? 'unloading:' : 'deleting:', name );
				field.isPersisted ? unloadField( name ) : deleteField( name );
			} );

		}

	} );

};

/**
 * Handle created blocks.
 *
 * Loads existing fields and creates non-existent fields.
 *
 * @since [version]
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
			console.log( fieldExists( name ) ? 'loading:' : 'adding:', name, clientId );
			fieldExists( name ) ? loadField( name, clientId ) : addField( {
				name,
				clientId,
				id: attributes.id,
				label: attributes.label,
				data_store: attributes.data_store,
				data_store_key: attributes.data_store_key,
			} );
		} );
	} );

}

/**
 * Subscription handler
 *
 * @since [version]
 *
 * @return {void}
 */
export default function() {

	let oldBlocks = [];

	subscribe(
		debounce( () => {

			const blocks = getBlocksFlat(),
				deletedBlocks = fieldBlocksDifferenceBy( oldBlocks, blocks ),
				createdBlocks = fieldBlocksDifferenceBy( blocks, oldBlocks );

			oldBlocks = blocks;

			unloadBlocks( deletedBlocks );
			loadBlocks( createdBlocks );

		}, 500 )
	);

}
