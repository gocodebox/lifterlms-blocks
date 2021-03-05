module.exports = {
	rules: {
		camelcase: [
			'error',
			{
				allow: [
					'llms_visibility*',
					'not_enrolled',
					'logged_in',
					'logged_out',
				],
			},
		],
	},
};
