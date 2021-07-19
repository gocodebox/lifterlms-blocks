import compare from 'node-version-compare';
import { click } from '@lifterlms/llms-e2e-test-utils';
import { clickBlockToolbarOption } from './';

/**
 * Handle the WP 5.8 & later reusable block creation modal/form
 *
 * @since [version]
 *
 * @param {String} name Title of the reusable block.
 * @return {void}
 */
async function handleModal( name ) {

	const MODAL_SELECTOR = '.reusable-blocks-menu-items__convert-modal',
		INPUT_LABEL_SELECTOR = `${ MODAL_SELECTOR } label`,
		BUTTON_SELECTOR = `${ MODAL_SELECTOR } .reusable-blocks-menu-items__convert-modal-actions .components-button.is-primary`;


	await page.waitForSelector( MODAL_SELECTOR );
	await click( INPUT_LABEL_SELECTOR );

	await page.keyboard.type( name );

	await click( BUTTON_SELECTOR );

}

/**
 * Convert a block to a reusable block
 *
 * @since [version]
 *
 * @param {String} name Title of the reusable block.
 * @return {void}
 */
export async function convertBlockToReusable( name = 'Reusable' ) {

	await clickBlockToolbarOption( 'Add to Reusable blocks' );

	// WP 5.8+ pop a modal to name the block before conversion whereas 5.7.2 and earlier create the block with "Untitled Reusable Block" as the name.
	const { WP_VERSION = 999 } = process.env; // If not defined assume local and latest.
	if ( 1 === compare( WP_VERSION, '5.8' ) ) {
		await handleModal( name );
	}

	return await page.waitForSelector( '.block-editor-block-list__block.wp-block-block.is-selected' );

} 
