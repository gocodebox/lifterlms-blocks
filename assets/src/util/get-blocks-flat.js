/**
 * Block List Flattening Utilities.
 *
 * Recursively loops through all nested blocks and returns
 * a flat array of every block in the layout.
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const { select } = wp.data;

/**
 * Recursively pulls inner/nested blocks to return a flat array of blocks.
 *
 * @since 1.6.0
 *
 * @param {Array} blocks Array of WP Blocks.
 * @return {Array}
 */
export const flattenBlocks = ( blocks ) => {

	let flat = [];

	blocks.forEach( block => {
		if ( block.innerBlocks.length ) {
			flat = flat.concat( flattenBlocks( block.innerBlocks ) );
		} else {
			flat.push( block );
		}
	} );

	return flat;

};

/**
 * Retrieve an array of flattened blocks from the block editor.
 *
 * @since 1.6.0
 * @since 1.7.0 Backwards compat fix: fallback to `core/editor` if `core/block-editor` isn't available
 *
 * @return {Array}
 */
export default () => {

	const editor = select( 'core/block-editor') || select ( 'core/editor' );

	return flattenBlocks( editor.getBlocks() );

};
