module.exports = {
	parser: (process.argv[2] || '').endsWith('.sss') ? 'sugarss' : undefined,
	stringifier: process.argv[3],
	plugins: [
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

		// transform
		require('postcss-advanced-variables'),
		require('postcss-nested'),
		require('postcss-math'),

		// expand
		require('postcss-short'),

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
