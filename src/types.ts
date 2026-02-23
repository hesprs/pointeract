// #region SynthKernel Core Types
// oxlint-disable-next-line typescript/no-explicit-any
export type General = any;
export type GeneralArray = ReadonlyArray<General>;
export type GeneralObject = object;
export type GeneralDictionary = Record<Indexable, General>;
export type GeneralConstructor = new (...args: General[]) => General;
type Indexable = string | number | symbol;

type UnionToIntersection<U> = (U extends General ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

type GeneralModuleInput = ReadonlyArray<GeneralConstructor> | ReadonlyArray<GeneralObject>;

export type ModuleInput<T extends GeneralConstructor> =
	| ReadonlyArray<T>
	| ReadonlyArray<InstanceType<T>>;

type Instances<T extends GeneralModuleInput> =
	T extends ReadonlyArray<GeneralConstructor> ? InstanceType<T[number]> : T[number];

export type Orchestratable<
	T extends GeneralModuleInput,
	K extends keyof Instances<T>,
> = UnionToIntersection<Instances<T>[K]>;
// #endregion ==============================================================================

// #region Informative Types
export type Coordinates = {
	x: number;
	y: number;
};

export type Pointers = Map<number, Pointer>;

export type Pointer = {
	records: Array<{ x: number; y: number; timestamp: number }>;
	target: EventTarget | null;
	[key: Indexable]: General;
};

export interface StdEvents {
	pan: { deltaX: number; deltaY: number };
	drag: { deltaX: number; deltaY: number; x: number; y: number };
	trueClick: Coordinates & { target: EventTarget | null; streak: number };
	zoom: Coordinates & { factor: number };
}

export interface BaseOptions {
	coordinateOutput?: 'absolute' | 'relative' | 'relativeFraction';
	element: HTMLElement;
}
// #endregion ===============================================================================
