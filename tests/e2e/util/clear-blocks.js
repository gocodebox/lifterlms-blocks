import { getAllBlocks } from '@wordpress/e2e-test-utils';

/**
 * Select all blocks in the editor and then delete them
 *
 * @since 1.12.0
 *
 * @return {Void}
 */
export default async () => {
	return page.evaluate( () => window.wp.data.dispatch( 'core/block-editor' ).removeBlocks( window.wp.data.select( 'core/block-editor' ).getBlocks().map( ( { clientId } ) => clientId ) ) );
};
