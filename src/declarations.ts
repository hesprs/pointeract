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

// biome-ignore lint/suspicious/noExplicitAny: general Type
export type Constructor<C extends abstract new (...args: any) => any> = new (
	...args: ConstructorParameters<C>
) => InstanceType<C>;

type ModuleCtor = Constructor<typeof BaseModule>;
export type ModuleInput = Array<ModuleCtor> | ModuleCtor;

type UndefinedToObject<T> = T extends undefined
	? // biome-ignore lint/complexity/noBannedTypes: intentional empty object
		{}
	: GeneralObject extends T
		? // biome-ignore lint/complexity/noBannedTypes: intentional empty object
			{}
		: T;
type WrapInArray<T> = T extends Array<infer U> ? Array<U> : [T];
// biome-ignore lint/suspicious/noExplicitAny: general type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;
type AllModuleInstances<T extends ModuleInput> = InstanceType<WrapInArray<T>[number]>;
export type Options<T extends ModuleInput> = Partial<
	UnionToIntersection<UndefinedToObject<AllModuleInstances<T>['options']>> & BaseOptions
>;

export type EventMap<T extends ModuleInput> = Constrain<UnionToIntersection<AllModuleInstances<T>['events']>>;

export type Hooks =
	| 'onPointerDown'
	| 'onPointerUp'
	| 'onPointerMove'
	| 'onWheel'
	| 'onStart'
	| 'onStop'
	| 'dispose'
	| 'modifier';
export type Reloadable<T extends ModuleInput> = WrapInArray<T>[number];

export type ModifierReturn = true | false | { name: string; detail: unknown };

type KnownKeys<T> = keyof {
	[K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export type Constrain<T> = Pick<T, KnownKeys<T>>;

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