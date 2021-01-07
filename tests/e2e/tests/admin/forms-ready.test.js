/**
 * Test formsReady() events run on domReady()
 *
 * @since [version]
 * @version [version]
 */

import {
	getAllBlocks,
	getAllBlockInserterItemTitles,
	insertBlock,
	openGlobalBlockInserter,
	openDocumentSettingsSidebar,
	publishPostWithPrePublishChecksDisabled,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
} from '@lifterlms/llms-e2e-test-utils';

import {
	visitForm,
} from '../../util';

async function removeUserEmailBlock() {

	const blocks = await getAllBlocks();
	await selectBlockByClientId( blocks[0].clientId );

	await click( 'button.components-dropdown-menu__toggle[aria-label="More options"]' );
	await clickElementByText( 'Remove block' );

}

describe( 'Admin/FormsReady', () => {

	it ( 'should disable the use of the "Draft" button', async () => {

		await visitForm();

		// On page load.
		await page.waitFor( 5 );
		expect( await page.$eval( '.edit-post-layout button.editor-post-switch-to-draft', el => el.style.display ) ).toBe( 'none' );

		// Add a block.
		await insertBlock( 'Paragraph' );
		await page.waitFor( 5 );
		expect( await page.$eval( '.edit-post-layout button.editor-post-switch-to-draft', el => el.style.display ) ).toBe( 'none' );

		// After updating.
		await publishPostWithPrePublishChecksDisabled();
		await page.waitFor( 5 );
		expect( await page.$eval( '.edit-post-layout button.editor-post-switch-to-draft', el => el.style.display ) ).toBe( 'none' );

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

		page.on( 'dialog', dialog => dialog.accept() ); // Leave page without saving.

		await visitForm();
		await removeUserEmailBlock();
		await page.waitForSelector( '.components-notice.is-error' );

		expect( await page.$eval( '.components-notice.is-error .components-notice__content', el => el.innerHTML ) ).toMatchSnapshot();

		expect( await page.$eval( 'button.editor-post-publish-button', el => el.disabled ) ).toBe( true );

	} );

	it ( 'should restore the user email field when the "Restore" CTA is used in the notice', async () => {

		await visitForm();
		await removeUserEmailBlock();
		await page.waitForSelector( '.components-notice.is-error' );

		await click( '.components-notice.is-error .components-notice__content button' );

		// Notice gets removed
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

	it ( 'should disable block-level visibility settings on the registration form', async () => {

		await visitForm( 'Register' );

		const blocks = await getAllBlocks();
		await selectBlockByClientId( blocks[0].clientId );

		expect( await page.$eval( '.components-panel .block-editor-block-inspector div:nth-child(3) .components-panel__body-title', el => el.textContent ) ).toBe( 'Advanced' );

	} );

	it ( 'should disable block-level visibility settings on the account edit form', async () => {

		await visitForm( 'Edit Account Information' );

		const blocks = await getAllBlocks();
		await selectBlockByClientId( blocks[0].clientId );

		expect( await page.$eval( '.components-panel .block-editor-block-inspector div:nth-child(3) .components-panel__body-title', el => el.textContent ) ).toBe( 'Advanced' );

	} );

	it ( 'should disable allow block-level visibility settings on the checkout form', async () => {

		await visitForm( 'Billing Information' );

		const blocks = await getAllBlocks();
		await selectBlockByClientId( blocks[0].clientId );

		expect( await page.$eval( '.components-panel .block-editor-block-inspector div:nth-child(2) .components-panel__body-title', el => el.textContent ) ).toBe( 'Enrollment Visibility' );

	} );

} );
