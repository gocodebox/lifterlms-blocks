import {
	click,
} from '@lifterlms/llms-e2e-test-utils';

export default async () => {

	const entitiesSaveSelector = '.editor-entities-saved-states__save-button';

	// Clicks the "Update" button in the editor header bar.
	await page.click( '.editor-post-publish-button' );

	// Wait for the entities save button to show up.
	try {

		await page.waitForSelector( entitiesSaveSelector, { timeout: 2000 } );

	// If it doesn't, we don't have any entities to save and the first click attempt worked just fine.
	} catch ( e ) {

		// Wait for the snackbar to confirm the save (this is how the wp core publishPost() e2e test util works).
		return page.waitForSelector( '.components-snackbar' );
	}

	// Click the save entities button.
	return click( entitiesSaveSelector );

};
