1111:429 Unexpected token punc «}», expected punc «)»


		qPact = new function(){
			var G = globalThis,
	N = null,
	U = undefined,
	MIN_INT32 = -Math.pow(2, 31),
	MAX_INT32 = -MIN_INT32 - 1,
	MAX_UINT32 = Math.pow(2, 32) - 1,
	MIN_INT64 = -Math.pow(2, 63),
	MAX_INT64 = -MIN_INT64 - 1,
	MAX_UINT64 = Math.pow(2, 64) - 1,
	MIN_INT = Number.MIN_SAFE_INTEGER - 1,
	MAX_INT = -MIN_INT,
	SECOND = 1000,
	MINUTE = 60 * SECOND,
	HOUR = 60 * MINUTE,
	DAY = 24 * HOUR,
	WEEK = 7 * DAY,
	YEAR = 365.2425 * DAY,
	MONTH = YEAR / 12;
;
G.LOCALE =
	navigator.userLanguage ||
	navigator.language ||
	navigator.browserLanguage ||
	navigator.systemLanguage ||
	'en-US';
G.UI_LOCALE = new Intl.NumberFormat().resolvedOptions().locale; // chromium is stupid
;
var i = (i, len) => (i < 0 ? len - i : i);
function define(obj, properties, complex) {
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
var createType = (constructor, isType) =>
	define(constructor, {
		[Symbol.hasInstance]: isType || (x => x instanceof constructor().constructor),
	});
function describe(input) {
	return `${type(input).name}<${input instanceof Constructor ? input.name : input}>`;
}
function type(input) {
	return input === null ? Null : input === undefined ? Undefined : input.constructor;
}
function isInstance(input, whitelist = [], blacklist = []) {
	function test(Type) {
		return Type && input instanceof Type;
	}
	function testMany(list) {
		return list instanceof Array ? list.some(Type => test(Type)) : test(list);
	}
	return testMany(whitelist) && !testMany(blacklist);
}
function assertInstance(input, whitelist = [], blacklist = []) {
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
function parseIndentation(str) {
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
;
// @todo: datetime
class Datetime extends Date {
	get y() {
		return this.getFullYear();
	}
	set y(n) {
		this.setFullYear(n);
	}
	get o() {
		return this.getMonth();
	}
	set o(n) {
		this.setMonth(n);
	}
	get d() {
		return this.getDate();
	}
	set d(n) {
		this.setDate(n);
	}
	get h() {
		return this.getHours();
	}
	set h(n) {
		this.setHours(n);
	}
	get m() {
		return this.getMinutes();
	}
	set m(n) {
		this.setMinutes(n);
	}
	get s() {
		return this.getSeconds();
	}
	set s(n) {
		this.setSeconds(n);
	}
	get ms() {
		return this.getMilliseconds();
	}
	set ms(n) {
		this.setMilliseconds(n);
	}

	constructor(input) {
		if (isInstance(input, Number)) super(input);
		else {
			super();
			this.modify(input);
		}
	}
	[Symbol.toPrimitive](hint) {
		if (hint === 'string') return this.toString();
		else return this.valueOf();
	}
	valueOf() {
		return this.getTime();
	}
	toString() {
		// @todo: format Datetime
		return new Intl.DateTimeFormat(LOCALE, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'long',
			...obj,
		}).format(this);
	}

	modify(input) {
		if (isInstance(input, Number)) input = `${input}ms`;
		if (!input) return;
		datetime_modify(this, input);
		return this;
	}
}
var stuffs = [1, 'ms', SECOND, 's', MINUTE, 'm', HOUR, 'h', DAY, 'd', MONTH, 'o', YEAR];
class TimeInterval {
	constructor(a) {
		var self = this;
		self.sign = 1;
		self.ms = self.s = self.m = self.h = self.d = self.o = self.y = 0;
		self.modify(a);
	}
	valueOf() {
		var { y, o, d, h, m, s, ms, sign } = this;
		return sign * (y * YEAR + o * MONTH + d * DAY + h * HOUR + m * MINUTE + s * SECOND + ms);
	}
	toString() {
		// format TimeInterval
		return 'string!';
	}

	modify(input) {
		if (isInstance(input, Number)) input = `${input}ms`;
		if (!input) return;
		var self = this;
		datetime_modify(self, input);
		var time = +self;
		time *= self.sign = Math.sign(time);
		for (var i = 0; i < 11; i += 2) {
			var t = time % stuffs[i + 2];
			time -= t;
			self[stuffs[i + 1]] = t / stuffs[i];
		}
		self.y = time;
		return self;
	}
}
var WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
function datetime_modify(self, string) {
	var sign = 1;
	for (var [match, r, runit, aunit, a, s] of string.matchAll(
		/([\d.]+)([a-z]+)|([a-z]+)([\d.]+)|([+-])/g
	)) {
		if (r) {
			var i = WEEKDAYS.indexOf(runit);
			if (i < 0 && runit in self) {
				self[runit] += sign * r;
			} else {
				var date = self.getDate();
				var day = self.getDay();
				if (i != day) {
					date += sign > 0 ? i - day + 7 : i + day - 8;
					r--;
				}
				self.setDate(date + sign * 7 * r);
			}
		} else if (a && aunit in self) {
			self[aunit] = +a;
		} else if (s) {
			sign = s == '+' ? 1 : -1;
		}
	}
}
;
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
var GeneratorFunction = type((function* () {})()),
	ArrayIterator = Object.getPrototypeOf([].keys()),
	SetIterator = Object.getPrototypeOf(new Set().keys()),
	MapIterator = Object.getPrototypeOf(new Map().keys());
class Iterator extends Interface {
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

class Iterable extends Interface {
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
class AsyncIterable extends Interface {
	static [Symbol.hasInstance](obj) {
		return obj != null && isInstance(obj[Symbol.asyncIterator], Function);
	}
}
;
var Null = type(
	x => N,
	x => x === N
);
var Undefined = type(
	x => U,
	x => x === U
);
var str = type((x = '') => x + '');
var float = type((x = 0) => Number(x)); // BigInts don't like +x
var int = type((x = 0) => BigInt(x instanceof str ? x : parseInt(x)));
var list = type((x, ...args) => (args.length ? Array(x, ...args) : Array(float(x))));
;
function* computeKeys(input) {
	assertInstance(input, Iterable);
	var _values = input.values();
	var { done, value } = _values.next();
	for (var key of Reflect.ownKeys(input)) {
		if (done) break;
		if (input[key] === value) {
			yield key;
			({ done, value } = _values.next());
		}
	}
}
function* zip(iterators, filler) {
	iterators = iterators.map((x) => {
		assertInstance(x, Iterable);
		x.values();
	});
	var res = Array(iterators.length);
	if (filler === undefined)
		while (true) {
			for (var i = 0; i < iterators.length; ++i) {
				var { done, value } = iterators[i].next();
				if (done) return;
				res[i] = value || fillvalue;
			}
			yield [...res];
		}
	else
		while (true) {
			var all_done = true;
			for (var i = 0; i < iterators.length; ++i) {
				var { done, value } = iterators[i].next();
				all_done &= done;
				res[i] = value || filler;
			}
			if (all_done) return;
			yield [...res];
		}
}
define(Array.prototype, {
	get len() {
		return this.length;
	},
	Array(callback) {
		return callback ? arrayMap.call(this, callback) : [...this];
	},
});
define(Set.prototype, {
	get len() {
		return this.size;
	},
	i(index) {
		return this.keys();
	},
	push(input) {
		return this.add(input);
	},
});
define(String.prototype, {
	keys: Array.prototype.keys,
});
define(Iterator.prototype, {
	*keys() {
		var i = 0;
		for (var v of this) yield i++;
	},
	values() {
		return this;
	},
	*entries() {
		var i = 0;
		for (var v of this) yield [i++, v];
	},
	get len() {
		return 1 / 0;
	},
	slice(start, stop, step) {
		if (step < 1) {
			start -= stop;
			stop += start;
			start = stop - start;
			step = -step;
		}
		// ...
	},
	i(index) {
		var v;
		if (index < 0) {
			var queue = [];
			for (; index++; ) {
				v = this.next();
				if (v.done) break;
				queue.push(v);
			}
			for (var v = this.next(); !v.done; v = this.next()) {
				queue.shift();
				queue.push(v);
			}
			v = queue[0];
		} else {
			for (var v = this.next(); !v.done && index--; ) {
				v = this.next();
			}
		}
		if (v.done) throw new RangeError(`Index ${index} out of range`);
		return v.value;
	},
});
define(Iterable.prototype, {
	keys() {
		return keys(this);
	},
	values() {
		return values(this);
	},
	entries() {
		return entries(this);
	},
	get len() {
		var i = 0;
		for (var k of this.keys()) i += 1;
		return i;
	},
	i(index) {
		return this[i(index, this.len)];
	},
	*map(callback) {
		assertInstance(callback, Function);
		for (var [k, v] of this.entries()) yield callback(v, k, this);
	},
	Array(callback) {
		return [...(callback ? this.map(callback) : this)];
	},
	Set(callback) {
		return new Set(callback ? this.map(callback) : this);
	},
	Map(callback) {
		return new Map(callback ? this.map(callback) : this);
	},
	Object(callback) {
		var obj = {};
		for (var [k, v] of callback ? this.map(callback) : this) {
			obj[k] = v;
		}
		return obj;
	},
});
delete Array.prototype.map;
;
function floordiv(x, y) {
	var div = x / y;
	return div < 0 ? Math.ceil(div) : Math.floor(div);
}
function divmod(x, y) {
	return [math.floordiv(x, y), x % y];
}
;
function q(input, n = undefined) {
	if (input instanceof RegExp) return document.q(input, n);
	if (input instanceof Node) return q_multiply(input, n);
	if (input instanceof Array)
		return q_multiply(
			input.map((x) => q(x)),
			n
		);
	let template = document.createElement('template');
	template.innerHTML = input;
	let children = template.content.childNodes;
	return q_multiply(children.length === 1 ? children[0] : [...children], n);
}
function q_multiply(input, n) {
	function q_clone(input) {
		return input instanceof Node ? input.cloneNode(TRUE) : input.map(q_clone);
	}
	return n === undefined ? input : new Array(n).fill().map(() => q_clone(input));
}

define(Node.prototype, {
	Q: function Q_Node(input, n) {
		// @TODO: fix moving elements
		let self = this;
		let descendants = {};
		let e;
		while ((e = self.firstChild) !== null) {
			self.removeChild(e);
			if (e.id) descendants[e.id] = e;
		}
		if (input === null) return [];
		let result = self.q(input, n);
		for (let e of self.querySelectorAll('[id]'))
			if (e.id in descendants && !e.childNodes.length)
				e.parentNode.replaceChild(descendants[e.id], e);
		return result instanceof Node ? result : result.map((e) => (e.id ? descendants[e.id] : e));
	},
	q: function q_Node(input, n) {
		if (input instanceof RegExp) {
			if (input.global) return q_multiply([...this.querySelectorAll(input.source)], n);
			let search = this.querySelector(input.source);
			return search ? q_multiply(search, n) : null;
		}
		return q_Node_append(this, q(input, n));
	},
});
function q_Node_append(self, input) {
	return input instanceof Node
		? self.appendChild(input)
		: input.map((x) => q_Node_append(self, x));
}

define(Array.prototype, {
	Q: function Q_Array(input, n) {
		return this.map((e) => e.Q(input, n));
	},
	q: function q_Array(input, n) {
		return input instanceof RegExp
			? q_multiply(
					input.global
						? q_Array_filter(this, input.source)
						: q_Array_find(this, input.source),
					n
			  )
			: this.map((e) => e.q(input, n));
	},
});
function q_Array_filter(self, query) {
	return self
		.map((x) => {
			return x instanceof Node ? (x.matches(query) ? x : null) : q_Array_filter(x, query);
		})
		.filter((x) => x !== null);
}

function q_Array_find(self, query) {
	return self.flat(Infinity).find((e) => e.matches(query));
}
;
var Pact = this;
var gStyles = (q(/#qPact/) || q(/head/).q('<div id="qPact">')).q(
	`<style>html,
body
	width: 100%
	height: 100%
*
	box-sizing: border-box
	display: inline-block
	position: relative
	padding: 0
	margin: 0
	/* TODO: padding
	*/
	pointer-events: auto
	text-combine-upright: digits 3
body
	display: block
	margin: 0
/* @todo: buttons
*/
@mixin flex
	display: inline-flex
	flex-wrap: wrap
	&[items-stretch]
		align-content: stretch
	& > [self-stretch]
		align-self: stretch


@mixin flex-vertical
	&[middle]
		justify-content: center
	&[center]
		align-content: center
	& > [self-center]
		align-self: center

@mixin flex-horizontal
	&[middle]
		align-content: center
	&[center]
		justify-content: center
	& > [self-middle]
		align-self: center


@mixin flex-upwards
	@include flex-vertical
	flex-direction: column-reverse
	&[up]
		justify-content: flex-end
	&[down]
		justify-content: flex-start
	&[left]
		align-content: flex-end
	&[right]
		align-content: flex-start
	& > [self-left]
		align-self: flex-end
	& > [self-right]
		align-self: flex-start

@mixin flex-downwards
	@include flex-vertical
	flex-direction: column
	&[up]
		justify-content: flex-start
	&[down]
		justify-content: flex-end
	&[left]
		align-content: flex-start
	&[right]
		align-content: flex-end
	& > [self-left]
		align-self: flex-start
	& > [self-right]
		align-self: flex-end

@mixin flex-leftwards
	@include flex-horizontal
	flex-direction: row-reverse
	&[up]
		align-content: flex-start
	&[down]
		align-content: flex-end
	&[left]
		justify-content: flex-end
	&[right]
		justify-content: flex-start
	& > [self-up]
		align-self: flex-end
	& > [self-down]
		align-self: flex-start

@mixin flex-rightwards
	@include flex-horizontal
	flex-direction: row
	&[up]
		align-content: flex-start
	&[down]
		align-content: flex-end
	&[left]
		justify-content: flex-start
	&[right]
		justify-content: flex-end
	& > [self-up]
		align-self: flex-start
	& > [self-down]
		align-self: flex-end
/* @todo: headers
*/
@mixin list
	list-style-position: outside
	counter-reset: list
	& > *
		display: list-item
		counter-increment: list
@mixin stack
	position: relative
	& > *
		position: absolute
		left: 0
		top: 0

/* TODO: better absolute positioning */
@mixin table
	display: inline-table
	border-collapse: collapse
	border-spacing: 0
	& > *
		display: table-row
		& > *
			display: table-cell
@mixin tooltip
	display: none
	:hover > &
		display: inline-block
	position: absolute
	left: 50%
	top: 50%
	transform: translate(-50%, -50%)
	&[right]
		left: 100%
	&[up]
		top: 0
	&[left]
		left: 0
	&[down]
		top: 100%
/* @TODO: add triangles
*/
align
	@include flex
	justify-content: center
	align-content: center
	align-items: center
	text-align: center
	& > *
		flex: 0 1 auto
	&:not([upwards]):not([leftwards]):not([rightwards])
		@include flex-downwards

/* TODO: add align spacing
*/
flex
	@include flex
	align-items: stretch
	& > *
		flex: 1 1 0
	&:not([upwards]):not([downwards]):not([leftwards])
		@include flex-rightwards
list
	@include list
stack
	@include stack
	& > *
		pointer-events: none
table, tbody
	@include table
	border-collapse: collapse
	border-spacing: 0
tbody
	display: table-row-group

caption,
[caption]
	display: table-caption
col
	display: table-column
colgroup
	display: table-column-group
tfoot
	display: table-footer-group
thead
	display: table-header-group
tooltip
	@include tooltip
	font-weight: bold
	font-size: 0.35em
	padding: 0.2em 0.3em
	border-radius: 0.5em
[text-left]
	text-align: left
[text-center]
	text-align: center
[text-right]
	text-align: right
[text-justify]
	text-align: justify
[upwards]
	@include flex-upwards
[downwards]
	@include flex-downwards
[leftwards]
	@include flex-leftwards
[rightwards]
	@include flex-rightwards

[no-grow]
	flex-grow: 0
[no-shrink]
	flex-shrink: 0
[no-flex]
	flex-grow: 0
	flex-shrink: 0

@for $b from 1 to $DEPTH
	[flex="$b"]
		flex: $b
	@for $a from 1 to $b
		[flex="$a/$b"]
			flex: resolve($a/$b)
[position="inside"]
	list-style-position: inside
[position="outside"]
	list-style-position: outside
[type="disc"]
	list-style-type: disc
[type="circle"]
	list-style-type: circle
[type="square"]
	list-style-type: square
[type="decimal"]
	list-style-type: decimal
[type="cjk-decimal"]
	list-style-type: cjk-decimal
[type="decimal-leading-zero"]
	list-style-type: decimal-leading-zero
[type="lower-roman"]
	list-style-type: lower-roman
[type="upper-roman"]
	list-style-type: upper-roman
[type="lower-greek"]
	list-style-type: lower-greek
[type="lower-alpha"]
	list-style-type: lower-alpha
[type="lower-latin"]
	list-style-type: lower-latin
[type="upper-alpha"]
	list-style-type: upper-alpha
[type="upper-latin"]
	list-style-type: upper-latin
[type="arabic-indic"]
	list-style-type: arabic-indic
[type="armenian"]
	list-style-type: armenian
[type="bengali"]
	list-style-type: bengali
[type="cambodian"]
	list-style-type: cambodian
[type="cjk-earthly-branch"]
	list-style-type: cjk-earthly-branch
[type="cjk-heavenly-stem"]
	list-style-type: cjk-heavenly-stem
[type="cjk-ideographic"]
	list-style-type: cjk-ideographic
[type="devanagari"]
	list-style-type: devanagari
[type="ethiopic-numeric"]
	list-style-type: ethiopic-numeric
[type="georgian"]
	list-style-type: georgian
[type="gujarati"]
	list-style-type: gujarati
[type="gurmukhi"]
	list-style-type: gurmukhi
[type="hebrew"]
	list-style-type: hebrew
[type="hiragana"]
	list-style-type: hiragana
[type="hiragana-iroha"]
	list-style-type: hiragana-iroha
[type="japanese-formal"]
	list-style-type: japanese-formal
[type="japanese-informal"]
	list-style-type: japanese-informal
[type="kannada"]
	list-style-type: kannada
[type="katakana"]
	list-style-type: katakana
[type="katakana-iroha"]
	list-style-type: katakana-iroha
[type="khmer"]
	list-style-type: khmer
[type="korean-hangul-formal"]
	list-style-type: korean-hangul-formal
[type="korean-hanja-formal"]
	list-style-type: korean-hanja-formal
[type="korean-hanja-informal"]
	list-style-type: korean-hanja-informal
[type="lao"]
	list-style-type: lao
[type="lower-armenian"]
	list-style-type: lower-armenian
[type="malayalam"]
	list-style-type: malayalam
[type="mongolian"]
	list-style-type: mongolian
[type="myanmar"]
	list-style-type: myanmar
[type="oriya"]
	list-style-type: oriya
[type="persian"]
	list-style-type: persian
[type="simp-chinese-formal"]
	list-style-type: simp-chinese-formal
[type="simp-chinese-informal"]
	list-style-type: simp-chinese-informal
[type="tamil"]
	list-style-type: tamil
[type="telugu"]
	list-style-type: telugu
[type="thai"]
	list-style-type: thai
[type="tibetan"]
	list-style-type: tibetan
[type="trad-chinese-formal"]
	list-style-type: trad-chinese-formal
[type="trad-chinese-informal"]
	list-style-type: trad-chinese-informal
[type="upper-armenian"]
	list-style-type: upper-armenian
[type="disclosure-open"]
	list-style-type: disclosure-open
[type="disclosure-closed"]
	list-style-type: disclosure-closed
fixed,
[fixed]
	position: fixed

sticky,
[sticky]
	position: sticky
wide,
[wide]
	width: 100%

tall,
[tall]
	height: 100%

full,
[full]
	size: 100%


@for $b from 1 to $DEPTH
	@for $a from 1 to $b
		[width="$a/$b"]
			width: percentage($a/$b)
		[height="$a/$b"]
			height: percentage($a/$b)
		[size="$a/$b"]
			size: percentage($a/$b)
/* TODO: add writing-mode modifiers
*/
blank,
[blank]
	visibility: hidden

area,
head,
script,
style,
datalist,
link,
param,
title
hidden,
[hidden]
	display: none
`
);
class Component extends HTMLElement {
	// get style
	static set style(styles) {
		let elementName = this.elementName;
		(
			gStyles.q(new RegExp(`#${elementName}`)) || gStyles.q(`<style id="${elementName}">`)
		).innerHTML = `${elementName}{${styles
			.entries()
			.map(([k, v]) => `${k}:${v}`)
			.Array()
			.join(';')}`;
	}
	constructor() {
		super();
		let self = this;
		let Class = self.constructor;
		self.state = { ...Class.state };
		// @todo: use html observer
		for (let k of Class.events) {
			self.addEventListener(k.slice(2), (e) => self[k].call(self, e));
		}
	}
	async connectedCallback() {
		let self = this;
		try {
			let Class = self.constructor;
			console.log(describe(Class.state.entries().Array()));
			for (let [k, v] of Class.state.entries()) {
				if (self.hasAttribute(k)) {
					try {
						self[k] = self.getAttribute(k) || v;
					} finally {
					}
				}
			}
			await self.load();
		} catch (e) {
			console.error(self, e);
		}
	}
	async disconnectedCallback() {
		let self = this;
		try {
			await self.unload();
		} catch (e) {
			console.error(self, e);
		}
	}
	load() {}
	unload() {}
	alter() {
		this.dispatchEvent(
			new CustomEvent('alter', {
				bubbles: TRUE,
				cancelable: TRUE,
			})
		);
	}
}
function defineElement(name, Class) {
	try {
		document.createElement(name);
	} catch (e) {
		throw SyntaxError(`${name} is not a valid html element name`);
	}
	if (!/-/.test(name)) throw SyntaxError("Custom element name must contain '-'");

	let ClassState = { ...Class.state };
	let ClassEvents = new Set();
	let Prototype = Class.prototype;
	for (let key of Reflect.ownKeys(Prototype)) {
		let descriptor = Object.getOwnPropertyDescriptor(Prototype, key);
		if (descriptor.set) {
			if (!descriptor.get)
				Object.defineProperty(Prototype, key, {
					...descriptor,
					get: function () {
						return this.state[key];
					},
				});
			if (ClassState[key] === undefined) ClassState[key] = undefined;
		} else if (isInstance(key, String) && key.startsWith('on')) {
			ClassEvents.add(key);
		}
	}
	Class.state = ClassState;
	Class.events = ClassEvents;
	Class.elementName = name;
	customElements.define(name, Class);
	return Class;
}
class Clock extends Component {
	load() {
		let self = this;
		self.interval = setInterval(() => {
			self.render();
		}, 1000);
		self.render();
	}
	unload() {
		clearInterval(this.interval);
	}
	render() {
		this.Q(new Date());
	}
}
defineElement('q-clock', Clock);
class Copy extends Component {
	onclick() {
		let self = this;
		self.focus();
		let prev = self.contentEditable;
		self.contentEditable = TRUE;
		document.execCommand('selectAll');
		self.contentEditable = prev;
		try {
			document.execCommand('copy');
		} catch (e) {
			navigator.clipboard.writeText(self.innerText);
		}
	}
}
defineElement('q-copy', Copy);
class Katex extends Component {
	// @todo: no race conditions
	init() {
		if (global.katex === undefined) {
			return new Promise(function (resolve, reject) {
				let head = module.q(/head/);
				head.q(
					`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous">`
				);
				let script = document.createElement('script');
				Object.assign(script, {
					src: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',
					integrity:
						'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz',
					crossOrigin: 'anonymous',
				});
				script.onload = resolve;
				script.onerror = reject;
				head.q(script);
			});
		}
	}
	set value(a) {
		let self = this;
		a = module.str(a);
		self.setAttribute('value', a);
		katex.render((self.state.value = a), self, {
			displayMode: TRUE,
		});
	}
}
defineElement('q-katex', Katex);
;
			
			for(var [k, v] of Object.entries({G,N,U,MIN_INT32,MAX_INT32,MAX_UINT32,MIN_INT64,MAX_INT64,MAX_UINT64,MIN_INT,MAX_INT,SECOND,MINUTE,HOUR,DAY,WEEK,YEAR,MONTH,i,createType,}),GeneratorFunction,ArrayIterator,SetIterator,MapIterator,Null,x,Undefined,x,str,float,int,list,define,describe,type,isInstance,assertInstance,parseIndentation,Datetime,TimeInterval,Iterator,Iterable,AsyncIterable,floordiv,divmod,q,Component,defineElement})) {
				Object.defineProperty(v, 'name', {value: k});
				//if (isInstance(v, Function)) define(v, {name: k});
				if (!window.hasOwnProperty(k)) window[k] = v;
			};
		};