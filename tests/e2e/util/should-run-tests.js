/**
 * Determine if form-related tests can be run.
 *
 * Since WP 5.7 or later is required to manage the forms UI we'll conditionally
 * skip E2E tests on 5.6 or earlier.
 *
 * The WP_VERSION variable is set in the CI environment. Locally it will not be set
 * and tests will run if the version isn't set.
 *
 * @since 2.1.0
 * @since 2.4.3 Updated to run tests on WP 6.0+. 
 *
 * @return {boolean} Returns `true` if forms tests should be run, otherwise false.
 */
export function shouldRunTestsForForms() {

	const { WP_VERSION } = process.env;

	// If not set, assume we're running locally where it wouldn't be set & let the dev determine if the failing tests matter.
	if ( ! WP_VERSION ) {
		return true;
	}

	// We're adding this when 5.7 is the latest and we're okay on both latest & nightly builds.
	if ( [ 'latest', 'nightly' ].includes( WP_VERSION ) ) {
		return true;
	}

	const [ major, minor ] = WP_VERSION.split( '.' ).map( number => number ? number * 1 : null );

	// Run on WP 6.0+.
	if ( major >= 6 ) {
		return true;
	}
	
	// Versions earlier than 5 are certainly a no go.
	if ( major < 5 ) {
		return false;
	}

	// 5.6 or earlier are a no go.
	if ( minor <= 6 ) {
		return false;
	}

	// We're looking at 5.7 or later.
	return true;

};

/**
 * Skip a tests suite if form requirements aren't met.
 *
 * This should be called at the opening of a `describe()` block before any other
 * tests are declared.
 *
 * This will force an empty test to be the only test in the block to run and
 * log a warning message.
 *
 * @since 2.1.0
 *
 * @return {void}
 */
export function maybeSkipFormsTests() {
	if ( ! shouldRunTestsForForms() ) {
		it.only( '', () => {
			console.log( `Tests skipped for WP_VERSION ${ process.env.WP_VERSION }.` );
		} );
	}
}
