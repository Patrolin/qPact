module.describe = function(a) {
	return `${a != NULL ? `${a.constructor.name}: ` : ''}${a}`;
};
module.matchAll = function(string, pattern) {
	let matches = [];
	let match;
	while ((match = pattern.exec(string)) !== NULL) {
		matches.push(match);
	}
	return matches;
};
module.divmod = function(x, y) {
	let div = x / y;
	return [div < 0 ? Math.ceil(div) : Math.floor(div), x % y];
};
