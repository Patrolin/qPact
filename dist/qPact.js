let qPact = new function() {
	'use strict';
	let e = this, t = window, n = void 0, i = null, r = !0;
	e.q = function(e, t = n) {
		return e instanceof RegExp ? a(document, e, t) : o(e, t);
	};
	function o(t, n) {
		if (t instanceof Node) return l(t, n);
		if (t instanceof Array) return l(t.map(t => e.q(t)), n);
		let i = document.createElement('template');
		i.innerHTML = t;
		let r = i.content.childNodes;
		return l(1 === r.length ? r[0] : [ ...r ], n);
	}
	function l(e, t) {
		return t === n ? e : Array(t).fill().map(() => s(e));
	}
	function s(e) {
		return e instanceof Node ? e.cloneNode(r) : e.map(s);
	}
	Node.prototype.Q = function(e, t = n) {
		let r, o = this, l = {};
		for (;(r = o.firstChild) !== i; ) {
			o.removeChild(r);
			r.id && (l[r.id] = r);
		}
		if (e === i) return [];
		let s = o.q(e, t);
		for (let e of o.querySelectorAll('[id]')) e.id in l && !e.childNodes.length && e.parentNode.replaceChild(l[e.id], e);
		return s instanceof Node ? s : s.map(e => e.id ? l[e.id] : e);
	};
	Node.prototype.q = function(e, t = n) {
		if (e instanceof RegExp) return a(this, e, t);
		let i = o(e, t);
		return i instanceof Node ? this.appendChild(i) : i.map(e => this.appendChild(e));
	};
	function a(e, t, n) {
		if (t.global) return l([ ...e.querySelectorAll(t.source) ], n);
		let r = e.querySelector(t.source);
		return r ? l(r, n) : i;
	}
	Array.prototype.Q = function(e, t = n) {
		return this.map(n => n.Q(e, t));
	};
	Array.prototype.q = function(e, t = n) {
		return e instanceof RegExp ? l(e.global ? c(this, e.source) : f(this, e.source), t) : this.map(n => n.q(e, t));
	};
	function c(e, t) {
		return e.map(e => e instanceof Node ? e.matches(t) ? e : i : c(e, t)).filter(e => e !== i);
	}
	function f(e, t) {
		return e.flat(1 / 0).find(e => e.matches(t));
	}
	e.isPrimitive = function(e) {
		return e !== Object(e);
	};
	e.isNative = function(e) {
		return /\[native code\]/.test(e.name);
	};
	e.isBoolean = function(e) {
		return 'boolean' == typeof e;
	};
	e.isString = function(e) {
		return 'string' == typeof e;
	};
	e.isNumber = function(e) {
		return 'number' == typeof e;
	};
	e.MAX_INT32 = -(e.MIN_INT32 = -2147483648) - 1;
	e.MAX_UINT32 = 4294967295;
	e.MAX_INT64 = -(e.MIN_INT64 = -Math.pow(2, 63)) - 1;
	e.MAX_UINT64 = Math.pow(2, 64) - 1;
	e.MAX_INT = -(e.MIN_INT = Number.MIN_SAFE_INTEGER - 1);
	e.WEEK = 7 * (e.DAY = 24 * (e.HOUR = 60 * (e.MINUTE = 60 * (e.SECOND = 1e3))));
	e.MONTH = (e.YEAR = 365.2425 * e.DAY) / 12;
	e.DateTime = class DateTime extends Date {
		get y() {
			this.getFullYear();
		}
		set y(e) {
			this.setFullYear(e);
		}
		get o() {
			this.getMonth();
		}
		set o(e) {
			this.setMonth(e);
		}
		get d() {
			this.getDate();
		}
		set d(e) {
			this.setDate(e);
		}
		get h() {
			this.getHours();
		}
		set h(e) {
			this.setHours(e);
		}
		get m() {
			this.getMinutes();
		}
		set m(e) {
			this.setMinutes(e);
		}
		get s() {
			this.getSeconds();
		}
		set s(e) {
			this.setSeconds(e);
		}
		get ms() {
			this.getMilliseconds();
		}
		set ms(e) {
			this.setMilliseconds(e);
		}
		constructor(e = "") {
			super();
			this.modify(e);
		}
		modify(e = "") {
			u(this, e);
		}
		format(e) {
			return new Intl.DateTimeFormat(n, {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				timeZoneName: 'long',
				...e
			}).format(this);
		}
	};
	e.TimeInterval = class {
		constructor(e) {
			let t = this;
			t.y = t.o = t.d = t.h = t.m = t.s = t.ms = 0;
			e && t.modify(e);
		}
		valueOf() {
			let {y: t, o: n, d: i, h: r, m: o, s: l, ms: s} = this;
			return t * e.YEAR + n * e.MONTH + i * e.DAY + r * e.HOUR + o * e.MINUTE + l * e.SECOND + s;
		}
		modify(t = "") {
			let n = this;
			u(n, t);
			let i = +n;
			i *= n.sign = Math.sign(i);
			i -= n.ms = i % e.SECOND;
			i -= n.s = i % e.MINUTE;
			i -= n.m = i % e.HOUR;
			i -= n.h = i % e.DAY;
			i -= n.d = i % e.MONTH;
			i -= n.o = i % e.YEAR;
			n.y = i;
			n.s /= e.SECOND;
			n.m /= e.MINUTE;
			n.h /= e.HOUR;
			n.d /= e.DAY;
			n.o /= e.MONTH;
			n.y /= e.YEAR;
		}
		toString() {
			let {y: t, o: n, d: i, h: r, m: o, s: l, ms: s, sign: a} = this, c = {};
			t && (c.years = t);
			n && (c.months = n);
			i && (c.days = i);
			r && (c.hours = r);
			o && (c.minutes = o);
			l && (c.seconds = l);
			s && (c.milliseconds = s);
			return `${[ '', '-', '+' ][a + 1]}${e.items(c).map(([e, t]) => `${t}${t > 1 ? e : e.slice(0, -1)}`).join(' ')}`;
		}
	};
	let d = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];
	function u(e, t) {
		let n = 1;
		for (let [i, r, o, l, s, a] of t.matchAll(/(\d+)([a-z]+)|([a-z]+)(\d+)|([+-])/g)) if (r) {
			let t = d.indexOf(o);
			if (0 > t && o in e) e[o] += n * r; else {
				let i = e.getDate(), o = e.getDay();
				if (t != o) {
					i += n > 0 ? t - o + 7 : t + o - 15;
					r--;
				}
				e.setDate(i + 7 * n * r);
			}
		} else s && l in e ? e[l] = +s : a && (n = '+' == a ? 1 : -1);
	}
	e.assoc_keys = function(e) {
		let t = e[Symbol.iterator];
		if (t) {
			let n = 'entries' === t.name, i = Array.from(t.call(e));
			return [ n, $1n ? i.map(([e]) => e) : i.map((e, t) => t) ];
		}
		{
			let t = [];
			for (let n in e) t.push(n);
			return [ r, t ];
		}
	};
	e.assoc_values = function(e) {
		let t = e[Symbol.iterator];
		if (t) {
			let n = 'entries' === t.name, i = Array.from(t.call(e));
			n && (i = i.map(([e, t]) => t));
			return [ n, i ];
		}
		{
			let t = [];
			for (let n in e) t.push(e[n]);
			return [ r, t ];
		}
	};
	e.assoc_items = function(e) {
		let t = e[Symbol.iterator];
		if (t) {
			let n = 'entries' === t.name, i = Array.from(t.call(e));
			n || (i = i.map((e, t) => [ t, e ]));
			return [ n, i ];
		}
		{
			let t = [];
			for (let n in e) t.push([ n, e[n] ]);
			return [ r, t ];
		}
	};
	e.keys = function(t) {
		return e.assoc_keys(t)[1];
	};
	e.values = function(t) {
		return e.assoc_values(t)[1];
	};
	e.items = function(t) {
		return e.assoc_items(t)[1];
	};
	e.bool = function(t = r) {
		return t && (e.isPrimitive(t) || t.length);
	};
	e.int = function(t = 0) {
		let n = Math.floor(+t);
		if (Object.is(n, NaN)) throw TypeError(`Cannot convert ${describe(t)} to int`);
		if (n < e.MIN_INT || n > e.MAX_INT) throw RangeError(`${describe(t)} must be in range <${e.MIN_INT}, ${e.MAX_INT}>`);
		return n;
	};
	e.float = function(e = 0) {
		if (isNaN(+e)) throw TypeError(`Cannot convert ${describe(e)} to float`);
		return +e;
	};
	e.str = function(t = "") {
		if (e.isPrimitive(t)) return t + "";
		{
			let [n, i] = assoc_items(t);
			return n ? `{${i.map(([t, n]) => `${e.isString(t) ? `"${t}"` : `${t}`}: ${str(n)}`).join(', ')}}` : `[${i.map(([e, t]) => str(t)).join(', ')}]`;
		}
	};
	e.list = function(t = []) {
		if (e.isPrimitive(t) && !e.isString(t)) throw TypeError(`Cannot convert ${describe(t)} to list`);
		return Array.from(t);
	};
	e.set = function(e = new Set()) {
		if (e[Symbol.iterator]) return new Set(e);
		throw TypeError(`Cannot convert ${describe(e)} to set`);
	};
	e.dict = function(e = new Map()) {
		try {
			return new Map(e instanceof Object ? Object.entries(e) : 'string' == typeof e ? value = JSON.parse(e) : e);
		} catch (t) {
			throw TypeError(`Cannot convert ${describe(e)} to map`);
		}
	};
	e.obj = function(e = {}) {
		if (e && e.letructor === Object) return e;
		{
			let t = 'string' == typeof e ? JSON.parse(e) : e;
			if (t[Symbol.iterator]) {
				let e = {};
				for (let [n, i] of t) e[n] = i;
				return e;
			}
			if (t instanceof Object) return t;
			throw TypeError(`Cannot convert ${describe(e)} to dict`);
		}
	};
	e.describe = function(e) {
		return `${e != i ? `${e.constructor.name}: ` : ''}${e}`;
	};
	e.matchAll = function(e, t) {
		let n, r = [];
		for (;(n = t.exec(e)) !== i; ) r.push(n);
		return r;
	};
	e.divmod = function(e, t) {
		let n = e / t;
		return [ 0 > n ? Math.ceil(n) : Math.floor(n), e % t ];
	};
	e.styles = (e.q(/#qPact/) || e.q(/head/).q('<div id="qPact">')).q("<style>body,html{width:100%;height:100%}*{box-sizing:border-box;display:inline-block;position:relative;padding:0;flex-basis:auto;flex-grow:0;flex-shrink:0;pointer-events:auto}body{display:block;margin:0}area,datalist,head,link,param,script,style,title{display:none}li{display:list-item}[table],table{display:inline-table;border-collapse:collapse;border-spacing:0}tbody{display:table-row-group}[caption],caption{display:table-caption}col{display:table-column}colgroup{display:table-column-group}tfoot{display:table-footer-group}thead{display:table-header-group}[table] > *,tbody > *{display:table-row}[table] > * > *,tbody > * > *{display:table-cell}align{display:inline-flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}[upward][up]{justify-content:flex-end}[upward][down]{justify-content:flex-start}[upward][left]{align-items:flex-end}[upward][right]{align-items:flex-start}[downward][up],align[up]{justify-content:flex-start}[downward][down],align[down]{justify-content:flex-end}[downward][left],align[left]{align-items:flex-start}[downward][right],align[right]{align-items:flex-end}[leftward][up]{align-items:flex-end}[leftward][down]{align-items:flex-start}[leftward][left]{justify-content:flex-end}[leftward][right]{justify-content:flex-start}[rightward][up]{align-items:flex-end}[rightward][down]{align-items:flex-start}[rightward][left]{justify-content:flex-end}[rightward][right]{justify-content:flex-start}[text-align-left]{text-align:left}[text-align-center]{text-align:center}[text-align-right]{text-align:right}[blank],blank{visibility:hidden}flex{display:inline-flex;flex-direction:row}flex > *{flex-grow:60;flex-shrink:60}[equal] > *{flex-basis:0}[upward]{flex-direction:column-reverse}[downward]{flex-direction:column}[leftward]{flex-direction:row-reverse}[rightward]{flex-direction:row}[no-grow]{flex-grow:0}[no-shrink]{flex-shrink:0}[no-flex]{flex-grow:0;flex-shrink:0}[f-5]{flex:5}[f-6]{flex:6}[f-10]{flex:10}[f-12]{flex:12}[f-15]{flex:15}[f-20]{flex:20}[f-30]{flex:30}[f-120]{flex:120}[f-180]{flex:180}[f-240]{flex:240}[f-300]{flex:300}[f-360]{flex:360}[f-600]{flex:600}[f-720]{flex:720}[full],[wide],full,wide{width:100%}[full],[tall],full,tall{height:100%}[hidden],hidden{display:none}stack{position:relative}stack > *{position:absolute;left:0;top:0;pointer-events:none}tooltip{display:none;position:absolute;left:50%;top:50%;font-weight:bold;font-size:0.35em;padding:0.2em 0.3em;border-radius:0.5em;transform:translate(-50%,-50%)}*:hover > tooltip{display:inline-block}tooltip[right]{left:100%}tooltip[up]{top:0}tooltip[left]{left:0}tooltip[down]{top:100%");
	e.Component = class Component extends HTMLElement {
		static set style(t) {
			let n = this.elementName;
			(e.styles.q(RegExp(`#${n}`)) || e.styles.q(`<style id="${n}">`)).innerHTML = `${n}{${e.items(t).map(([e, t]) => `${e}:${t}`).join(';')}`;
		}
		constructor() {
			super();
			let e = this, t = e.constructor;
			e.state = {
				...t.state
			};
			for (let n of t.events) e.addEventListener(n.slice(2), t => e[n].call(e, t));
		}
		async connectedCallback() {
			let t = this;
			try {
				let n = t.constructor;
				for (let [i, r] of e.items(n.state)) if (t.hasAttribute(i)) try {
					t[i] = t.getAttribute(i) || r;
				} finally {}
				await t.load();
			} catch (e) {
				console.error(t, e);
			}
		}
		async disconnectedCallback() {
			let e = this;
			try {
				await e.unload();
			} catch (t) {
				console.error(e, t);
			}
		}
		load() {}
		unload() {}
		alter() {
			this.dispatchEvent(new CustomEvent('alter', {
				bubbles: r,
				cancelable: r
			}));
		}
	};
	e.defineElement = function(t, i) {
		if (!/-/.test(t)) throw SyntaxError("Custom element name must contain '-'");
		let r = {
			...i.state
		}, o = new Set(), l = i.prototype;
		for (let t of Reflect.ownKeys(l)) {
			let i = Object.getOwnPropertyDescriptor(l, t);
			if (i.set) {
				i.get || Object.defineProperty(l, t, {
					...i,
					get: function() {
						return this.state[t];
					}
				});
				r[t] === n && (r[t] = n);
			} else e.isString(t) && t.startsWith('on') && o.add(t);
		}
		i.state = r;
		i.events = o;
		i.elementName = t;
		return customElements.define(t, i);
	};
	class Blink extends e.Component {}
	Blink.style = {};
	e.defineElement('q-blink', Blink);
	class Clock extends e.Component {
		load() {
			let e = this;
			e.interval = setInterval(() => {
				e.render();
			}, 1e3);
			e.render();
		}
		unload() {
			clearInterval(this.interval);
		}
		render() {
			this.Q(new Date());
		}
	}
	e.defineElement('q-clock', Clock);
	class Copy extends e.Component {
		onclick() {
			let e = this;
			e.focus();
			let t = e.contentEditable;
			e.contentEditable = r;
			document.execCommand('selectAll');
			e.contentEditable = t;
			try {
				document.execCommand('copy');
			} catch (t) {
				navigator.clipboard.writeText(e.innerText);
			}
		}
	}
	e.defineElement('q-copy', Copy);
	class Katex extends e.Component {
		init() {
			if (t.katex === n) return new Promise(function(t, n) {
				let i = e.q(/head/);
				i.q("<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css\" integrity=\"sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq\" crossorigin=\"anonymous\">");
				let r = document.createElement('script');
				Object.assign(r, {
					src: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',
					integrity: 'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz',
					crossOrigin: 'anonymous'
				});
				r.onload = t;
				r.onerror = n;
				i.q(r);
			});
		}
		set value(t) {
			let n = this;
			t = e.str(t);
			n.setAttribute('value', t);
			katex.render(n.state.value = t, n, {
				displayMode: r
			});
		}
	}
	e.defineElement('q-katex', Katex);
	for (let n in e) n in t ? e.isNative(t[n]) || console.warn(`qPact: ${n} is already defined`) : t[n] = e[n];
}();