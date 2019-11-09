module.MAX_INT32 = -(module.MIN_INT32 = -Math.pow(2, 31)) - 1;
module.MAX_UINT32 = Math.pow(2, 32) - 1;
module.MAX_INT64 = -(module.MIN_INT64 = -Math.pow(2, 63)) - 1;
module.MAX_UINT64 = Math.pow(2, 64) - 1;
module.MAX_SAFE_INTEGER = -(module.MIN_SAFE_INTEGER =
	Number.MIN_SAFE_INTEGER - 1);

module.describe = function(input) {
	return `${input != NULL ? `${input.constructor.name}: ` : ''}${input}`;
};
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
