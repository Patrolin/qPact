const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER - 1;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;

function describe(input) {
	return `${input != null ? `${input.constructor.name}: ` : ''}${input}`;
}

function qMultiply(input, n) {
	if (typeof n === 'number') {
		if (n > MAX_SAFE_INTEGER) {
			window.location.href = 'https://xkcd.com/2200/';
			return;
		}
		if (n >= 0) {
			const result = [];
			for (let i = 0; i < n; ++i) {
				result.push(qClone(input));
			}
			return result;
		} else {
			throw RangeError(
				`n expected in range <0; ∞>, found ${
					input != null ? `${input.constructor.name}: ` : ''
				}${input}`
			);
		}
	} else {
		if (input instanceof NodeList) {
			return [...input];
		} else {
			return input;
		}
	}
}
function qClone(input) {
	if (input instanceof Node) {
		return input.cloneNode(true);
	} else {
		const result = [];
		input.forEach((e) => {
			result.push(qClone(e));
		});
		return result;
	}
}

function q(input, n = undefined) {
	if (input === null) {
		return null;
	} else if (typeof input === 'string') {
		const template = document.createElement('template');
		template.innerHTML = input;
		const children = template.content.childNodes;
		const e = children.length > 1 ? children : children[0];
		return qMultiply(e, n);
	} else if (input instanceof Array) {
		return qMultiply(input.map((e) => q(e)), n);
	} else if (input instanceof Node) {
		return qMultiply(input, n);
	} else if (input instanceof RegExp) {
		if (input.global) {
			return qMultiply(document.querySelectorAll(input.source), n);
		} else {
			const search = document.querySelector(input.source);
			return search ? qMultiply(search, n) : null;
		}
	} else {
		throw TypeError(
			`input expected type (RegExp | string | Node | Array | null), found ${describe(input)}`
		);
	}
}

Node.prototype.Q = function(input, n = undefined) {
	let first;
	while ((first = this.firstChild) !== null) {
		this.removeChild(first);
	}
	try {
		return this.q(input, n);
	} catch (e) {
		console.warn('hello');
	}
};
Node.prototype.q = function(input, n = undefined) {
	if (input instanceof RegExp) {
		if (input.global) {
			return qMultiply(this.querySelectorAll(input.source), n);
		} else {
			const search = this.querySelector(input.source);
			return search ? qMultiply(search, n) : null;
		}
	} else {
		const e = q(input, n);
		if (e instanceof Array) {
			e.forEach((f) => {
				this.appendChild(f);
			});
			return e;
		} else if (e instanceof Node) {
			this.appendChild(e);
			return e;
		} else {
			return null;
		}
	}
};

Array.prototype.Q = function(input, n = undefined) {
	const result = [];
	this.forEach((e) => {
		result.push(e.Q(input, n));
	});
	return result;
};
Array.prototype.q = function(input, n = undefined) {
	if (input instanceof RegExp) {
		if (input.global) {
			return qMultiply(qFilter(this, input.source), n);
		} else {
			const search = qFind(this, input.source);
			return search ? qMultiply(search, n) : null;
		}
	} else {
		const result = [];
		this.forEach((e) => {
			result.push(e.q(input, n));
		});
		return result;
	}
};
function qFilter(array, css) {
	const result = [];
	qFilterInner(result, array, css);
	return result;
}
function qFilterInner(result, array, css) {
	array.forEach((e) => {
		if (e instanceof Element) {
			if (e.matches(css)) {
				result.push(e);
			}
		} else if (e instanceof Array) {
			qFilterInner(result, e, css);
		}
	});
}
function qFind(array, css) {
	for (const e of array) {
		if (e instanceof Element) {
			if (e.matches(css)) {
				return e;
			}
		} else if (e instanceof Array) {
			const search = qFind(e, css);
			if (search) {
				return search;
			}
		}
	}
	return null;
}

const Component = new Proxy(
	class Component extends HTMLElement {
		static props() {
			return {};
		}
		constructor() {
			super();
			const Class = this.constructor;
			const Prototype = Class.prototype;
			const props = Class.props;

			// PROPS
			this.props = {};
			Object.entries(props).forEach(([key, p]) => {
				const proxy = Object.assign({}, p);
				Object.defineProperty(this.props, key, {
					value: proxy,
				});
				Object.defineProperty(this, key, {
					get() {
						return proxy.get.call(this, proxy);
					},
					set(value) {
						return proxy.set.call(this, proxy, value);
					},
				}); //todo
				Object.defineProperty(this, `_${key}`, {
					get() {
						return this._state[key];
					},
					set(value) {
						this._state[key] = value;
					},
				});
			});

			// EVENTS
			Reflect.ownKeys(Prototype).forEach((key) => {
				if (key.startsWith('on')) {
					this.addEventListener(key.slice(2), this[key]);
				}
			});
		}
		async connectedCallback() {
			if (this.load) {
				try {
					await this.load();
				} catch (e) {
					console.error(this, e);
					this.parentNode.removeChild(this);
				}
			}
		}
		async disconnectedCallback() {
			if (this.unload) {
				await this.unload();
			}
		}
		alter() {
			const state = this.state;
			this.dispatchEvent(new CustomEvent('alter', { bubbles: true, cancelable: true }));
			this._state = state;
		}
	},
	{
		apply(target, self, inputs) {
			const Class = class GenericComponent extends target {};
			const Prototype = Class.prototype;
			const [propDefinitions] = inputs;
			if (typeof propDefinitions !== 'object') {
				throw TypeError(
					`Component(props) expected type object, found ${describe(propDefinitions)}`
				);
			}
			const props = {};
			Object.entries(propDefinitions).forEach(([key, Type]) => {
				props[key] = proxy(key, Type);
			});
			Class.props = props;

			// STATE
			const observedAttributes = Object.keys(props);
			Object.defineProperty(Class, 'observedAttributes', {
				get() {
					return observedAttributes;
				},
			});
			Object.defineProperty(Prototype, 'state', {
				get() {
					const state = {};
					// todo: deepcopy?
					observedAttributes.forEach((key) => {
						state[key] = this[key];
					});
					return state;
				},
				set(state) {
					observedAttributes.forEach((key) => {
						this[key] = state[key];
					});
				},
			});
			return Class;
		},
	}
);

