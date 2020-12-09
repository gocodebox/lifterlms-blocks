/**
 * E2E Setup and Activation
 *
 * Runs the LifterLMS Setup Wizard.
 *
 * @since [version]
 * @version [version]
 */

import { runSetupWizard } from '@lifterlms/llms-e2e-test-utils';

describe( 'SetupWizard', () => {

	it ( 'should load and run the entire setup wizard.', async () => {

		await runSetupWizard();

	} );

} );
