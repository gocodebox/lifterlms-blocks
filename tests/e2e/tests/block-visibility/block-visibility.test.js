/**
 * Test formsReady() events run on domReady()
 *
 * @since 1.12.0
 * @version 1.12.0
 */

import {
	clickBlockAppender,
	createNewPost,
	getEditedPostContent,
	insertBlock,
	findSidebarPanelWithTitle,
} from '@wordpress/e2e-test-utils';

import {
	fillField,
} from '@lifterlms/llms-e2e-test-utils';

// import {
// 	clearBlocks,
// 	visitForm,
// } from '../../../util';

const edRootSelector = '.block-editor-block-list__layout.is-root-container';

describe( 'BlockVisibility', () => {

	beforeEach( async () => {

		await createNewPost();

		// Add a paragraph to test.
		await clickBlockAppender();
		await page.keyboard.type( 'Lorem ipsum' );

		page.once( 'dialog', async dialog => await dialog.accept() ); // Leave page without saving.

	} );

	it ( 'should do nothing with default values', async () => {

		// Element in the post content doesn't have any visibility attributes.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// The DOM should not be outputting any visibility elements in the preview/editor area.
		expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ edRootSelector } .llms-block-visibility` ) ).toBeNull();

	} );

	it ( 'should restrict a block to enrolled users', async () => {

		await page.select( '.llms-visibility-select select', 'enrolled' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await page.$eval( `${ edRootSelector } .llms-block-visibility .llms-block-visibility--indicator`, el => el.innerHTML ) ).toMatchSnapshot();

	} );

	it ( 'should restrict a block to non-enrolled users', async () => {

		await page.select( '.llms-visibility-select select', 'not_enrolled' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await page.$eval( `${ edRootSelector } .llms-block-visibility .llms-block-visibility--indicator`, el => el.innerHTML ) ).toMatchSnapshot();

	} );

	it ( 'should restrict a block to users in specific courses and/or memberships', async () => {

		await page.select( '.llms-visibility-select select', 'enrolled' );


		await page.waitForSelector( '.llms-visibility-select--in select' );
		await page.select( '.llms-visibility-select--in select', 'list_all' );

		await fillField( '.llms-search--course .llms-search__input input[type="text"]', 'Quickstart' );
		await page.waitForSelector( '.llms-search--course .llms-search__menu' );
		await page.keyboard.press( 'Enter' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await page.$eval( `${ edRootSelector } .llms-block-visibility .llms-block-visibility--indicator`, el => el.innerHTML ) ).toMatchSnapshot();

	} );

	it ( 'should restrict a block to logged in users', async () => {

		await page.select( '.llms-visibility-select select', 'logged_in' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await page.$eval( `${ edRootSelector } .llms-block-visibility .llms-block-visibility--indicator`, el => el.innerHTML ) ).toMatchSnapshot();

	} );

	it ( 'should restrict a block to logged out users', async () => {

		await page.select( '.llms-visibility-select select', 'logged_out' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await page.$eval( `${ edRootSelector } .llms-block-visibility .llms-block-visibility--indicator`, el => el.innerHTML ) ).toMatchSnapshot();

	} );

	describe( 'Unsupported', () => {

		it ( 'should not show visibility settings for the classic block', async () => {

			await insertBlock( 'Classic' );

			// Element in the post content doesn't have any visibility attributes.
			expect( await getEditedPostContent() ).toMatchSnapshot();

			// The DOM should not be outputting any visibility elements in the preview/editor area.
			expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ edRootSelector } .llms-block-visibility` ) ).toBeNull();

		} );

		it ( 'should not show visibility settings for "dynamic" blocks', async () => {

			await insertBlock( 'Archives' );

			// Element in the post content doesn't have any visibility attributes.
			expect( await getEditedPostContent() ).toMatchSnapshot();

			// The DOM should not be outputting any visibility elements in the preview/editor area.
			expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ edRootSelector } .llms-block-visibility` ) ).toBeNull();

		} );

	} );



} );
