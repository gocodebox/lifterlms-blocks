/**
 * ??
 *
 * @since Unknown
 * @since 1.8.0 Updated lodash imports.
 */

const { select } = wp.data;

import { every, forEach } from 'lodash';

function getFieldBlocks() {
	const ret = [];

	const checkBlock = ( block ) => {
		if ( block.innerBlocks.length ) {
			return checkBlocks( block.innerBlocks );
		}

		if ( -1 === block.name.indexOf( 'llms/form-field' ) ) {
			return false;
		}

		return block;
	};

	const checkBlocks = ( blocks ) => {
		forEach( blocks, ( block ) => {
			if ( checkBlock( block ) ) {
				ret.push( block );
			}
		} );
	};

	checkBlocks( select( 'core/block-editor' ).getBlocks() );

	return ret;
}

export const isUnique = ( field, str ) => {
	return every( getFieldBlocks(), ( block ) => {
		return block.attributes[ field ] !== str;
	} );
};
