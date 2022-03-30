/**
 * Test the instructors sidebar plugin
 *
 * @since 2.1.0
 * @version 2.1.0
 */

import { createNewPost } from "@wordpress/e2e-test-utils";
import { click, fillField } from "@lifterlms/llms-e2e-test-utils";

import { dragAndDrop, openSidebar } from "../../util";

const ITEM_SELECTOR = ".components-panel .llms-sortable-list .llms-instructor";

function getInstructorIndexSelector( nthChild ) {
	return `${ ITEM_SELECTOR }:nth-child( ${ nthChild } )`;
}

async function getInstructorNames() {
	return await page.$$eval(
		`${ ITEM_SELECTOR } .llms-instructor--header strong`,
		(els) => els.map(({ innerHTML }) => innerHTML)
	);
}

async function toggleEdit( nthChild ) {
	const INDEX_SELECTOR = getInstructorIndexSelector( nthChild );
	await click(`${ INDEX_SELECTOR } button[aria-label="Edit instructor"]`);
	return page.waitForTimeout( 500 );
}

async function reorderInstructor( draggingNthChild, droppingNthChild ) {

	const BUTTON_SELECTOR = 'button[aria-label="Reorder instructor"]';

	await dragAndDrop(
		`${ getInstructorIndexSelector( draggingNthChild ) } ${ BUTTON_SELECTOR }`,
		`${ getInstructorIndexSelector( droppingNthChild ) } ${ BUTTON_SELECTOR }` );
	await page.waitForTimeout( 500 );

}

describe( 'Sidebar/Plugins/Instructors', () => {

	beforeAll( async () => {

		page.once( 'dialog', async dialog => await dialog.accept() )

		const CLOSE_SELECTOR =
			'.editor-post-publish-panel button[aria-label="Close panel"]';

		await createNewPost( { postType: 'course', title: 'instructors' } );

		await openSidebar();

	} );

	test( 'Current user is the default primary instructor', async () => {

		// Admin user is the only instructor.
		expect( await getInstructorNames() ).toMatchSnapshot();

		// Primary instructor star exists.
		expect( await page.$eval( `${ ITEM_SELECTOR } .dashicons-star-filled`, ( el ) => el.outerHTML ? true : false ) ).toBe( true );

	} );

	test( 'Primary instructors cannot be removed', async () => {
		await toggleEdit( 1 ); // Open
		expect( await page.evaluate( ( sel ) => document.querySelector( sel ), `${ getInstructorIndexSelector( 1 ) } .llms-instructor--settings button.is-destructive` ) ).toBe( null );
		await toggleEdit( 1 ); // Close
	} );

	test( 'Instructors can be added', async () => {

		await fillField( '.llms-search--user .llms-search__input input[type="text"]', 'Knox' );

		await page.waitForTimeout( 1000 );

		await page.waitForTimeoutSelector( '.llms-search--user .llms-search__menu' );
		await page.keyboard.press( 'Enter' );

		await page.waitForTimeoutSelector( getInstructorIndexSelector( 2 ) );

		expect( await getInstructorNames() ).toMatchSnapshot();

	} );

	test( 'Instructors can be reordered', async () => {
		await reorderInstructor( 2, 1 );
		expect( await getInstructorNames() ).toMatchSnapshot();
	} );

	test( 'Non-primary instructors can be removed', async () => {

		const BUTTON_SELECTOR = `${ getInstructorIndexSelector( 2 ) } button.is-destructive`;

		await toggleEdit( 2 );
		await page.waitForTimeout( BUTTON_SELECTOR );
		await click( BUTTON_SELECTOR );
		await page.waitForTimeout( 500 );

		expect( await getInstructorNames() ).toMatchSnapshot();

	} );

} );
