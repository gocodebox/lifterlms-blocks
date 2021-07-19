import { showBlockToolbar } from '@wordpress/e2e-test-utils'

/**
 * Transform a block to a type
 *
 * This is a modified version of the method of the same name from @wordpress/e2e-test-utlis.
 *
 * This modification adds a delay after scrolling buttons into view. During my testing the clicks
 * following `element.scrollIntoVie()` would fail inconsistently. I can't find a way to add a proper
 * callback to wait for the scroll to finish so I'm just adding delays here.
 *
 * @since [version]
 *
 * @link https://github.com/WordPress/gutenberg/blob/trunk/packages/e2e-test-utils/src/transform-block-to.js
 *
 * @param {string} name Block name.
 */
export async function transformBlockTo( name ) {

	await showBlockToolbar();

	const switcherToggle = await page.waitForSelector(
		'.block-editor-block-switcher__toggle'
	);
	await switcherToggle.evaluate( ( element ) => element.scrollIntoView() );
	await page.waitForSelector( '.block-editor-block-switcher__toggle', {
		visible: true,
	} );
	await page.waitFor( 1000 );
	await switcherToggle.click();
	await page.waitForSelector( '.block-editor-block-switcher__container', {
		visible: true,
	} );

	// Find the block button option within the switcher popover.
	const xpath = `//*[contains(@class, "block-editor-block-switcher__popover")]//button[.='${ name }']`;
	const insertButton = await page.waitForXPath( xpath, { visible: true } );
	// Clicks may fail if the button is out of view. Assure it is before click.
	await insertButton.evaluate( ( element ) => element.scrollIntoView() );
	await page.waitFor( 1000 );
	await insertButton.click();

	// Wait for the transformed block to appear.
	const BLOCK_SELECTOR = '.block-editor-block-list__block';
	const BLOCK_NAME_SELECTOR = `[data-title="${ name }"]`;
	return await page.waitForSelector( `${ BLOCK_SELECTOR }${ BLOCK_NAME_SELECTOR }` );

}
