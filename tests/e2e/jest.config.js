const config = require( '@lifterlms/scripts/e2e/jest.config.js' );

// Copied from ./util/should-run-tests
function shouldRunTestsForForms() {

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

// Exclude the whole file because snapshots are showing as "obsolete" when running in skipped environments causing CI to fail.
if ( ! shouldRunTestsForForms() ) {
	config.testPathIgnorePatterns = [
		...config.testPathIgnorePatterns,
		'blocks/fields.test.js',
	];
}

module.exports = config;
