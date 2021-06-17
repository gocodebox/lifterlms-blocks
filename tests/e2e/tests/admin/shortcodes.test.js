/**
 * Test shortcode inserter
 *
 * @since [version]
 * @version [version]
 */

import {
	clickBlockAppender,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	createPost,
} from '@lifterlms/llms-e2e-test-utils';

// CSS selectors.
const TOOLBAR_SELECTOR = '.block-editor-block-contextual-toolbar',
	MODAL_SELCTOR = '.llms-shortcodes-modal';

/**
 * Retrieve a list of the titles of all shortcodes in the inserter table.
 *
 * @since [version]
 *
 * @return {string[]} List of shortcode titles.
 */
async function getVisibleTitles() {
	return await page.$$eval( `${ MODAL_SELCTOR } .llms-table tbody tr td:first-child`, els => els.map( ( { textContent } ) => textContent ) );
}

/**
 * Retrieve a list of the shortcodes visible in the inserter table.
 *
 * @since [version]
 *
 * @return {string[]} List of shortcodes.
 */
async function getVisibleCodes() {
	return await page.$$eval( `${ MODAL_SELCTOR } .llms-table tbody tr td:nth-child(2)`, els => els.map( ( { textContent } ) => textContent ) );
}

/**
 * Clear the currently selected input
 *
 * @since [version]
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
 * @since [version]
 *
 * @param {string} query Search query.
 * @return {void}
 */
async function filterList( query ) {
	await clickElementByText( 'Filter by label', `${ MODAL_SELCTOR } label` );
	await page.keyboard.type( query );
}

/**
 * Add a default value to the visible shortcodes
 *
 * @since [version]
 *
 * @param {string} val Default value.
 * @return {void}
 */
async function addDefaultValue( val ) {
	await clickElementByText( 'Default value', `${ MODAL_SELCTOR } label` );
	await page.keyboard.type( val );
}

/**
 * Close the inserter modal
 *
 * @since [version]
 *
 * @return {void}
 */
async function closeModal() {
	await click( `${ MODAL_SELCTOR } button[aria-label="Close dialog"]` );
}

describe( 'Admin/Shortcodes', () => {

	beforeAll( async() => {

		await createPost( 'post', 'Shortcodes' );

		await clickBlockAppender();

		await page.keyboard.type( 'Ipsum' );
		await page.keyboard.press( 'Tab' );

	} );

	beforeEach( async () => {

		await page.waitForSelector( TOOLBAR_SELECTOR );

		await click( `${ TOOLBAR_SELECTOR } button.components-dropdown-menu__toggle[aria-label="More"]` );
		await clickElementByText( 'Shortcodes', '.components-dropdown-menu__menu-item' );

		await page.waitForSelector( MODAL_SELCTOR );

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
		await click( `${ MODAL_SELCTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );

		expect( await getEditedPostContent() ).toMatchSnapshot();

	} );

	it ( 'should insert the shortcode with a default value', async() => {

		await filterList( 'first' );
		await addDefaultValue( 'friend' );
		await click( `${ MODAL_SELCTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );

		expect( await getEditedPostContent() ).toMatchSnapshot();

	} );


	it ( 'should allow custom shortcodes to be used', async() => {

		await filterList( 'fake' );
		await addDefaultValue( 'test' );

		// Shows the warning message.
		expect( await page.$eval( `${ MODAL_SELCTOR } .llms-error`, ( { textContent }) => textContent ) ).toMatchSnapshot();

		// Added to the list.
		expect( await getVisibleTitles() ).toMatchSnapshot();
		expect( await getVisibleCodes() ).toMatchSnapshot();

		// Inserted.
		await click( `${ MODAL_SELCTOR } .llms-table tbody tr:first-child td:nth-child(3) button` );
		expect( await getEditedPostContent() ).toMatchSnapshot();

	} );

} );
