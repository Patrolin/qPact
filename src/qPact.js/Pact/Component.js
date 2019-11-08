(module.q(/#qPact/) || module.q(/head/).q('<div id="qPact">')).q(
	`<style>@import 'dist/blackhole.min.css';`
);
module.Component = class Component extends HTMLElement {
	constructor() {
		super();
		let Class = this.constructor;
		this.state = { ...Class.state };
		// @todo: use html observer
		// @todo: css magic
		for (let k of Class.events) {
			this.addEventListener(k.slice(2), () => this[k].call(this));
		}
	}
	async connectedCallback() {
		try {
			let Class = this.constructor;
			if (Class.first) {
				await this.first();
				Class.first = false;
			}
			for (let [k, v] of module.items(Class.state)[1]) {
				this[k] = this.getAttribute(k) || v;
			}
			await this.load();
		} catch (e) {
			console.error(this, e);
		}
	}
	async disconnectedCallback() {
		try {
			await this.unload();
		} catch (e) {
			console.error(this, e);
		}
	}
	first() {}
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
	static events() {
		return [];
	}
	static state() {
		return {};
	}
};
module.defineElement = function(name, Class) {
	if (!/-/.test(name)) {
		throw SyntaxError("Custom element name must contain '-'");
	}
	let ClassEvents = new Set(Class.events());
	let ClassState = Class.state();
	let Prototype = Class.prototype;
	for (let key of Reflect.ownKeys(Prototype)) {
		let descriptor = Object.getOwnPropertyDescriptor(Prototype, key);
		if (descriptor.set) {
			if (!descriptor.get)
				Object.defineProperty(Prototype, key, {
					...descriptor,
					get() {
						return this.state[key];
					},
				});
			if (ClassState[key] === UNDEFINED) ClassState[key] = UNDEFINED;
		} else if (typeof key == 'string' && key.startsWith('on')) {
			ClassEvents.add(key);
		}
	}
	Class.events = ClassEvents;
	Class.state = ClassState;
	Class.first = true;
	return customElements.define(name, Class);
};
