/**
 * Test shortcode inserter
 *
 * @since 2.0.0
 * @version 2.4.3
 */

import {
	clickBlockAppender,
	getEditedPostContent,
	showBlockToolbar,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	createPost,
} from '@lifterlms/llms-e2e-test-utils';

import compare from 'node-version-compare';

const { WP_VERSION = 999 } = process.env, // If not defined assume local and latest.
	WP_5_7_COMPARISON = compare( WP_VERSION, '5.7.0' ),
	WP_5_9_COMPARISON = compare( WP_VERSION, '5.9.0' ),
	// CSS selectors.
	TOOLBAR_SELECTOR = '.block-editor-block-contextual-toolbar',
	TOOLBAR_DROPDOWN_BUTTON_SELECTOR = -1 === WP_5_9_COMPARISON ?
		'button.components-dropdown-menu__toggle' : // < 5.9
		'.components-dropdown-menu button.components-button', // >= 5.9
	DROPDOWN_SELECTOR = '.components-dropdown-menu__menu-item',
	MODAL_SELECTOR = '.llms-shortcodes-modal',
	// Aria labels.
	RICH_TEXT_MORE_LABEL = -1 === WP_5_7_COMPARISON ?
			'More rich text controls' : // < 5.7
			'More'; // >= 5.7


/**
 * Retrieve a list of the titles of all shortcodes in the inserter table.
 *
 * @since 2.0.0
 *
 * @return {string[]} List of shortcode titles.
 */
async function getVisibleTitles() {
	return await page.$$eval( `${ MODAL_SELECTOR } .llms-table tbody tr td:first-child`, els => els.map( ( { textContent } ) => textContent ) );
}

/**
 * Retrieve a list of the shortcodes visible in the inserter table.
 *
 * @since 2.0.0
 *
 * @return {string[]} List of shortcodes.
 */
async function getVisibleCodes() {
	return await page.$$eval( `${ MODAL_SELECTOR } .llms-table tbody tr td:nth-child(2)`, els => els.map( ( { textContent } ) => textContent ) );
}

/**
 * Clear the currently selected input
 *
 * @since 2.0.0
 *
 * @param {Integer} length Number of characters to remove.
 * @return {void}
 */
async function clearSearch( length ) {

	for ( let i = 0; i < length; i++ ) {
		await page.keyboard.press('Backspace');
	}

}

/**
 * Filter the shortcode list by search query
 *
 * @since 2.0.0
 *
 * @param {string} query Search query.
 * @return {void}
 */
async function filterList( query ) {
	await clickElementByText( 'Filter by label', `${ MODAL_SELECTOR } label` );
	await page.keyboard.type( query );
}

/**
 * Add a default value to the visible shortcodes
 *
 * @since 2.0.0
 *
 * @param {string} val Default value.
 * @return {void}
 */
async function addDefaultValue( val ) {
	await clickElementByText( 'Default value', `${ MODAL_SELECTOR } label` );
	await page.keyboard.type( val );
}

/**
 * Close the inserter modal
 *
 * @since 2.0.0
 *
 * @return {void}
 */
async function closeModal() {
	await click( `${ MODAL_SELECTOR } button[aria-label="Close dialog"]` );
}

describe( 'Admin/Shortcodes', () => {

	beforeAll( async() => {

		await createPost( 'post', 'Shortcodes' );

		await clickBlockAppender();

		await page.keyboard.type( 'Ipsum' );
		/**
		 * Place the cursor at the beginning of the text input to prepare for the next test.
		 * Prior to WP 5.9, in headless mode, this was the default behavior.
		 */
		await page.keyboard.down( 'Home' );
		await showBlockToolbar();

	} );

	beforeEach( async () => {

		await page.waitForSelector( TOOLBAR_SELECTOR );

		await click( `${ TOOLBAR_SELECTOR } ${ TOOLBAR_DROPDOWN_BUTTON_SELECTOR }[aria-label="${ RICH_TEXT_MORE_LABEL }"]` );
		await page.waitFor( 500 );
		await clickElementByText( 'Shortcodes', DROPDOWN_SELECTOR );

		await page.waitForSelector( MODAL_SELECTOR );

	} );

	it ( 'should filter the list', async() => {

		const queries = [ 'name', 'user', 'email' ];

		for ( let i = 0; i < queries.length; i++ ) {

			const query = queries[ i ];

			await filterList( query );
			expect( await getVisibleTitles() ).toMatchSnapshot();
			await clearSearch( query.length );
			expect( await getVisibleTitles() ).toMatchSnapshot();

		}

		await closeModal();

	} );

	it ( 'should add a default value', async() => {

		await addDefaultValue( 'default' );
		expect( await getVisibleCodes() ).toMatchSnapshot();

		await clearSearch( 7 );
		expect( await getVisibleCodes() ).toMatchSnapshot();

		await closeModal();

	} );


	it ( 'should insert the shortcode', async() => {

		await filterList( 'display' );
		await click( `${ MODAL_SELECTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );

		expect( await getEditedPostContent() ).toMatchSnapshot();
		// Place the cursor at the beginning of the text input to prepare for the next test.
		await page.keyboard.down( 'Home' );

	} );

	it ( 'should insert the shortcode with a default value', async() => {

		await filterList( 'first' );
		await addDefaultValue( 'friend' );
		await click( `${ MODAL_SELECTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );

		expect( await getEditedPostContent() ).toMatchSnapshot();
		// Place the cursor at the beginning of the text input to prepare for the next test.
		await page.keyboard.down( 'Home' );

	} );


	it ( 'should allow custom shortcodes to be used', async() => {

		await filterList( 'fake' );
		await addDefaultValue( 'test' );

		// Shows the warning message.
		expect( await page.$eval( `${ MODAL_SELECTOR } .llms-error`, ( { textContent }) => textContent ) ).toMatchSnapshot();

		// Added to the list.
		expect( await getVisibleTitles() ).toMatchSnapshot();
		expect( await getVisibleCodes() ).toMatchSnapshot();

		// Inserted.
		await click( `${ MODAL_SELECTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );

		expect( await getEditedPostContent() ).toMatchSnapshot();
		// Place the cursor at the beginning of the text input to prepare for the next test.
		await page.keyboard.down( 'Home' );

	} );

} );
