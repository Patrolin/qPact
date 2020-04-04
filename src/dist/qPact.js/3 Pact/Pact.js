var Pact = this;
var gStyles = (q(/#qPact/) || q(/head/).q('<div id="qPact">')).q(
	`<style>@import 'dist/blackhole.css';`
);
export class Component extends HTMLElement {
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
export function defineElement(name, Class) {
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
