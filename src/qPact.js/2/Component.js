module.styles = (
	module.q(/#qPact/) || module.q(/head/).q('<div id="qPact">')
).q(`<style>@import 'dist/blackhole.min.css';`);
module.Component = class Component extends HTMLElement {
	// get style
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
			for (let [k, v] of module.items(Class.state)) {
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
					get: function() {
						return this.state[key];
					},
				});
			if (ClassState[key] === UNDEFINED) ClassState[key] = UNDEFINED;
		} else if (module.isString(key) && key.startsWith('on')) {
			ClassEvents.add(key);
		}
	}
	Class.state = ClassState;
	Class.events = ClassEvents;
	Class.elementName = name;
	return customElements.define(name, Class);
};
