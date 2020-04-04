class Interface extends null {} // make the constructor commit seppuku
class Null extends Interface {
	static [Symbol.hasInstance](input) {
		return input === null;
	}
}
class Undefined extends Interface {
	static [Symbol.hasInstance](input) {
		return input === undefined;
	}
}
class Constructor extends Interface {
	static [Symbol.hasInstance](input) {
		return isInstance(input, Function) && 'prototype' in input;
	}
}
class Primitive extends Interface {
	static [Symbol.hasInstance](input) {
		return input !== Object(input);
	}
}
class NativeFunction extends Interface {
	static [Symbol.hasInstance](input) {
		return isInstance(input, Function) && /\[native code\]/.test('' + input);
	}
}
export var GeneratorFunction = type((function* () {})()),
	ArrayIterator = Object.getPrototypeOf([].keys()),
	SetIterator = Object.getPrototypeOf(new Set().keys()),
	MapIterator = Object.getPrototypeOf(new Map().keys());
export class Iterator extends Interface {
	static [Symbol.hasInstance](obj) {
		return obj && isInstance(obj.next, Function);
	}
}
define(Iterator, { __subclasses__: [GeneratorFunction] });
define(Iterator.prototype, {
	__subclasses__: [
		GeneratorFunction.prototype, // Generator
		ArrayIterator,
		SetIterator,
		MapIterator,
	],
});

export class Iterable extends Interface {
	static [Symbol.hasInstance](obj) {
		return obj && isInstance(obj[Symbol.iterator], Function);
	}
}
define(Iterable, { __subclasses__: [NodeList, Array, Set, Map, String, Iterator] });
define(Iterable.prototype, {
	__subclasses__: [
		Object.prototype,
		/*
		NodeList.prototype,
		Array.prototype,
		Set.prototype,
		Map.prototype,
		String.prototype,
		Iterator.prototype,*/
	],
});
export class AsyncIterable extends Interface {
	static [Symbol.hasInstance](obj) {
		return obj != null && isInstance(obj[Symbol.asyncIterator], Function);
	}
}
