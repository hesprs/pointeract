import type { Pointeract } from '@';
import type BaseModule from '@/baseModule';

// biome-ignore lint/suspicious/noExplicitAny: general type
export type GeneralArguments = Array<any>;
// biome-ignore lint/suspicious/noExplicitAny: General Type
export type GeneralObject = Record<Indexable, any>;
export type Indexable = string | number | symbol;

export type Coordinates = {
	x: number;
	y: number;
};

export type Pointers = Map<number, Pointer>;

export type Pointer = {
	records: Array<{ x: number; y: number; timestamp: number }>;
	target: EventTarget | null;
	// biome-ignore lint/suspicious/noExplicitAny: general type
	[key: Indexable]: any;
};

export type ModuleConstructor = new (main: Pointeract) => BaseModule;
