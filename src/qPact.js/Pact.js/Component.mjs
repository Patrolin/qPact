class Component extends HTMLElement {
	constructor() {
		super();
		this.state = this.constructor.state;
		for (let [k, d] of module.items(this.constructor.stateDescriptors)[1]) {
			Object.defineProperty(this, k, d);
		}
		for (let k of this.constructor.events) {
			this.addEventListener(k.slice(2), () => this[k].call(this));
		}
		if (this.initialize) {
			try {
				this.initialize();
			} catch (e) {
				console.error(this, e);
			}
		}
	}
	async connectedCallback() {
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
export function defineElement(name, Class) {
	if (!/-/.test(name)) {
		throw SyntaxError("Custom element name must contain '-'");
	}
	let ElementName = `${Class.name}Element`;
	eval(`this['${ElementName}'] = class ${ElementName} extends Component{}`);
	let Element = this[ElementName];
	let ClassEntries = descriptorEntries(Class, [
		'constructor',
		'name',
		'prototype',
	]);
	for (let [key, descriptor] of ClassEntries) {
		Object.defineProperty(Element, key, descriptor);
	}

	Element.events = [];
	Element.state = Element.state || {};
	Element.stateDescriptors = {};
	let ClassPrototypeEntries = descriptorEntries(Class.prototype, [
		'constructor',
	]);
	for (let [key, descriptor] of ClassPrototypeEntries) {
		if (descriptor.get || descriptor.set) {
			Element.stateDescriptors[key] = {
				get() {
					return descriptor.get.call(this.state);
				},
				set(v) {
					return descriptor.set.call(this.state, v);
				},
			};
		} else {
			if (typeof key !== 'symbol' && key.startsWith('on')) {
				Element.events.push(key);
			}
			Object.defineProperty(Element.prototype, key, descriptor);
		}
	}
	return customElements.define(name, Element);
}
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
