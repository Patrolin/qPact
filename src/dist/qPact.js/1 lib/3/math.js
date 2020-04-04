export function floordiv(x, y) {
	var div = x / y;
	return div < 0 ? Math.ceil(div) : Math.floor(div);
}
export function divmod(x, y) {
	return [math.floordiv(x, y), x % y];
}
