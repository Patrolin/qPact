class Component extends HTMLElement {
	constructor() {
		super();
		this.state = { ...this.constructor.state };
		// @todo: use html observer
		// @todo: css magic
		for (let k of this.constructor.events) {
			this.addEventListener(k.slice(2), () => this[k].call(this));
		}
		if (this.init) {
			try {
				this.init();
			} catch (e) {
				console.error(this, e);
			}
		}
	}
	async connectedCallback() {
		for (let k of module.keys(this.constructor.state)[1]) {
			this[k] = this.getAttribute(k);
		}
		if (this.load) {
			try {
				await this.load();
			} catch (e) {
				console.error(this, e);
			}
		}
	}
	async disconnectedCallback() {
		if (this.unload) {
			await this.unload();
		}
	}
	alter() {
		this.dispatchEvent(
			new CustomEvent('alter', {
				bubbles: TRUE,
				cancelable: TRUE,
			})
		);
	}
}
module.defineElement = function(name, Class) {
	if (!/-/.test(name)) {
		throw SyntaxError("Custom element name must contain '-'");
	}
	let ElementName = `${Class.name}Element`;
	eval(`this['${ElementName}'] = class ${ElementName} extends Component{}`); // js doesn't allow dynamic class names and uglify-es doesn't mangle evals properly...
	let Element = module[ElementName];
	let ClassEntries = descriptorEntries(Class, [
		'constructor',
		'name',
		'prototype',
	]);
	for (let [key, descriptor] of ClassEntries) {
		Object.defineProperty(Element, key, descriptor);
	}

	Element.events = [];
	Element.state = (Class.state && Class.state()) || {};
	let ClassPrototypeEntries = descriptorEntries(Class.prototype, [
		'constructor',
	]);
	for (let [key, descriptor] of ClassPrototypeEntries) {
		if (descriptor.get || descriptor.set) {
			// @todo: use setAttribute()
			Element.state[key] = Element.state[key];
		}
		if (typeof key !== 'symbol' && key.startsWith('on')) {
			Element.events.push(key);
		}
		Object.defineProperty(Element.prototype, key, descriptor);
	}
	return customElements.define(name, Element);
};
function descriptorEntries(obj, ignore) {
	let descriptors = Object.getOwnPropertyDescriptors(obj);
	for (let key of ignore) {
		delete descriptors[key];
	}
	let entries = Object.entries(descriptors);
	for (let key of Reflect.ownKeys(descriptors)) {
		if (typeof key === 'symbol') {
			entries.push([key, Object.getOwnPropertyDescriptor(obj, key)]);
		}
	}
	return entries;
}
