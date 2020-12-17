/**
 * Test Form post document sidebar
 *
 * @since [version]
 * @version [version]
 */

import {
	clickElementByText,
	toggleOpenRegistration,
} from '@lifterlms/llms-e2e-test-utils';

import {
	visitForm,
} from '../../util';

async function openFormSettingsPanel() {

	const isOpen = await page.$eval( '.llms-forms-doc-settings', el => el.classList.contains( 'is-opened' ) );

	if ( ! isOpen ) {
		await clickElementByText( 'Form Settings', '.components-panel .components-button' );
	}

}

describe( 'Admin/FormsDocSidebar', () => {

	it ( 'should display the location when open registration is disabled', async () => {

		await toggleOpenRegistration( false );

		await visitForm( 'Register' );

		await openFormSettingsPanel();

		expect( await page.$eval( '.llms-forms-doc-settings .components-panel__row', el => el.innerHTML ) ).toMatchSnapshot();

	} );

	it ( 'should display the location with a link when open registration is enabled', async () => {

		await toggleOpenRegistration( true );

		await visitForm( 'Register' );

		await openFormSettingsPanel();

		expect( await page.$eval( '.llms-forms-doc-settings .components-panel__row', el => el.innerHTML ) ).toMatchSnapshot();

	} );

} );
