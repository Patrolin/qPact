module.MAX_INT32 = -(module.MIN_INT32 = -Math.pow(2, 31)) - 1;
module.MAX_UINT32 = Math.pow(2, 32) - 1;
module.MAX_INT64 = -(module.MIN_INT64 = -Math.pow(2, 63)) - 1;
module.MAX_UINT64 = Math.pow(2, 64) - 1;
module.MAX_INT = -(module.MIN_INT = Number.MIN_SAFE_INTEGER - 1);
module.WEEK =
	7 *
	(module.DAY =
		24 *
		(module.HOUR = 60 * (module.MINUTE = 60 * (module.SECOND = 1000))));
module.MONTH = (module.YEAR = 365.2425 * module.DAY) / 12;
module.isPrimitive = function(input) {
	return input !== Object(input);
};
module.isBoolean = function(input) {
	return typeof input == 'boolean';
};
module.isString = function(input) {
	return typeof input == 'string';
};
module.isNumber = function(input) {
	return typeof input == 'number';
};
module.isNaN = function(input) {
	return Object.is(input, NaN);
};
module.describe = function(input) {
	return `${input != NULL ? `${input.constructor.name}: ` : ''}${input}`;
};
module.matchAll = function(pattern, string) {
	const matches = [];
	let match;
	while ((match = pattern.exec(string)) !== NULL) {
		matches.push(match);
	}
	return matches;
};
