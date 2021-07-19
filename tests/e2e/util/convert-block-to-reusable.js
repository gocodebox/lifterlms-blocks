import { clickBlockToolbarOption } from './';
import { click } from '@lifterlms/llms-e2e-test-utils';

const MODAL_SELECTOR = '.reusable-blocks-menu-items__convert-modal',
	INPUT_LABEL_SELECTOR = `${ MODAL_SELECTOR } label`,
	BUTTON_SELECTOR = `${ MODAL_SELECTOR } .reusable-blocks-menu-items__convert-modal-actions .components-button.is-primary`;

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

	await page.waitForSelector( MODAL_SELECTOR );
	await click( INPUT_LABEL_SELECTOR );

	await page.keyboard.type( name );

	await click( BUTTON_SELECTOR );

	return await page.waitForSelector( '.block-editor-block-list__block.wp-block-block.is-selected' );

} 
