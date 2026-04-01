import { GeneralDictionary } from '@/types';

export function getLast<T>(arr: Array<T>, num: number = 0) {
	return arr[arr.length - 1 - num];
}

export function fillIn(patch: GeneralDictionary, target: GeneralDictionary) {
	for (const [k, v] of Object.entries(patch))
		if (!(k in target)) (target as Record<string, unknown>)[k] = v;
}
