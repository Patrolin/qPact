module.assoc_keys = function(input) {
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
module.assoc_values = function(input) {
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
module.assoc_items = function(input) {
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
module.keys = function(input) {
	return module.assoc_keys(input)[1];
};
module.values = function(input) {
	return module.assoc_values(input)[1];
};
module.items = function(input) {
	return module.assoc_items(input)[1];
};
