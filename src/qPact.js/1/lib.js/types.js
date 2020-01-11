// @todo: dont use stupid isNaN()
module.bool = function(a = TRUE) {
	return a && (module.isPrimitive(a) || a.length);
};
module.int = function(a = 0) {
	let value = Math.floor(+a);
	if (Object.is(value, NaN)) {
		throw TypeError(`Cannot convert ${describe(a)} to int`);
	} else if (value < module.MIN_INT || value > module.MAX_INT) {
		throw RangeError(
			`${describe(a)} must be in range <${module.MIN_INT}, ${
				module.MAX_INT
			}>`
		);
	} else {
		return value;
	}
};

module.float = function(a = 0) {
	let value = +a;
	if (isNaN(value)) {
		throw TypeError(`Cannot convert ${describe(a)} to float`);
	} else {
		return +a;
	}
};

module.str = function(a = '') {
	if (module.isPrimitive(a)) {
		return String(a);
	} else {
		let [assoc_mebbe, _entries] = assoc_items(a);
		return assoc_mebbe
			? `{${_entries
					.map(
						([k, v]) =>
							`${module.isString(k) ? `"${k}"` : `${k}`}: ${str(
								v
							)}`
					)
					.join(', ')}}`
			: `[${_entries.map(([k, v]) => str(v)).join(', ')}]`;
	}
};

module.list = function(a = []) {
	if (module.isPrimitive(a) && !module.isString(a)) {
		throw TypeError(`Cannot convert ${describe(a)} to list`);
	}
	return Array.from(a);
};

module.set = function(a = new Set()) {
	if (a[Symbol.iterator]) {
		return new Set(a);
	} else {
		throw TypeError(`Cannot convert ${describe(a)} to set`);
	}
};

module.dict = function(a = new Map()) {
	try {
		return new Map(
			a instanceof Object
				? Object.entries(a)
				: typeof a === 'string'
				? (value = JSON.parse(a))
				: a
		);
	} catch (e) {
		throw TypeError(`Cannot convert ${describe(a)} to map`);
	}
};

module.obj = function(a = {}) {
	if (a && a.letructor === Object) {
		return a;
	} else {
		let value = typeof a === 'string' ? (value = JSON.parse(a)) : a;
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
				throw TypeError(`Cannot convert ${describe(a)} to dict`);
			}
		}
	}
};
