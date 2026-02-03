import type {
	BaseOptions,
	GeneralObject,
	Pointer,
	Pointers,
	StdEvents,
	Constrain,
} from '@/declarations';
import type { Pointeract, PointeractInterface } from '@/pointeract';

export type HookKeys =
	| 'onPointerDown'
	| 'onPointerUp'
	| 'onPointerMove'
	| 'onWheel'
	| 'onStart'
	| 'onStop'
	| 'dispose';

export type BaseArgs = [
	Pointeract<[]>['moduleUtils'],
	Window,
	Pointers,
	HTMLElement,
	GeneralObject,
];

export default class BaseModule<
	O extends BaseOptions = BaseOptions,
	E extends StdEvents = StdEvents,
	A extends {} = {},
> {
	declare private static readonly _BaseModuleBrand: unique symbol; // Nominal marker
	declare readonly _Events: E;
	declare readonly _Augmentation: A;
	protected getNthPointer: Pointeract<[]>['moduleUtils']['getNthPointer'];
	protected toTargetCoords: Pointeract<[]>['moduleUtils']['toTargetCoords'];
	protected augment: (augmentation: A) => void;
	protected dispatch: <K extends keyof Constrain<E>>(
		...arg: undefined extends E[K] ? [K] : [K, E[K]]
	) => void;
	options: O;
	constructor(
		utils: PointeractInterface['moduleUtils'],
		protected window: Window,
		protected pointers: Pointers,
		protected element: HTMLElement,
		options: GeneralObject,
	) {
		this.getNthPointer = utils.getNthPointer;
		this.toTargetCoords = utils.toTargetCoords;
		this.augment = utils.augment;
		this.dispatch = utils.dispatch as typeof this.dispatch;
		this.options = options;
	}

	onPointerDown?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onPointerUp?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onPointerMove?: (...args: [event: PointerEvent, pointer: Pointer, pointers: Pointers]) => void;
	onWheel?: (...args: [event: WheelEvent]) => void;
	onStart?: () => void;
	onStop?: () => void;
	dispose?: () => void;
	modifiers?: {
		[K in keyof Constrain<E>]?: (event: E[K]) => boolean | E[K];
	};
}
