export function q(input, n = undefined) {
	if (input instanceof RegExp) return document.q(input, n);
	if (input instanceof Node) return q_multiply(input, n);
	if (input instanceof Array)
		return q_multiply(
			input.map((x) => q(x)),
			n
		);
	let template = document.createElement('template');
	template.innerHTML = input;
	let children = template.content.childNodes;
	return q_multiply(children.length === 1 ? children[0] : [...children], n);
}
function q_multiply(input, n) {
	function q_clone(input) {
		return input instanceof Node ? input.cloneNode(TRUE) : input.map(q_clone);
	}
	return n === undefined ? input : new Array(n).fill().map(() => q_clone(input));
}

define(Node.prototype, {
	Q: function Q_Node(input, n) {
		// @TODO: fix moving elements
		let self = this;
		let descendants = {};
		let e;
		while ((e = self.firstChild) !== null) {
			self.removeChild(e);
			if (e.id) descendants[e.id] = e;
		}
		if (input === null) return [];
		let result = self.q(input, n);
		for (let e of self.querySelectorAll('[id]'))
			if (e.id in descendants && !e.childNodes.length)
				e.parentNode.replaceChild(descendants[e.id], e);
		return result instanceof Node ? result : result.map((e) => (e.id ? descendants[e.id] : e));
	},
	q: function q_Node(input, n) {
		if (input instanceof RegExp) {
			if (input.global) return q_multiply([...this.querySelectorAll(input.source)], n);
			let search = this.querySelector(input.source);
			return search ? q_multiply(search, n) : null;
		}
		return q_Node_append(this, q(input, n));
	},
});
function q_Node_append(self, input) {
	return input instanceof Node
		? self.appendChild(input)
		: input.map((x) => q_Node_append(self, x));
}

define(Array.prototype, {
	Q: function Q_Array(input, n) {
		return this.map((e) => e.Q(input, n));
	},
	q: function q_Array(input, n) {
		return input instanceof RegExp
			? q_multiply(
					input.global
						? q_Array_filter(this, input.source)
						: q_Array_find(this, input.source),
					n
			  )
			: this.map((e) => e.q(input, n));
	},
});
function q_Array_filter(self, query) {
	return self
		.map((x) => {
			return x instanceof Node ? (x.matches(query) ? x : null) : q_Array_filter(x, query);
		})
		.filter((x) => x !== null);
}

function q_Array_find(self, query) {
	return self.flat(Infinity).find((e) => e.matches(query));
}
