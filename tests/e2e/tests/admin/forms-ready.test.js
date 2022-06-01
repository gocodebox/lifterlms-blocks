/**
 * Test formsReady() events run on domReady()
 *
 * @since 1.12.0
 * @version [version]
 */

import {
	getAllBlocks,
	getAllBlockInserterItemTitles,
	insertBlock,
	openGlobalBlockInserter,
	openDocumentSettingsSidebar,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
} from '@lifterlms/llms-e2e-test-utils';

import {
	openFormSettingsPanel,
	publishAndSaveEntities,
	removeBlockByClientId,
	visitForm,
	maybeSkipFormsTests,
} from '../../util';

async function removeUserEmailBlock() {

	const blocks = await getAllBlocks();
	await removeBlockByClientId( blocks[0].clientId );

}

async function getAvailableSidebarPanelTitles() {

	return page.$$eval( '.components-panel .block-editor-block-inspector .components-panel__body-title', els => els.map( ( { textContent } ) => textContent ) );

}

describe( 'Admin/FormsReady', () => {

	maybeSkipFormsTests();

	it ( 'should disable the use of the "Draft" button', async () => {

		const draftBtnSelector = '.edit-post-layout button.editor-post-switch-to-draft';

		await visitForm();

		// On page load.
		await page.waitFor( 5 );
		expect( await page.$eval( draftBtnSelector, el => el.style.display ) ).toBe( 'none' );

		// Add a block.
		await insertBlock( 'Paragraph' );
		await page.waitFor( 5 );
		expect( await page.$eval( draftBtnSelector, el => el.style.display ) ).toBe( 'none' );

		// After updating.
		await publishAndSaveEntities();
		await page.waitFor( 500 );
		expect( await page.$eval( draftBtnSelector, el => el.style.display ) ).toBe( 'none' );

		// Revert the form so future snapshots don't fail.
		await openFormSettingsPanel();
		await clickElementByText( 'Revert to Default', '.components-panel .components-button' );
		await page.waitForSelector( '.components-notice.is-success' );
		await publishAndSaveEntities();

	} );

	it ( 'should disable the "Status & Visibility" sidebar panel', async () => {

		await visitForm();

		// On page load.
		await page.waitFor( 5 );
		expect( await page.$eval( '.edit-post-layout .components-panel__body.edit-post-post-status', el => el.style.display ) ).toBe( 'none' );

		// Open Sidebar
		await openDocumentSettingsSidebar();
		await page.waitFor( 5 );
		expect( await page.$eval( '.edit-post-layout .components-panel__body.edit-post-post-status', el => el.style.display ) ).toBe( 'none' );

		// Close & Open again.
		await openDocumentSettingsSidebar();
		await page.waitFor( 5 );
		await openDocumentSettingsSidebar();
		expect( await page.$eval( '.edit-post-layout .components-panel__body.edit-post-post-status', el => el.style.display ) ).toBe( 'none' );

	} );

	it ( 'should add a notice and disable post updating when user email field is deleted', async () => {

		await visitForm();
		await removeUserEmailBlock();
		await page.waitForSelector( '.components-notice.is-error' );

		expect( await page.$eval( '.components-notice.is-error .components-notice__content', el => el.textContent ) ).toMatchSnapshot();

		expect( await page.$eval( 'button.editor-post-publish-button', el => el.disabled ) ).toBe( true );

	} );

	it ( 'should restore the user email field when the "Restore" CTA is used in the notice', async () => {

		await visitForm();
		await removeUserEmailBlock();
		await page.waitForSelector( '.components-notice.is-error' );

		await click( '.components-notice.is-error .components-notice__content button' );

		// Notice gets removed
		await page.waitFor( 2000 );
		expect( await page.evaluate( () => document.querySelector( '.components-notice.is-error' ) ) ).toBeNull();
		const blocks = await getAllBlocks();
		expect( blocks[0].name ).toBe( 'llms/form-field-user-email' );

		// Can be updated.
		expect( await page.$eval( 'button.editor-post-publish-button', el => el.disabled ) ).toBe( false );

	} );

	it ( 'should deregister most WP core blocks', async () => {

		await visitForm();

		await openGlobalBlockInserter();
		expect( await getAllBlockInserterItemTitles() ).toMatchSnapshot();

	} );

	it ( 'should deregister voucher block on checkout and account edit forms', async () => {

		const forms = {
			'Register': false,
			'Edit Account Information': false,
			'Billing Information': true,
		};

		for ( let form in forms ) {

			await visitForm( form );

			await openGlobalBlockInserter();
			expect( await getAllBlockInserterItemTitles() ).toMatchSnapshot();

		}

	} );

	it ( 'should deregister user login block on account edit forms', async () => {

		const forms = {
			'Register': true,
			'Edit Account Information': false,
			'Billing Information': true,
		};

		for ( let form in forms ) {

			await visitForm( form );

			await openGlobalBlockInserter();
			expect( await getAllBlockInserterItemTitles() ).toMatchSnapshot();

		}

	} );


	const forms = {
		'Register': false,
		'Edit Account Information': false,
		'Billing Information': true,
	};

	for ( let form in forms ) {

		const verb = forms[ form ] ? 'allow' : 'disable';

		it ( `should ${ verb } block-level visibility settings for the "${ form }" form`, async () => {

			await visitForm( form );

			await page.click( '.block-editor-block-list__layout .wp-block-llms-form-field-user-phone .llms-field > label' );

			await page.waitFor( 500 );

			const titles = await getAvailableSidebarPanelTitles();
			expect( titles.includes( 'Enrollment Visibility' ) ).toStrictEqual( forms[ form ] );

		} );

	}



} );
