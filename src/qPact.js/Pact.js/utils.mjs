const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER - 1;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;

export function describe(input) {
	return `${input != null ? `${input.constructor.name}: ` : ''}${input}`;
}
export function isPrimitive(input) {
	return input !== Object(input);
}
export function keys(input) {
	let iterator = input[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(input));
		if (assoc_mebbe) {
			_items = _items.map(([k]) => k);
		} else {
			_items = _items.map((v, i) => i);
		}
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in input) {
			_items.push(k);
		}
		return [true, _items];
	}
}
export function values(input) {
	let iterator = input[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(input));
		if (assoc_mebbe) {
			_items = _items.map(([k, v]) => v);
		}
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in input) {
			_items.push(input[k]);
		}
		return [true, _items];
	}
}
export function items(input) {
	let iterator = input[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(input));
		if (!assoc_mebbe) {
			_items = _items.map((v, i) => [i, v]);
		}
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in input) {
			_items.push([k, input[k]]);
		}
		return [true, _items];
	}
}

// @todo: not use stupid isNaN()
export function int(input = 0) {
	const value = +input;
	if (isNaN(value)) {
		throw TypeError(`Cannot convert ${describe(input)} to int`);
	} else if (value < MIN_SAFE_INTEGER || value > MAX_SAFE_INTEGER) {
		throw RangeError(
			`${describe(
				input
			)} must be in range <${MIN_SAFE_INTEGER}, ${MAX_SAFE_INTEGER}>`
		);
	} else {
		return value;
	}
}

export function float(input = 0) {
	const value = +input;
	if (isNaN(value)) {
		throw TypeError(`Cannot convert ${describe(input)} to float`);
	} else {
		return +input;
	}
}

export function str(input = '') {
	if (isPrimitive(input)) {
		return String(input);
	} else {
		let [assoc_mebbe, _entries] = entries(input);
		return assoc_mebbe
			? `{${_entries
					.map(([k, v]) => `${strf(k)}: ${strf(v)}`)
					.join(', ')}}`
			: `[${_entries.map(([k, v]) => strf(v)).join(', ')}]`;
	}
}
function strf(input) {
	return typeof input === 'string' ? `"${input}"` : `${input}`;
}

export function list(input = []) {
	if (isPrimitive(input) && typeof input !== 'string') {
		throw TypeError(`Cannot convert ${describe(input)} to list`);
	}
	return Array.from(input);
}

export function set(input = new Set()) {
	if (input[Symbol.iterator]) {
		return new Set(input);
	} else {
		throw TypeError(`Cannot convert ${describe(input)} to set`);
	}
}

export function map(input = new Map()) {
	try {
		return new Map(
			input instanceof Object
				? Object.entries(input)
				: typeof input === 'string'
				? (value = JSON.parse(input))
				: input
		);
	} catch (e) {
		throw TypeError(`Cannot convert ${describe(input)} to map`);
	}
}

export function dict(input = {}) {
	if (input && input.constructor === Object) {
		return input;
	} else {
		const value =
			typeof input === 'string' ? (value = JSON.parse(input)) : input;
		if (value[Symbol.iterator]) {
			const obj = {};
			for (const [k, v] of value) {
				obj[k] = v;
			}
			return obj;
		} else {
			if (value instanceof Object) {
				return value;
			} else {
				throw TypeError(`Cannot convert ${describe(input)} to dict`);
			}
		}
	}
}
