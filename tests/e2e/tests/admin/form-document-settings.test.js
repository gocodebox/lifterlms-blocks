/**
 * Test Form post document sidebar
 *
 * @since [version]
 * @version [version]
 */

import {
	getAllBlocks,
	insertBlock,
	openDocumentSettingsSidebar,
	// publishPostWithPrePublishChecksDisabled,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	toggleOpenRegistration,
} from '@lifterlms/llms-e2e-test-utils';

import {
	visitForm,
} from '../../util';

async function openFormSettingsPanel() {

	await clickElementByText( 'LifterLMS Form', '.components-button.edit-post-sidebar__panel-tab' );

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

	it ( 'should allow a form to be reverted to the default layout', async () => {

		async function findBlock( type, content = null ) {
			const
				blocks   = await getAllBlocks(),
				matching = blocks.filter( block => {
					if ( type !== block.name ) {
						return false;
					} else if ( null !== content && content !== block.attributes.content ) {
						return false;
					}
					return true;
				} );
			return matching.length ? matching[0] : false;
		}

		async function getBlocksSansIds() {

			function deleteClientId( block ) {
				delete block.clientId;
				if ( block.innerBlocks.length ) {
					block.innerBlocks.map( block => { return deleteClientId( block ) } );
				}
				return block;
			}

			const blocks = await getAllBlocks();
			return blocks.map( block => { return deleteClientId( block ) } );
		}

		await visitForm( 'Register' );

		// Delete the last block on the screen.
		const phoneBlock = await findBlock( 'llms/form-field-user-phone' );
		await selectBlockByClientId( phoneBlock.clientId );
		await click( 'button.components-dropdown-menu__toggle[aria-label="More options"]' );
		await clickElementByText( 'Remove block' );

		// Add a new block.
		await insertBlock( 'Paragraph' );
		await page.waitFor( 5 );
		await page.keyboard.type( 'Lorem ipsum' );

		await openFormSettingsPanel();
		await clickElementByText( 'Revert to Default', '.components-panel .components-button' );

		// Notice should display.
		await page.waitForSelector( '.components-notice.is-success' );
		expect( await page.$eval( '.components-notice.is-success .components-notice__content', el => el.innerHTML ) ).toMatchSnapshot();

		// Phone block should be back.
		expect( await findBlock( 'llms/form-field-user-phone' ) ).toBeTruthy();

		// Lipsum paragraph block should be gone.
		expect( await findBlock( 'core/paragraph', 'Lorem ipsum' ) ).toStrictEqual( false );

		// Blocks should match the initial default layout.
		expect( await getBlocksSansIds() ).toMatchSnapshot();

		// Undo the revert.
		await click( '.components-notice.is-success .components-notice__content button' );

		// Notice gets removed
		expect( await page.evaluate( () => document.querySelector( '.components-notice.is-success' ) ) ).toBeNull();

		// Changes before the revert should be found.
		expect( await getBlocksSansIds() ).toMatchSnapshot();

	} );

} );
