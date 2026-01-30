// oxlint-disable typescript/no-explicit-any
import type BaseModule from '@/baseModule';

// #region General Types
export type GeneralArguments = Array<any>;
export type GeneralObject = Record<Indexable, any>;
export type Indexable = string | number | symbol;
// #endregion ===============================================================================

// #region Conversion Helpers
type KnownKeys<T> = keyof {
	[K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export type Constrain<T> = Pick<T, KnownKeys<T>>;
type WrapInArray<T> = T extends Array<infer U> ? Array<U> : [T];
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;
type Instances<T extends ProcessedModuleInput> =
	T extends Array<ModuleCtor> ? InstanceType<T[number]> : T[number];
type Orchestratable<
	T extends ModuleInput,
	K extends 'options' | '_Events' | '_Augmentation',
> = UnionToIntersection<AllModuleInstances<T>[K]>;
// #endregion ===============================================================================

// #region Derived Types
type ModuleInstance = BaseModule<any, any, any>;
export type ModuleCtor = typeof BaseModule<any, any, any>;
export type ModuleInput = ModuleCtor | ModuleInstance | Array<ModuleInstance> | Array<ModuleCtor>;
export type ModuleInputCtor = ModuleCtor | Array<ModuleCtor>;
type ProcessedModuleInput = Array<ModuleInstance> | Array<ModuleCtor>;

type AllModuleInstances<T extends ModuleInput> = Instances<WrapInArray<T>>;
export type Options<T extends ModuleInput> = Orchestratable<T, 'options'> & BaseOptions;
export type Events<T extends ModuleInput> = Orchestratable<T, '_Events'> & StdEvents;
export type Augmentation<T extends ModuleInput> = Orchestratable<T, '_Augmentation'>;

type ReloadableAtom<T extends ModuleInputCtor> = WrapInArray<T>[number];
export type Reloadable<T extends ModuleInputCtor> = ReloadableAtom<T> | Array<ReloadableAtom<T>>;
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
	[key: Indexable]: any;
};

export interface StdEvents {
	pan: CustomEvent<{ deltaX: number; deltaY: number }>;
	drag: CustomEvent<{ deltaX: number; deltaY: number; x: number; y: number }>;
	trueClick: CustomEvent<Coordinates & { target: EventTarget | null; streak: number }>;
	zoom: CustomEvent<Coordinates & { factor: number }>;
	[key: string]: CustomEvent;
}

export interface BaseOptions {
	coordinateOutput?: 'absolute' | 'relative' | 'relativeFraction';
	element: HTMLElement;
}
// #endregion ===============================================================================
