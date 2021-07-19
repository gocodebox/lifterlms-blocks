import {
	clickBlockToolbarButton,
} from '@wordpress/e2e-test-utils';

import {
	clickElementByText,
} from '@lifterlms/llms-e2e-test-utils';

/**
 * Click a menu item from the block toolbar "Options" (...) menu.
 *
 * @since 2.2.0
 *
 * @param {string} option Option menu item name. EG: "Group" or "Remove Block".
 * @return {void}
 */
export async function clickBlockToolbarOption( option ) {

	const MENU_SELECTOR = '.block-editor-block-settings-menu__popover .components-popover__content';

	await clickBlockToolbarButton( 'Options' );
	await page.waitForSelector( MENU_SELECTOR );

	await page.waitFor( 1000 );

	await clickElementByText( option, `${ MENU_SELECTOR } .components-menu-item__item` );

	return await page.waitFor( 1000 );

}
