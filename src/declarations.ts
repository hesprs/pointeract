import type BaseModule from '@/baseModule';

// #region General Types
// biome-ignore lint/suspicious/noExplicitAny: General Type
export type GeneralArguments = Array<any>;
// biome-ignore lint/suspicious/noExplicitAny: General Type
export type GeneralObject = Record<Indexable, any>;
export type Indexable = string | number | symbol;
// biome-ignore lint/complexity/noBannedTypes: General Type
type Empty = {};
// #endregion ===============================================================================

// #region Conversion Helpers
type KnownKeys<T> = keyof {
	[K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export type Constrain<T> = Pick<T, KnownKeys<T>>;
type UndefinedToObject<T> = T extends undefined ? Empty : GeneralObject extends T ? Empty : T;
type WrapInArray<T> = T extends Array<infer U> ? Array<U> : [T];
// biome-ignore lint/suspicious/noExplicitAny: General Type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;
export type Ctors<T extends Array<BaseModule> | BaseModule> =
	T extends Array<BaseModule>
		? { [K in keyof T]: new (...args: GeneralArguments) => T[K] }
		: [new (...args: GeneralArguments) => T];
// #endregion ===============================================================================

// #region Derived Types
export type ModuleCtor = typeof BaseModule<StdEvents>;
export type ModuleInput = ModuleCtor | Array<ModuleCtor>;

type AllModuleInstances<T extends ModuleInput> = InstanceType<WrapInArray<T>[number]>;
export type Options<T extends ModuleInput> = Partial<
	UnionToIntersection<UndefinedToObject<AllModuleInstances<T>['options']>> & BaseOptions
>;

export type EventMap<T extends ModuleInput> = Constrain<
	UnionToIntersection<AllModuleInstances<T>['events']>
>;

export type Reloadable<T extends ModuleInput> = WrapInArray<T>[number];

export type ModifierReturn = true | false | { name: string; detail: unknown };
// #endregion ===============================================================================

// #region Informative Types
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

export type Hooks =
	| 'onPointerDown'
	| 'onPointerUp'
	| 'onPointerMove'
	| 'onWheel'
	| 'onStart'
	| 'onStop'
	| 'dispose'
	| 'modifier';

export interface StdEvents {
	pan: CustomEvent<Coordinates>;
	drag: CustomEvent<Coordinates & { clientX: number; clientY: number }>;
	trueClick: CustomEvent<Coordinates & { target: EventTarget | null; streak: number }>;
	zoom: CustomEvent<Coordinates & { factor: number }>;
	[key: string]: CustomEvent;
}

type BaseOptions = {
	coordinateOutput: 'absolute' | 'relative' | 'relativeFraction';
};
// #endregion ===============================================================================
