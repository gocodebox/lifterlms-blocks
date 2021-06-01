import { clickElementByText } from '@lifterlms/llms-e2e-test-utils';

/**
 * Opens the "LifterLMS Form" document settings panel (sidebar) in the block editor
 *
 * @since [version]
 *
 * @return {Object} Returns element selector for the opened panel.
 */
export default async () => {

	await clickElementByText( 'Form', '.components-button.edit-post-sidebar__panel-tab' );

	const isOpen = await page.$eval( '.llms-forms-doc-settings', el => el.classList.contains( 'is-opened' ) );

	if ( ! isOpen ) {
		await clickElementByText( 'Form Settings', '.components-panel .components-button' );
	}

	return page.waitForSelector( '.components-panel__body.llms-forms-doc-settings.is-opened')

}
