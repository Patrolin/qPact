export var i = (i, len) => (i < 0 ? len - i : i);
export function define(obj, properties, complex) {
	if (!complex) properties = Object.getOwnPropertyDescriptors(properties);
	properties = Reflect.ownKeys(properties).map(k => [k, properties[k]]);
	for (var seen = new Set(), stack = [obj]; stack.length; seen.add(next)) {
		var next = stack.shift();
		if (seen.has(next)) throw Error(`Cyclic subclass in ${type(obj)}`);
		for (var n of next.__subclasses__ || []) stack.push(n);
		for (var [key, value] of properties)
			if (!Object.prototype.hasOwnProperty.call(next, key))
				Object.defineProperty(next, key, {
					...value,
					...(complex ? {} : { enumerable: 0 }),
				});
	}
	return obj;
}
export var createType = (constructor, isType) =>
	define(constructor, {
		[Symbol.hasInstance]: isType || (x => x instanceof constructor().constructor),
	});
export function describe(input) {
	return `${type(input).name}<${input instanceof Constructor ? input.name : input}>`;
}
export function type(input) {
	return input === null ? Null : input === undefined ? Undefined : input.constructor;
}
export function isInstance(input, whitelist = [], blacklist = []) {
	function test(Type) {
		return input && Type && (input instanceof Type || input.constructor === Type);
	}
	function testMany(list) {
		return list instanceof Array ? list.some(Type => test(Type)) : test(list);
	}
	return testMany(whitelist) && !testMany(blacklist);
}
export function assertInstance(input, whitelist = [], blacklist = []) {
	function format(list) {
		return list instanceof Array
			? list.length
				? list.list(x => x.name).join('|')
				: ''
			: '' + list.name;
	}
	if (!isInstance(input, whitelist, blacklist)) {
		var wl = format(whitelist),
			bl = format(blacklist);
		throw TypeError(`${describe(input)} is not of type ${wl}${bl && ' - ' + bl}`);
	}
}
export function parseIndentation(str) {
	var stack = [[]];
	var p = 0,
		n;
	for (var line of str.split('\n')) {
		var n = 0;
		for (var i = 0; line[i] === '\t'; ++i) n += 1;
		if (n > p) {
			var last = stack[stack.length - 1];
			stack.push(last[last.length - 1].children);
			p = n;
		} else
			while (n < p) {
				stack.pop();
				p -= 1;
			}
		stack[stack.length - 1].push({ value: line.slice(i), children: [] });
	}
	return stack[0];
}
