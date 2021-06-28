
import { click } from '@lifterlms/llms-e2e-test-utils';

const BUTTON_SELECTOR = '.edit-post-header__settings button[aria-label="LifterLMS"]';

async function waitForButton() {
	return await page.waitForSelector( BUTTON_SELECTOR );
}

export async function isSidebarOpen() {

	await waitForButton();
	return await page.$eval( BUTTON_SELECTOR, el => el.classList.contains( 'is-pressed' ) );

}

export async function openSidebar() {

	const isOpen = await isSidebarOpen();
	if ( ! isOpen ) {
		await clickSidebarButton();
	}

}

export async function closeSidebar() {

	const isOpen = await isSidebarOpen();
	if ( isOpen ) {
		await clickSidebarButton();
	}

}

export async function clickSidebarButton() {

	await waitForButton();
 	await click( BUTTON_SELECTOR );
 	return await page.waitForSelector( '.edit-post-sidebar' );

}
