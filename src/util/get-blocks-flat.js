/**
 * Retrieve a flattened array of blocks.
 *
 * Recursively loops through all nested blocks and returns
 * a flat array of every block in the layout.
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const
	{ select } = wp.data;

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

export default () => {

	return flattenBlocks( select( 'core/block-editor' ).getBlocks() );

};
