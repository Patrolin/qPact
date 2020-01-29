module.exports = {
	parser: 'sugarss',
	plugins: [
		require('postcss-advanced-variables'),
		require('postcss-nested'),
		//require('postcss-short'),
		require('cssnano')({
			preset: ['default', { autoprefixer: true, mergeRules: false }],
		}),
	],
};
