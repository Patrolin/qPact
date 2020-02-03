var uglify = require('uglify-es');
var cp = require('child_process');
var postcss = require('postcss')(require('./postcss.config').plugins);
var sugarss = require('sugarss');
var fs = require('fs');

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
	async js(path, name) {
		let concat = `let ${name} = new function(){
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
				indent_level: 1,
				beautify: false,
				semicolons: false,
			},
		});
		if (!js.error) {
			return js.code
				.replace(/([a-zA-Z$_]+? ?= ?)\1/g, function(match) {
					console.log(
						'\x1b[1m\x1b[36m',
						path,
						'\x1b[1m\x1b[31m',
						JSON.stringify(match).replace(/"/g, "'")
					);
					return '$1';
				}) // uglify-es is retarded
				.replace(/^ +/gm, function(match) {
					return '\t'.repeat(match.length);
				})
				.trimRight();
		} else {
			let { message, line, col } = js.error;
			return `${line}:${col} ${message}\n\n${concat}`;
		}
	},
	async css(path, name) {
		let concat = files(path)
			.map(textFile)
			.join('\n');
		let processed = (
			await postcss
				.process(concat, {
					parser: sugarss.parse,
					from: undefined,
				})
				.catch((e) => {
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
