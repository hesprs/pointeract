import { GeneralObject } from '@/declarations';

export function getLast<T>(arr: Array<T>, num: number = 0) {
	return arr[arr.length - 1 - num];
}

export function fillIn(patch: GeneralObject, target: GeneralObject) {
	for (const [k, v] of Object.entries(patch)) if (!(k in target)) target[k] = v;
}

export function toArray<T>(toTrans: T | Array<T>) {
	return Array.isArray(toTrans) ? toTrans : [toTrans];
}
