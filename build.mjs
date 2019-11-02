import walk from 'walk';
import fs from 'fs';
import uglify from 'uglify-es';

function rpartition(str, sep) {
	const i = str.lastIndexOf(sep);
	return i >= 0 ? [str.slice(0, i), str[i], str.slice(i + 1)] : ['', '', str];
}
function matchAll(pattern, string) {
	const matches = [];
	let match;
	while ((match = pattern.exec(string)) !== null) {
		matches.push(match);
	}
	return matches;
}
function getFiles(path) {
	const files = [];
	walk.walkSync(path, {
		listeners: {
			file: function(root, state, next) {
				files.push(
					fs.readFileSync(`${root}\\${state.name}`, {
						encoding: 'UTF-8',
					})
				);
				next();
			},
		},
	});
	return files;
}

const TARGETS = {
	js(path, name, minified) {
		const files = `this['${name}']=new function(){${getFiles(path)
			.join(';')
			.replace(/import .+? from .+?;/g, '')
			.replace(
				/export default (.+?) ([\w$]+)/g,
				"$2 = (typeof $2 !== 'undefined') ? $2 : this.$2 = $1 $2"
			)
			.replace(/export (.+?) ([\w$]+)/g, 'this.$2 = $1 $2')}}`;
		const js = uglify.minify(files, {
			compress: {
				ecma: 6,
				passes: 5,
				sequences: false,
				unsafe: true,
				unsafe_comps: true,
				unsafe_math: true,
				unsafe_proto: true,
				warnings: true,
			},
			output: {
				ecma: 6,
				quote_style: 3,
				width: 80,
				indent_level: 4,
				beautify: !minified,
				semicolons: !minified,
			},
		});
		return !js.error
			? js.code.trimRight()
			: `${js.error}\n\n---------------------\n\n${files}`;
	},
	css(path, name, minified) {
		let files = getFiles(path)
			.join('')
			.replace(/\/\*(?:.|\s)*?\*\//g, '');
		if (!minified) {
			return files;
		}
		let css = {};
		for (let [match, selectors, properties] of matchAll(
			/([^{]*){([^}]*)}/g,
			files
		)) {
			selectors = selectors
				.split(',')
				.map((selector) => selector.trim().replace(/ +/g, ' '))
				.sort()
				.join(',');
			properties = matchAll(/([^:]+):([^;]+);/g, properties).map(
				([match, property, values]) =>
					`${property.trim()}:${values
						.trim()
						.replace(/ +/g, ' ')
						.replace(/, /g, ',')}`
			);
			css[selectors] = [...(css[selectors] || []), ...properties];
		}
		css = Object.entries(css)
			.map(
				([selectors, properties]) =>
					`${selectors}{${properties.join(';')}}`
			)
			.join('');
		return css.slice(0, css.length - 1);
	},
};

walk.walkSync('src', {
	listeners: {
		directory: function(root, state, next) {
			const dir = state.name;
			const [name, _, ext] = rpartition(dir, '.');
			if (name) {
				const src = `${root}\\${dir}`;
				fs.writeFileSync(
					`dist\\${name}.${ext}`,
					TARGETS[ext](src, name, false)
				);
				fs.writeFileSync(
					`dist\\${name}.min.${ext}`,
					TARGETS[ext](src, name, true)
				);
			}
			next();
		},
	},
});
