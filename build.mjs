import fs from 'fs';
import uglify from 'uglify-es';

function dirs(path) {
	let result = [];
	for (let dirent of fs.readdirSync(path, { withFileTypes: true })) {
		if (dirent.isDirectory()) {
			let name = `${path}/${dirent.name}`;
			result.push(name);
			result = result.concat(...dirs(name));
		}
	}
	return result;
}
function files(path) {
	let result = [];
	let dirs = [path];
	let dir;
	while ((dir = dirs.shift())) {
		for (let dirent of fs.readdirSync(dir, { withFileTypes: true })) {
			let name = `${dir}/${dirent.name}`;
			if (dirent.isDirectory()) {
				dirs.push(name);
			} else {
				result.push(name);
			}
		}
	}
	return result;
}
function getFiles(path) {
	return files(path).map((p) =>
		fs.readFileSync(p, {
			encoding: 'UTF-8',
		})
	);
}
function rpartition(str, sep) {
	let i = str.lastIndexOf(sep);
	return i >= 0 ? [str.slice(0, i), str.slice(i + sep.length)] : [str, ''];
}
function matchAll(pattern, string) {
	let result = [];
	let match;
	while ((match = pattern.exec(string)) !== null) {
		result.push(match);
	}
	return result;
}

const TARGETS = {
	js(path, name, minified) {
		let files = `${name} = new function(){
			let module = this, global = window, UNDEFINED = undefined, NULL = null, TRUE = true;
			${getFiles(path)
				.join(';')
				.replace(/@import '(.+?)';/g, function(match, name) {
					return fs.readFileSync(name, 'utf-8');
				})}
			for(let key in module){
				key in global ? console.warn(\`${name}: \${key} is already defined\`) : global[key] = module[key];
			}
		}`; // if not isNative()
		const js = uglify.minify(files, {
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
			return `${line}:${col} ${message}\n\n${files}`;
		}
	},
	css(path, name, minified) {
		let files = getFiles(path)
			.join('')
			.replace(/\/\*(?:.|\s)*?\*\//g, '');
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
		if (minified) {
			css = Object.entries(css)
				.map(
					([selectors, properties]) =>
						`${selectors}{${properties.join(';')}}`
				)
				.join('');
		} else {
			css = Object.entries(css)
				.map(
					([selectors, properties]) =>
						`${selectors}{${properties
							.map((p) => `\n\t${p}`)
							.join(';')}\n}`
				)
				.join('\n');
		}
		return minified ? css.slice(0, css.length - 1) : css;
	},
};

let start = new Date();
for (let path of dirs('src')) {
	let [_, dir] = rpartition(path, '/');
	let [name, ext] = rpartition(dir, '.');
	if (ext) {
		fs.writeFileSync(`dist/${dir}`, TARGETS[ext](path, dir, false));
		let dst = `${name}.min.${ext}`;
		fs.writeFileSync(`dist/${dst}`, TARGETS[ext](path, dst, true));
	}
}
for (let path of files('dist')) {
	if (fs.statSync(path).atime < start) fs.unlinkSync(path);
}