function proxy(key, Type) {
	if (typeof Type === 'function') {
		return {
			value: Type(),
			get(proxy) {
				return proxy.value;
			},
			set(proxy, input) {
				return this.setAttribute(key, (proxy.value = Type(input)));
			},
		};
	} else {
		if ('get' in Type && 'set' in Type) {
			return Type;
		} else {
			throw ValueError(`invalid proxy for ${key}: ${describe(Type)}`);
		}
	}
}

function int(input = 0) {
	num = Math.floor(+input);
	if (isFinite(num)) {
		return num;
	} else {
		throw RangeError(
			`${describe(input)} must be in range <${MIN_SAFE_INTEGER}, ${MAX_SAFE_INTEGER}>`
		);
	}
}

function float(input = 0) {
	if (isNaN(new_value)) {
		throw TypeError('NaN is not a valid float');
	} else {
		return +input;
	}
}

function str(input = '') {
	if (input === undefined) {
		return 'undefined';
	} else if (isNaN(input)) {
		return 'NaN';
	} else {
		return JSON.stringify(input);
	}
}

function list(input = []) {
	if (input[Symbol.iterator]) {
		return Array.from(input);
	} else {
		throw TypeError(`${describe(input)} is not iterable`);
	}
}

function set(input = new Set()) {
	if (input[Symbol.iterator]) {
		return new Set(input);
	} else {
		throw TypeError(`${describe(input)} is not iterable`);
	}
}

function dict(input = {}) {
	if (input instanceof Object) {
		return input;
	} else if (typeof input === 'string') {
		return JSON.parse(input);
	}
}

class Console extends Component {
	load() {
		this.log = this.q('<div>');
		this.textarea = q('<input type="text">');
		this.q('<div wide>>').q(this.textarea);
	}
	onkeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			const input = this.textarea.value;
			this.textarea.value = '';
			this.log.q(`<span wide>> ${input}`);
			this.log.q(`<span wide><- ${eval(input)}`);
		}
	}
}
customElements.define('q-console', Console);

const KatexProps = {
	value: str,
};
class Katex extends Component(KatexProps) {
	load() {
		if (window.katex) {
			this.render(this.value, this);
		} else {
			throw ReferenceError('katex not found, get it at https://katex.org/');
		}
	}
	onchange() {
		this.render();
	}
	render() {
		window.katex.render(this.value, this);
	}
}
customElements.define('q-katex', Katex);

const ClockProps = {
	weekday: str,
	day: str,
	month: str,
	year: str,
	hour: str,
	minute: str,
	second: str,
	locales: list,
	options: dict,
};
class Clock extends Component(ClockProps) {
	load() {
		let { $weekday, $day, $month, $year, $hour, $minute, $second } = this;
		if (!$weekday && !$day && !$month && !$year && !$hour && !$minute && !$second) {
			$weekday = $day = $month = $year = $hour = $minute = $second = true;
		}
		$weekday && (this.weekday = this.weekday ? this.weekday : 'long');
		$day && (this.day = this.day ? this.day : 'numeric');
		$month && (this.month = this.month ? this.month : 'long');
		$year && (this.year = this.year ? this.year : 'numeric');
		$hour && (this.hour = this.hour ? this.hour : '2-digit');
		$minute && (this.minute = this.minute ? this.minute : '2-digit');
		$second && (this.second = this.second ? this.second : 'numeric');
		const { weekday, day, month, year, hour, minute, second } = this;
		const options = { weekday, day, month, year, hour, minute, second, ...this.options };
		this.formatter = new Intl.DateTimeFormat(this.locales, options);
		this.alter();
	}
	unload() {
		clearTimeout(this.timeout);
	}
	getDelay() {
		const date = new Date();
		if (this.$second) {
			date.setSeconds(date.getSeconds() + 1, 0);
		} else if (this.$minute) {
			date.setMinutes(date.getMinutes() + 1, 0, 0);
		} else if (this.$hour) {
			date.setHours(date.getHours() + 1, 0, 0, 0);
		} else {
			date.setHours(0, 0, 0, 0);
			if (this.$day || this.$weekday) {
				date.setDate(date.getDate() + 1);
			} else if (this.$month) {
				date.setMonth(date.getMonth() + 1, 0);
			} else if (this.$year) {
				date.setFullYear(date.getFullYear() + 1, 0, 0);
			}
		}
		return date - new Date();
	}

	onalter(e) {
		this.timeout = setTimeout(() => {
			this.alter();
		}, this.getDelay());
		this.render();
	}
	render() {
		this.Q(this.formatter.format(new Date()));
	}
}
customElements.define('q-clock', Clock);
