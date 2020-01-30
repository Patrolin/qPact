module.exports = {
	parser: (process.argv[2] || '').endsWith('.sss') ? 'sugarss' : undefined,
	stringifier: process.argv[3],
	plugins: [
		// Props
		// order
		/*require('postcss-sorting')({
			order: [
				'custom-properties',
				'dollar-variables',
				'at-variables',
				{
					type: 'at-rule',
					hasBlock: false,
				},
				'declarations',
				'rules',
				{
					type: 'at-rule',
					hasBlock: true,
				},
			],
		}),*/
		// compute
		require('postcss-advanced-variables')({
			variables: {
				DEPTH: 20,
			},
		}),
		// rename
		require('postcss-alias'),
		require('postcss-axis'),
		require('postcss-short'),
		// unwrap
		require('postcss-nested-props'),
		require('postcss-nested'),

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
		require('postcss-vertical-rhythm'),
		require('postcss-math'),
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
