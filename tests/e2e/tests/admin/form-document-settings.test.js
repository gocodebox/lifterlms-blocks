/**
 * Test Form post document sidebar
 *
 * @since 1.12.0
 * @version 2.4.3
 */

import {
	getAllBlocks,
	insertBlock,
	openDocumentSettingsSidebar,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	toggleOpenRegistration,
} from '@lifterlms/llms-e2e-test-utils';

import {
	blockSnapshotMatcher,
	openFormSettingsPanel,
	removeBlockByClientId,
	visitForm,
} from '../../util';

import { maybeSkipFormsTests } from '../../util';

async function getAllBlockNames() {
	const blocks = await getAllBlocks();
	return blocks.map( ( { name } ) => name );
}

describe( 'Admin/FormsDocSidebar', () => {

	maybeSkipFormsTests();

	describe( 'LocationDisplay', () => {

		it ( 'should display the location when open registration is disabled', async () => {

			await toggleOpenRegistration( false );

			await visitForm( 'Register' );
			await openFormSettingsPanel();

			expect( await page.$eval( '.llms-forms-doc-settings .components-panel__row', el => el.textContent ) ).toMatchSnapshot();

		} );

		it ( 'should display the location with a link when open registration is enabled', async () => {

			await toggleOpenRegistration( true );

			await visitForm( 'Register' );
			await openFormSettingsPanel();

			expect( await page.$eval( '.llms-forms-doc-settings .components-panel__row a', el => el.textContent ) ).toMatchSnapshot();

		} );

	} );

	describe( 'TemplateRevert', () => {

		it ( 'should allow a form to be reverted to the default layout', async () => {

			await visitForm( 'Register' );

			// Add a new block.
			await insertBlock( 'Paragraph' );
			await page.keyboard.type( 'Lorem ipsum' );

			// Remove the last field block on screen.
			let blocks = await getAllBlocks();
			const lastBlock = blocks[ blocks.length - 2 ];
			await removeBlockByClientId( lastBlock.clientId );

			// Revert.
			await openFormSettingsPanel();
			await clickElementByText( 'Revert to Default', '.components-panel .components-button' );

			// Notice should display.
			await page.waitForSelector( '.components-notice.is-success' );
			expect( await page.$eval( '.components-notice.is-success .components-notice__content', el => el.textContent ) ).toMatchSnapshot();

			// Match block list.
			expect( await getAllBlockNames() ).toMatchSnapshot();

			// Undo the revert.
			await click( '.components-notice.is-success .components-notice__content button' );

			// Notice gets removed
			expect( await page.evaluate( () => document.querySelector( '.components-notice.is-success' ) ) ).toBeNull();

			await page.waitFor( 1000 );

			// Changes before the revert should be found.
			expect( await getAllBlockNames() ).toMatchSnapshot();

		} );

	} );


} );
