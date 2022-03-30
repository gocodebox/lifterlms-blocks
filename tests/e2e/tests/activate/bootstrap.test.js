/**
 * Bootstrap e2e tests.
 *
 * @since 1.11.0
 * @since [version] Add theme setup based on the current WP version.
 */

import { activateTheme, visitPage, runSetupWizard } from '@lifterlms/llms-e2e-test-utils';

describe( 'Bootstrap', () => {

	jest.retryTimes( 2 );
	it ( 'should configure the correct theme based on the tested WP version.', async () => {
		await activateTheme();
	} );

	it ( 'should load and run the entire setup wizard.', async () => {
		await runSetupWizard();
	} );

} );
