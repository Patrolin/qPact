module.isPrimitive = function(a) {
	return a !== Object(a);
};
module.isNative = function(fun) {
	return /\[native code\]/.test(fun.name);
};
module.isBoolean = function(a) {
	return typeof a == 'boolean';
};
module.isString = function(a) {
	return typeof a == 'string';
};
module.isNumber = function(a) {
	return typeof a == 'number';
};
module.isNaN = function(a) {
	return Object.is(a, NaN);
};
