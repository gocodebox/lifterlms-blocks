/**
 * Test formsReady() events run on domReady()
 *
 * @since 1.12.0
 * @version 1.12.0
 */

import {
	getEditedPostContent,
	insertBlock,
} from '@wordpress/e2e-test-utils';

import {
	logoutUser,
	toggleOpenRegistration,
	visitPage,
} from '@lifterlms/llms-e2e-test-utils';

import {
	clearBlocks,
	visitForm,
} from '../../../util';

describe( 'Blocks/FormFields/UserEmail', () => {

	beforeEach( async () => {

		await visitForm();

	} );

	describe( 'Editor', () => {

		beforeEach( async () => {

			await clearBlocks();
			page.once( 'dialog', async dialog => await dialog.accept() ); // Leave page without saving.

		} );

		it ( 'can be created using the block inserter', async () => {

			await insertBlock( 'User Email' );
			expect( await getEditedPostContent() ).toMatchSnapshot();

		} );

		it ( 'can be created by typing "/user_email"', async () => {

			await page.keyboard.type( '/user_email' );
			await page.waitForXPath(
				`//*[contains(@class, "components-autocomplete__result") and contains(@class, "is-selected") and contains(text(), 'User Email')]`
			);
			await page.keyboard.press( 'Enter' );
			expect( await getEditedPostContent() ).toMatchSnapshot();

		} );

	} );

	describe( 'Frontend', () => {

		it ( 'shows a user email field on the frontend', async () => {

			await toggleOpenRegistration( true );

			await logoutUser();

			await visitPage( 'dashboard' );

			expect( await page.$eval( '#email_address', el => el.parentNode.outerHTML ) ).toMatchSnapshot();

		} );

	} );


} );
