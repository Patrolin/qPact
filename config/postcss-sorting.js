module.exports = {
	'order': [
		{
			type: 'at-rule',
			name: 'extend',
		},
		'custom-properties',
		'dollar-variables',
		'at-variables',
		'declarations',
		{
			type: 'rule',
			selector: /&/,
		},
		'rules',
		{
			type: 'at-rule',
			hasBlock: false,
		},
		'at-rules',
		{
			type: 'at-rule',
			name: 'for',
		},
		{
			type: 'at-rule',
			name: 'foreach',
		},
		{
			type: 'at-rule',
			name: 'media',
		},
	],
	'properties-order': 'alphabetical',
};
