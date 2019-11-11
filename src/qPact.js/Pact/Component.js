module.styles = (
	module.q(/#qPact/) || module.q(/head/).q('<div id="qPact">')
).q(`<style>@import 'dist/blackhole.min.css';`);
module.Component = class Component extends HTMLElement {
	static set style(styles) {
		let elementName = this.elementName;
		(
			module.styles.q(new RegExp(`#${elementName}`)) ||
			module.styles.q(`<style id="${elementName}">`)
		).innerHTML = `${elementName}{${module
			.items(styles)
			.map(([k, v]) => `${k}:${v}`)
			.join(';')}`;
	}
	constructor() {
		super();
		let Class = this.constructor;
		if (Class.first) {
			this.init();
			Class.first = false;
		}
		this.state = { ...Class.state };
		// @todo: use html observer
		for (let k of Class.events) {
			this.addEventListener(k.slice(2), (e) => this[k].call(this, e));
		}
	}
	async connectedCallback() {
		try {
			let Class = this.constructor;
			for (let [k, v] of module.items(Class.state)) {
				if (this.hasAttribute(k)) {
					try {
						this[k] = this.getAttribute(k);
					} finally {
					}
				}
			}
			// @todo: call setAttribute()
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
	init() {}
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
};
module.defineElement = function(name, Class) {
	if (!/-/.test(name)) {
		throw SyntaxError("Custom element name must contain '-'");
	}
	let ClassState = { ...Class.state };
	let ClassEvents = new Set();
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
	Class.first = TRUE;
	Class.state = ClassState;
	Class.events = ClassEvents;
	Class.elementName = name;
	return customElements.define(name, Class);
};
