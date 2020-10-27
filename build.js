import uglify from 'uglify-es';
import fs from 'fs';
//var uglify = require('uglify-es');
//var postcss = require('postcss')(require('./postcss.config').plugins);
//var sugarss = require('sugarss');
//var fs = require('fs');

function dirs(path) {
	let result = [path];
	for (let dirent of fs.readdirSync(path, { withFileTypes: true }))
		if (dirent.isDirectory()) result = result.concat(...dirs(`${path}/${dirent.name}`));
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
function partition(string, sep) {
	let i = string.indexOf(sep);
	return i >= 0 ? [string.slice(0, i), string.slice(i + sep.length)] : [string, ''];
}
function rpartition(string, sep) {
	let i = string.lastIndexOf(sep);
	return i >= 0 ? [string.slice(0, i), string.slice(i + sep.length)] : [string, ''];
}
function matchAll(string, pattern) {
	let result = [];
	let match;
	while ((match = pattern.exec(string)) !== null) result.push(match);
	return result;
}
function sorted(arr, key) {
	return key
		? arr
				.map(x => [x, key(x)])
				.sort((x, y) => x[1] > y[1] || -(x[1] < y[1]))
				.map(x => x[0])
		: arr.sort();
}

let TARGETS = {
	async js(path, filename) {
		var exports = [];
		var concat = sorted(files(path), x => x.toLowerCase(x))
			.map(textFile)
			.join(';\n')
			// @todo: uglify for consistency
			.replace(/@import '(.+?)';/g, (match, name) => textFile(name))
			.replace(/^export (?:var|const) ([^;]+)/gm, (match, stuff) => {
				function single(i) {
					var [a, b] = partition(i, ': ');
					if (b) a = b;
					if (a[0] === '{') a = a.slice(1);
					if (a.slice(-1) === '}') a = a.slice(0, -1);
					a = a.trim();
					if (a) exports.push(a);
				}
				for (var x of stuff.split(',\n\t')) {
					x = partition(x, ' =')[0];
					if (x[0] === '{' && x.slice(-1) === '}') {
						for (var y of x.split(',')) single(y);
					} else single(x);
				}
				return `var ${stuff}`;
			})
			.replace(/^export (\S+) ([^(; ]+)/gm, (match, keyword, name) => {
				exports.push(name);
				return `${keyword} ${name}`;
			});
		exports = exports.length
			? `
			for(var [k, v] of Object.entries({${exports.join(',')}})) {
				Object.defineProperty(v, 'name', {value: k});
				//if (isInstance(v, Function)) define(v, {name: k});
				if (!window.hasOwnProperty(k)) window[k] = v;
			}`
			: '';
		var module = `
		${filename} = new function(){
			${concat};
			${exports};
		};`;
		var js = uglify.minify(module, {
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
				keep_fnames: true,
			},
			output: {
				ecma: 6,
				quote_style: 3,
				width: 80,
				indent_level: 1,
				beautify: false,
				semicolons: false,
			},
		});
		if (!js.error) {
			return js.code
				.replace(/([a-zA-Z$_]+? ?= ?)\1/g, function (match) {
					console.log(
						'\x1b[1m\x1b[36m',
						path,
						'\x1b[1m\x1b[31m',
						JSON.stringify(match).replace(/"/g, "'")
					);
					return '$1';
				}) // uglify-es is retarded
				.replace(/^ +/gm, function (match) {
					return '\t'.repeat(match.length);
				})
				.trimRight();
		} else {
			let { message, line, col } = js.error;
			return `${line}:${col} ${message}\n\n${module}`;
		}
	},
	async css(path, name) {
		let concat = files(path).map(textFile).join('');
		return concat;
		let processed = (
			await postcss
				.process(concat, {
					parser: sugarss.parse,
					from: undefined,
				})
				.catch(e => {
					console.log(
						'\x1b[1m\x1b[36m',
						path,
						'\x1b[1m\x1b[31m',
						`${e.reason} at ${e.line}:${e.column}`
					);
					fs.writeFileSync(`dist/${name}.sss`, concat);
					return ''; // this value is ignored, except when it is == undefined...
				})
		).css;
		return processed;
	},
};

async function main() {
	let START = new Date();
	for (let path of dirs('src')) {
		let [_, dir] = rpartition(path, '/');
		let [name, ext] = rpartition(dir, '.');
		if (ext) {
			fs.writeFileSync(`dist/${dir}`, await TARGETS[ext](path, name));
		}
	}
	fs.writeFileSync('docs/qPact.js', fs.readFileSync('dist/qPact.js'));

	for (let path of files('dist')) {
		if (fs.statSync(path).mtime < START - 100)
			// file times are fucking weird
			fs.unlinkSync(path);
	}
}
main();
