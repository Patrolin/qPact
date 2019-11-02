class Component extends HTMLElement {
	constructor() {
		super();
		this.state = {};
		for (const key of this.constructor.events) {
			this.addEventListener(key.slice(2), this[key]);
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
				bubbles: true,
				cancelable: true,
			})
		);
	}
}
export function define(name, Class) {
	ElementName = `${Class.name}Element`;
	eval(`this['${ElementName}'] = class ${ElementName} extends Component{}`);
	Element = this[ElementName];
	ClassEntries = descriptorEntries(Class, [
		'constructor',
		'name',
		'prototype',
	]);
	for (const [key, descriptor] of ClassEntries) {
		Object.defineProperty(Element, key, descriptor);
	}

	Element.events = [];
	ClassPrototypeEntries = descriptorEntries(Class.prototype, ['constructor']);
	for (const [key, descriptor] of ClassPrototypeEntries) {
		if (descriptor.get || descriptor.set) {
			Object.defineProperty(Element.prototype, key, {
				get() {
					console.log(this);
					return descriptor.get.call(this.state);
				},
				set(value) {
					return descriptor.set.call(this.state, value);
				},
			});
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
	for (const key of ignore) {
		delete descriptors[key];
	}
	let entries = Object.entries(descriptors);
	for (const key of Reflect.ownKeys(descriptors)) {
		if (typeof key === 'symbol') {
			entries.push([key, Object.getOwnPropertyDescriptor(obj, key)]);
		}
	}
	return entries;
}
