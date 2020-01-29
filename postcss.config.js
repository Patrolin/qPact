module.exports = {
	parser: 'sugarss',
	plugins: [
		require('postcss-advanced-variables'),
		require('postcss-short'),
		require('postcss-math'),
		require('cssnano')({
			preset: ['default', { autoprefixer: true, mergeRules: false }],
		}),
		require('postcss-nested'),
	],
};
