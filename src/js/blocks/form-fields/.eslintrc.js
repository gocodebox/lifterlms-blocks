module.exports = {
	rules: {
		camelcase: [
			'error',
			{
				allow: [
					'data_store*',
					'llms_*',
					'label_show_empty',
					'options_preset',
					'last_column',
					'html_attrs',
					'min_strength',
					'meter_description',
				],
			},
		],
	},
};
