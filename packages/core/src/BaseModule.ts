import type {
	BaseOptions,
	Pointer,
	Pointers,
	StdEvents,
	ModuleInput as MI,
	Orchestratable,
	General,
	Coordinates,
	GeneralFunction,
} from '@/types';

export type HookKeys =
	| 'onPointerDown'
	| 'onPointerUp'
	| 'onPointerMove'
	| 'onWheel'
	| 'onStart'
	| 'onStop'
	| 'dispose';

export type BaseArgs = ConstructorParameters<typeof BaseModule>;
export type ModuleCtor = typeof BaseModule<General, General, General>;

export type ModuleInput = MI<ModuleCtor>;
export type ModuleInputCtor = ReadonlyArray<ModuleCtor>;
export type Options<T extends ModuleInput = []> = Orchestratable<T, 'options'> & BaseOptions;
export type Events<T extends ModuleInput = []> = Orchestratable<T, '_Events'> & StdEvents;
export type Augmentation<T extends ModuleInput = []> = Orchestratable<T, '_Augmentation'>;

export default class BaseModule<
	O extends BaseOptions = BaseOptions,
	E extends StdEvents = StdEvents,
	A extends {} = {},
> {
	declare private static readonly _BaseModuleBrand: unique symbol; // Nominal marker
	declare readonly _Events: E;
	declare readonly _Augmentation: A;
	protected dispatch: <K extends keyof E>(
		...arg: undefined extends E[K] ? [K] : [K, E[K]]
	) => void;

	constructor(
		protected augment: (augmentation: A) => void,
		dispatch: GeneralFunction,
		protected getNthPointer: (n: number) => Pointer,
		protected toTargetCoords: (raw: Coordinates) => Coordinates,
		protected window: Window,
		protected pointers: Pointers,
		protected element: HTMLElement,
		public options: O,
	) {
		this.dispatch = dispatch;
	}

	onPointerDown?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onPointerUp?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onPointerMove?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onWheel?: (...args: [event: WheelEvent]) => void;
	onStart?: () => void;
	onStop?: () => void;
	dispose?: () => void;
	modifiers?: {
		[K in keyof E]?: (event: E[K]) => boolean | E[K];
	};
}
