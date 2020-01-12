module.q = function(input, n = UNDEFINED) {
	return input instanceof RegExp
		? q_Node_RegExp(document, input, n)
		: q_create(input, n);
};
function q_create(input, n) {
	if (input instanceof Node) return q_multiply(input, n);
	if (input instanceof Array)
		return q_multiply(
			input.map((x) => module.q(x)),
			n
		);
	let template = document.createElement('template');
	template.innerHTML = input;
	let children = template.content.childNodes;
	return q_multiply(children.length === 1 ? children[0] : [...children], n);
}
function q_multiply(input, n) {
	return n === UNDEFINED
		? input
		: new Array(n).fill().map(() => q_clone(input));
}
function q_clone(input) {
	return input instanceof Node ? input.cloneNode(TRUE) : input.map(q_clone);
}

// @todo: fix Object.define() on prototypes
Node.prototype.Q = function Q_Node(input, n = UNDEFINED) {
	let self = this;
	let descendants = {};
	let e;
	while ((e = self.firstChild) !== NULL) {
		self.removeChild(e);
		if (e.id) descendants[e.id] = e;
	}
	if (input === NULL) return [];
	let result = self.q(input, n);
	for (let e of self.querySelectorAll('[id]'))
		if (e.id in descendants && !e.childNodes.length)
			e.parentNode.replaceChild(descendants[e.id], e);
	return result instanceof Node
		? result
		: result.map((e) => (e.id ? descendants[e.id] : e));
};
Node.prototype.q = function q_Node(input, n = UNDEFINED) {
	if (input instanceof RegExp) return q_Node_RegExp(this, input, n);
	let x = q_create(input, n);
	if (x instanceof Node) {
		return this.appendChild(x);
	} else {
		return x.map((e) => this.appendChild(e));
	}
};
function q_Node_RegExp(self, regexp, n) {
	if (regexp.global)
		return q_multiply(self.querySelectorAll(regexp.source), n);
	let search = self.querySelector(regexp.source);
	return search ? q_multiply(search, n) : NULL;
}

Array.prototype.Q = function Q_Array(input, n = UNDEFINED) {
	return this.map((e) => e.Q(input, n));
};
Array.prototype.q = function q_Array(input, n = UNDEFINED) {
	return input instanceof RegExp
		? q_multiply(
				input.global
					? q_Array_filter(this, input.source)
					: q_Array_find(this, input.source),
				n
		  )
		: this.map((e) => e.q(input, n));
};
function q_Array_filter(self, query) {
	return self
		.map((x) => {
			return x instanceof Node
				? x.matches(query)
					? x
					: NULL
				: q_Array_filter(x, query);
		})
		.filter((x) => x !== NULL);
}

function q_Array_find(self, query) {
	return self.flat(Infinity).find((e) => e.matches(query));
}
