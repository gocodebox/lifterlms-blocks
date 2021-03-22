module.exports = {

	extends: [
	 'plugin:@wordpress/eslint-plugin/recommended',
	],
	rules: {
		/**
		 * For the time being display warnings for these but leave them alone
		 *
		 * @todo Clean these up.
		 */
		'no-shadow': [ 1 ],
	}

};
