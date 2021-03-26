/**
 * Form Field related checks
 *
 * @since Unknown
 * @version [version]
 */

// External Deps.
import { every, forEach } from 'lodash';

// WP Deps.
import { select } from '@wordpress/data';

/**
 * Determines if the block is (or contains) field block/s
 *
 * If the block contains innerBlocks (or is a reusable block) it
 * passes the list of contained to filterBlocks.
 *
 * @since Unknown
 * @since [version] Adds support for reusable blocks.
 *
 * @param {Object} block A block object.
 * @return {Object[]} An array of field blocks.
 */
function filterBlock( block ) {
	// Check the block's inner blocks.
	if ( block.innerBlocks.length ) {
		return filterBlocks( block.innerBlocks );
	}

	// Reusable blocks don't have inner blocks defined so we need to look them up this ay.
	if ( 'core/block' === block.name ) {
		const { blocks } = select( 'core' ).getEditedEntityRecord(
			'postType',
			'wp_block',
			block.attributes.ref
		);
		return filterBlocks( blocks );
	}

	// Only return form field blocks.
	if ( -1 === block.name.indexOf( 'llms/form-field' ) ) {
		return [];
	}

	return [ block ];
}

/**
 * Recursively filter blocks (checking inner blocks)
 *
 * Returns only a (flattened) list of field blocks.
 *
 * @since [version]
 *
 * @param {Object[]} blocks An array of blocks to filter.
 * @return {Object[]} An array of field blocks.
 */
function filterBlocks( blocks = [] ) {
	let fieldBlocks = [];

	forEach( blocks, ( block ) => {
		const filtered = filterBlock( block );
		if ( filtered.length ) {
			fieldBlocks = fieldBlocks.concat( filtered );
		}
	} );

	return fieldBlocks;
}

/**
 * Retrieve a "flattened" list of all form fields from a list of blocks
 *
 * Recursively checks each block for it's inner blocks to determine if there's
 * fields in the block.
 *
 * @since Unknown
 *
 * @param {Object[]} blocks An array of blocks to filter.
 * @return {Object[]} An array of field blocks.
 */
export const getFieldBlocks = ( blocks = [] ) => {
	if ( ! Array.isArray( blocks ) ) {
		blocks = [ blocks ];
	}
	return filterBlocks( blocks );
};

/**
 * Ensure field attributes are unique across the entire form
 *
 * @since Unknown
 *
 * @param {string} field Attribute key name.
 * @param {string} str   String to check for uniqueness.
 * @return {boolean} Returns `true` when the string is unique across the form and `false` if it's not.
 */
export const isUnique = ( field, str ) => {
	return every(
		getFieldBlocks( select( 'core/block-editor' ).getBlocks() ),
		( block ) => {
			return block.attributes[ field ] !== str;
		}
	);
};
