import uglify from 'uglify-es';
import fs from 'fs';

function dirs(path) {
	let result = [path];
	for (let dirent of fs.readdirSync(path, { withFileTypes: true }))
		if (dirent.isDirectory())
			result = result.concat(...dirs(`${path}/${dirent.name}`));
	return result;
}
function files(path) {
	let result = [];
	for (let dir of dirs(path))
		for (let dirent of fs.readdirSync(dir, { withFileTypes: true }))
			if (dirent.isFile()) result.push(`${dir}/${dirent.name}`);
	return result;
}
function textFile(path) {
	return fs.readFileSync(path, {
		encoding: 'UTF-8',
	});
}
function rpartition(string, sep) {
	let i = string.lastIndexOf(sep);
	return i >= 0
		? [string.slice(0, i), string.slice(i + sep.length)]
		: [string, ''];
}
function matchAll(string, pattern) {
	let result = [];
	let match;
	while ((match = pattern.exec(string)) !== null) result.push(match);
	return result;
}
function items(input) {
	let iterator = input[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(input));
		if (!assoc_mebbe) _items = _items.map((v, i) => [i, v]);
		return _items;
	} else {
		let _items = [];
		for (let k in input) _items.push([k, input[k]]);
		return _items;
	}
}

let TARGETS = {
	js(path, name, minified) {
		let concat = `${name} = new function(){
			'use strict';
			let module = this, global = window, UNDEFINED = undefined, NULL = null, TRUE = true;
			${files(path)
				.map(textFile)
				.join(';')
				.replace(/@import '(.+?)';/g, (match, name) => textFile(name))}
			for(let key in module){
				key in global ? module.isNative(global[key]) || console.warn(\`${name}: \${key} is already defined\`) : global[key] = module[key];
			}
		}`;
		let js = uglify.minify(concat, {
			keep_classnames: true,
			compress: {
				ecma: 6,
				passes: 5,
				sequences: false,
				unsafe: true,
				unsafe_comps: true,
				unsafe_math: true,
				unsafe_proto: true,
				unsafe_undefined: true,
				warnings: true,
				reduce_vars: false,
			},
			mangle: {
				eval: true,
			},
			output: {
				ecma: 6,
				quote_style: 3,
				width: 80,
				indent_level: 2,
				beautify: !minified,
				semicolons: !minified,
			},
		});
		if (!js.error) {
			return js.code
				.replace(/let .+?;/g, function(match) {
					return match.replace(/(.+? ?= ?)\1/g, '$1'); // uglify-es is complete and utter garbage
				})
				.trimRight();
		} else {
			let { message, line, col } = js.error;
			return `${line}:${col} ${message}\n\n${concat}`;
		}
	},
	css(path, name, minified) {
		let css = {};
		for (let [match, selectors, properties] of matchAll(
			files(path)
				.map(textFile)
				.join('')
				.replace(/\/\*(?:.|\s)*?\*\//g, ''),
			/([^{]*){([^}]*)}/g
		)) {
			selectors = selectors
				.split(',')
				.map((selector) => selector.trim().replace(/ +/g, ' '))
				.sort()
				.join(',');
			properties = matchAll(properties, /([^:]+):([^;]+);/g).map(
				([match, property, values]) => [
					property.trim(),
					values
						.trim()
						.replace(/ +/g, ' ')
						.replace(/, /g, ','),
				]
			);
			for (let [p, v] of properties) {
				css[selectors] = css[selectors] || {};
				if (css[selectors][p])
					console.warn(`${selectors} ${p} is already defined`);
				css[selectors][p] = v;
			}
		}
		let SPACE = minified ? '' : ' ';
		let TAB = minified ? '' : '\n\t';
		let NEW_LINE = minified ? '' : '\n';
		css = Object.entries(css)
			.map(
				([selectors, properties]) =>
					`${selectors}{${items(properties)
						.map(([p, v]) => `${TAB}${p}:${SPACE}${v}`)
						.join(';')}${NEW_LINE}}`
			)
			.join(NEW_LINE);
		return minified ? css.slice(0, css.length - 1) : css;
	},
};

let start = new Date();
for (let path of dirs('src')) {
	let [_, dir] = rpartition(path, '/');
	let [name, ext] = rpartition(dir, '.');
	if (ext) {
		fs.writeFileSync(`dist/${dir}`, TARGETS[ext](path, name, false));
		let dst = `${name}.min.${ext}`;
		fs.writeFileSync(`dist/${dst}`, TARGETS[ext](path, name, true));
	}
}

for (let path of files('dist')) {
	if (fs.statSync(path).mtime < start) {
		fs.unlinkSync(path);
	}
}
