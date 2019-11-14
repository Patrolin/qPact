module.assoc_keys = function(a) {
	let iterator = a[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(a));
		_items = assoc_mebbe
			? (_items = _items.map(([k]) => k))
			: (_items = _items.map((v, i) => i));
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in a) _items.push(k);
		return [TRUE, _items];
	}
};
module.assoc_values = function(a) {
	let iterator = a[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(a));
		if (assoc_mebbe) _items = _items.map(([k, v]) => v);
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in a) _items.push(a[k]);
		return [TRUE, _items];
	}
};
module.assoc_items = function(a) {
	let iterator = a[Symbol.iterator];
	if (iterator) {
		let assoc_mebbe = iterator.name === 'entries';
		let _items = Array.from(iterator.call(a));
		if (!assoc_mebbe) _items = _items.map((v, i) => [i, v]);
		return [assoc_mebbe, _items];
	} else {
		let _items = [];
		for (let k in a) _items.push([k, a[k]]);
		return [TRUE, _items];
	}
};
module.keys = function(a) {
	return module.assoc_keys(a)[1];
};
module.values = function(a) {
	return module.assoc_values(a)[1];
};
module.items = function(a) {
	return module.assoc_items(a)[1];
};
