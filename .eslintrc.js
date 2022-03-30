const config = require( '@lifterlms/scripts/config/.eslintrc.js' );

module.exports = {
	...config,
	// @TODO Clean these up.
	rules: {
		'no-shadow': [ 1 ],
	}
};
