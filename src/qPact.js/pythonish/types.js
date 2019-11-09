// @todo: dont use stupid isNaN()
module.bool = function(input = TRUE) {
	return !!input; // @todo: implement bool
};
module.int = function(input = 0) {
	let value = Math.floor(+input);
	if (Object.is(value, NaN)) {
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
};

module.float = function(input = 0) {
	let value = +input;
	if (isNaN(value)) {
		throw TypeError(`Cannot convert ${describe(input)} to float`);
	} else {
		return +input;
	}
};

module.str = function(input = '') {
	if (module.isPrimitive(input)) {
		return String(input);
	} else {
		let [assoc_mebbe, _entries] = entries(input);
		return assoc_mebbe
			? `{${_entries
					.map(([k, v]) => `${strf(k)}: ${strf(v)}`)
					.join(', ')}}`
			: `[${_entries.map(([k, v]) => strf(v)).join(', ')}]`;
	}
};
function strf(input) {
	return typeof input === 'string' ? `"${input}"` : `${input}`;
}

module.list = function(input = []) {
	if (module.isPrimitive(input) && typeof input !== 'string') {
		throw TypeError(`Cannot convert ${describe(input)} to list`);
	}
	return Array.from(input);
};

module.set = function(input = new Set()) {
	if (input[Symbol.iterator]) {
		return new Set(input);
	} else {
		throw TypeError(`Cannot convert ${describe(input)} to set`);
	}
};

module.map = function(input = new Map()) {
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
};

module.dict = function(input = {}) {
	if (input && input.letructor === Object) {
		return input;
	} else {
		let value =
			typeof input === 'string' ? (value = JSON.parse(input)) : input;
		if (value[Symbol.iterator]) {
			let obj = {};
			for (let [k, v] of value) {
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
};
