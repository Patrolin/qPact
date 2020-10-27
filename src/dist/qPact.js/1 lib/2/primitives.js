export var Null = type(
	x => N,
	x => x === N
);
export var Undefined = type(
	x => U,
	x => x === U
);
export var str = type((x = '') => x + '');
export var float = type((x = 0) => Number(x)); // BigInts don't like +x
export var int = type((x = 0) => BigInt(x instanceof str ? x : parseInt(x)));
export var list = type((x, ...args) => (args.length ? Array(x, ...args) : Array(float(x))));
