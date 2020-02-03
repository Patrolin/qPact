module.exports = {
	parser: (process.argv[2] || '').endsWith('.sss') ? 'sugarss' : undefined,
	stringifier: process.argv[3],
	plugins: [
		// Props
		// order
		require('postcss-sorting')(require('./config/postcss-sorting')),
		// compute
		require('postcss-alias-atrules')({
			rules: { foreach: 'each' },
		}),
		require('postcss-advanced-variables')({
			variables: { DEPTH: 20 },
		}),
		// rename
		require('postcss-axis'),
		require('postcss-short'),
		// unwrap
		require('postcss-nested-props'),
		require('postcss-nested'),
		require('postcss-sorting')(require('./config/postcss-sorting')),

		// Values
		// compute
		require('postcss-functions')({
			functions: {
				percentage(str) {
					let p = eval(`${str}*100`);
					return `${p}%`;
				},
			},
		}),
		require('postcss-math'),
		require('postcss-colorstring'),
		// compress
		require('cssnano')({
			preset: [
				'default',
				{
					autoprefixer: true,
					mergeRules: false,
				},
			],
		}),
	],
};
