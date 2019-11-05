export const MIN_INT32 = -Math.pow(2, 31);
export const MAX_INT32 = Math.pow(2, 31) - 1;
export const MAX_UINT32 = Math.pow(2, 32) - 1;
export const MIN_INT64 = -Math.pow(2, 63);
export const MAX_INT64 = -module.MIN_INT64 - 1;
export const MAX_UINT64 = Math.pow(2, 64) - 1;
export const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER - 1;
export const MAX_SAFE_INTEGER = -module.MIN_SAFE_INTEGER;

export function describe(input) {
	return `${input != NULL ? `${input.constructor.name}: ` : ''}${input}`;
}
export function isPrimitive(input) {
	return input !== Object(input);
}
