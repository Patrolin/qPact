// @todo: support -n
export function q(input, n = UNDEFINED) {
	return input instanceof RegExp
		? q_Node_RegExp(document, input, n)
		: q_create(input, n);
}
function q_create(input, n) {
	if (input instanceof Node) {
		return q_multiply(input, n);
	} else if (input instanceof Array) {
		return q_multiply(input.map((x) => q(x)), n);
	} else {
		const template = document.createElement('template');
		template.innerHTML = input;
		const children = template.content.childNodes;
		return q_multiply(children.length === 1 ? children[0] : children, n);
	}
}
function q_multiply(input, n) {
	return n === UNDEFINED
		? input
		: new Array(n).fill().map(() => q_clone(input));
}
function q_clone(input) {
	return input instanceof Node ? input.cloneNode(true) : input.map(q_clone);
}

// @todo: fix Object.define() on prototypes
Node.prototype.Q = function Q_Node(input, n = UNDEFINED) {
	let first;
	while ((first = this.firstChild) !== NULL) {
		this.removeChild(first);
	}
	return input === NULL ? [] : this.q(input, n);
};
Node.prototype.q = function q_Node(input, n = UNDEFINED) {
	return input instanceof RegExp
		? q_Node_RegExp(this, input, n)
		: q_Node_append(this, input, n);
};
function q_Node_RegExp(self, regexp, n) {
	if (regexp.global) {
		return q_multiply(self.querySelectorAll(regexp.source), n);
	} else {
		const search = self.querySelector(regexp.source);
		return search ? q_multiply(search, n) : NULL;
	}
}
function q_Node_append(self, input, n) {
	const x = q_create(input, n);
	if (x instanceof Node) {
		return self.appendChild(x);
	} else {
		x.flatMap((e) => {
			self.appendChild(e);
		});
		return x;
	}
}

Array.prototype.Q = function Q_Array(input, n = UNDEFINED) {
	return this.flatMap((e) => e.Q(input, n));
};
Array.prototype.q = function q_Array(input, n = UNDEFINED) {
	let result;
	if (input instanceof RegExp) {
		result = input.global
			? q_Array_filter(this, input.source)
			: q_Array_find(this, input.source);
	} else {
		result = this.flatMap((e) => e.q(input, n));
	}
	return q_multiply(result);
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
	return self.flat(Infinity).find((e) => e.matches(query)); // @todo: use faster flatMap
}
