/**
 * Bootstraps E2E Tests.
 *
 * @since 2.4.3
 */

 import { activateTheme, runSetupWizard } from '@lifterlms/llms-e2e-test-utils';


 describe( 'Bootstrap', () => {

	 /**
	  * This first test will intermittently fail with the fetch_error "You are probably offline".
	  *
	  * I suspect this error comes from the dashboard's widgets when loading WP meetup events since
	  * it makes an async request to pull the data when none yet exists but I can't exactly recreate it
	  * and narrow it down or figure out how to turn that off with WP-CLI or something.
	  *
	  * I've never been able to reproduce the error locally. It only intermittently happens in the CI.
	  *
	  * @link https://github.com/WordPress/gutenberg/discussions/34856
	  * @link https://github.com/WordPress/gutenberg/issues/39862
	  */
	 jest.retryTimes( 2 );
	 it ( 'should configure the correct theme based on the tested WP version.', async () => {
		 await activateTheme();
	 } );

	 it ( 'should load and run the entire setup wizard.', async () => {
		 await runSetupWizard();
	 } );

 } );
