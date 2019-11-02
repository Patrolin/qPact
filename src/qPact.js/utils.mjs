const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER - 1;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER + 1;

export function describe(input) {
	return `${input != null ? `${input.constructor.name}: ` : ''}${input}`;
}
export function isPrimitive(input) {
	return input !== Object(input);
}
