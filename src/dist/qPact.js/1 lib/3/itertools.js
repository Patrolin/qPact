function* computeKeys(input) {
	assertInstance(input, Iterable);
	var _values = input.values();
	var { done, value } = _values.next();
	for (var key of Reflect.ownKeys(input)) {
		if (done) break;
		if (input[key] === value) {
			yield key;
			({ done, value } = _values.next());
		}
	}
}
function* zip(iterators, filler) {
	iterators = iterators.map((x) => {
		assertInstance(x, Iterable);
		x.values();
	});
	var res = Array(iterators.length);
	if (filler === undefined)
		while (true) {
			for (var i = 0; i < iterators.length; ++i) {
				var { done, value } = iterators[i].next();
				if (done) return;
				res[i] = value || fillvalue;
			}
			yield [...res];
		}
	else
		while (true) {
			var all_done = true;
			for (var i = 0; i < iterators.length; ++i) {
				var { done, value } = iterators[i].next();
				all_done &= done;
				res[i] = value || filler;
			}
			if (all_done) return;
			yield [...res];
		}
}
define(Array.prototype, {
	Array(callback) {
		return callback ? arrayMap.call(this, callback) : [...this];
	},
});
define(String.prototype, {
	keys: Array.prototype.keys,
});
define(Iterator.prototype, {
	*keys() {
		var i = 0;
		for (var v of this) yield i++;
	},
	values() {
		return this;
	},
	*entries() {
		var i = 0;
		for (var v of this) yield [i++, v];
	},
});
define(Iterable.prototype, {
	keys() {
		return keys(this);
	},
	values() {
		return values(this);
	},
	entries() {
		return entries(this);
	},
	*map(callback) {
		assertInstance(callback, Function);
		for (var [k, v] of this.entries()) yield callback(v, k, this);
	},
	Array(callback) {
		return [...(callback ? this.map(callback) : this)];
	},
	Set(callback) {
		return new Set(callback ? this.map(callback) : this);
	},
	Map(callback) {
		return new Map(callback ? this.map(callback) : this);
	},
	Object(callback) {
		var obj = {};
		for (var [k, v] of callback ? this.map(callback) : this) {
			obj[k] = v;
		}
		return obj;
	},
});
delete Array.prototype.map;
