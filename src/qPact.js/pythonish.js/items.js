delete keys;
delete values;
module.keys = function(input) {
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
		return [TRUE, _items];
	}
};
module.values = function(input) {
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
		return [TRUE, _items];
	}
};
module.items = function(input) {
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
		return [TRUE, _items];
	}
};
