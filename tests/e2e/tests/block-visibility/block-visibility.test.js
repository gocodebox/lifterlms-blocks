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

import compare from 'node-version-compare';

const { WP_VERSION = 999 } = process.env, // If not defined assume local and latest.
	ICON_COMPARISON = compare( WP_VERSION, '5.6.0' ),
	INDICATOR_ICON_SELECTOR = -1 === ICON_COMPARISON ?
		'span.dashicons-visibility' : // < 5.6
		'svg.dashicons-visibility', // >= 5.6
	EDITOR_ROOT_SELECTOR = '.block-editor-block-list__layout.is-root-container',
	INDICATOR_SELECTOR = `${ EDITOR_ROOT_SELECTOR } .llms-block-visibility .llms-block-visibility--indicator`;

/**
 * Retrieve the text of the indicator message
 *
 * @since 2.1.0
 *
 * @return {string} Indicator message text
 */
async function getVisibilityIndicatorMsg() {
	const SELECTOR = `${ INDICATOR_SELECTOR } .llms-block-visibility--msg`;
	await page.waitForSelector( SELECTOR );
	return await page.$eval( SELECTOR, el => el.innerHTML );
}

/**
 * Retrieve a boolean indicating whether or not an indicator icon exists within the indicator area
 *
 * @since 2.1.0
 *
 * @return {Boolean} Returns `true` if the icon is found otherwise false.
 */
async function getVisibilityIndicatorIcon() {
	const SELECTOR = `${ INDICATOR_SELECTOR } ${ INDICATOR_ICON_SELECTOR }`;
	await page.waitForSelector( SELECTOR );
	return await page.$eval( SELECTOR, el => el.outerHTML ? true : false );
}

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
		expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ EDITOR_ROOT_SELECTOR } .llms-block-visibility` ) ).toBeNull();

	} );

	it ( 'should restrict a block to enrolled users', async () => {

		await page.select( '.llms-visibility-select select', 'enrolled' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await getVisibilityIndicatorMsg() ).toMatchSnapshot();
		expect( await getVisibilityIndicatorIcon() ).toBe( true );

	} );

	it ( 'should restrict a block to non-enrolled users', async () => {

		await page.select( '.llms-visibility-select select', 'not_enrolled' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await getVisibilityIndicatorMsg() ).toMatchSnapshot();
		expect( await getVisibilityIndicatorIcon() ).toBe( true );

	} );

	it ( 'should restrict a block to users in specific courses and/or memberships', async () => {

		await page.select( '.llms-visibility-select select', 'enrolled' );


		await page.waitForSelector( '.llms-visibility-select--in select' );
		await page.select( '.llms-visibility-select--in select', 'list_all' );

		await fillField( '.llms-search--course .llms-search__input input[type="text"]', 'Quickstart' );
		await page.waitForSelector( '.llms-search--course .llms-search__menu' );
		await page.keyboard.press( 'Enter' );

		await page.waitFor( 1000 );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await getVisibilityIndicatorMsg() ).toMatchSnapshot();
		expect( await getVisibilityIndicatorIcon() ).toBe( true );

	} );

	it ( 'should restrict a block to logged in users', async () => {

		await page.select( '.llms-visibility-select select', 'logged_in' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await getVisibilityIndicatorMsg() ).toMatchSnapshot();
		expect( await getVisibilityIndicatorIcon() ).toBe( true );

	} );

	it ( 'should restrict a block to logged out users', async () => {

		await page.select( '.llms-visibility-select select', 'logged_out' );

		// Attributes added to the post content.
		expect( await getEditedPostContent() ).toMatchSnapshot();

		// Indicator is visible in the DOM.
		expect( await getVisibilityIndicatorMsg() ).toMatchSnapshot();
		expect( await getVisibilityIndicatorIcon() ).toBe( true );

	} );

	describe( 'Unsupported', () => {

		it ( 'should not show visibility settings for the classic block', async () => {

			await insertBlock( 'Classic' );

			// Element in the post content doesn't have any visibility attributes.
			expect( await getEditedPostContent() ).toMatchSnapshot();

			// The DOM should not be outputting any visibility elements in the preview/editor area.
			expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ EDITOR_ROOT_SELECTOR } .llms-block-visibility` ) ).toBeNull();

		} );

		it ( 'should not show visibility settings for "dynamic" blocks', async () => {

			await insertBlock( 'Archives' );

			// Element in the post content doesn't have any visibility attributes.
			expect( await getEditedPostContent() ).toMatchSnapshot();

			// The DOM should not be outputting any visibility elements in the preview/editor area.
			expect( await page.evaluate( ( selector ) => document.querySelector( selector ), `${ EDITOR_ROOT_SELECTOR } .llms-block-visibility` ) ).toBeNull();

		} );

	} );



} );
