import type { ModuleInput as MI, Orchestratable } from 'synthkernel';
import type {
	Pointer,
	Pointers,
	StdEvents,
	Coordinates,
	GeneralFunction,
	BaseOptions,
} from '@/types';

export type HookKeys =
	| 'onPointerDown'
	| 'onPointerUp'
	| 'onPointerMove'
	| 'onWheel'
	| 'onStart'
	| 'onStop'
	| 'dispose';

export type BaseArgs = ConstructorParameters<ModuleCtor>;
export type ModuleCtor = typeof BaseModule;

export type ModuleInput = MI<ModuleCtor>;
export type ModuleInputCtor = ReadonlyArray<ModuleCtor>;
export type Options<T extends ModuleInput = []> = Orchestratable<T, 'options'> & BaseOptions;
export type Events<T extends ModuleInput = []> = Orchestratable<T, 'events'> & StdEvents;
export type Augmentation<T extends ModuleInput = []> = Orchestratable<T, 'augmentation'>;

type PointerEventArgs = [event: PointerEvent, pointer: Pointer, pointers: Pointers];
type AllEvents<ThisEvents extends object> = ThisEvents & StdEvents;

export default class BaseModule {
	protected dispatch: <K extends keyof AllEvents<typeof this.events>>(
		...arg: undefined extends AllEvents<typeof this.events>[K]
			? [K]
			: [K, AllEvents<typeof this.events>[K]]
	) => void;

	// oxlint-disable-next-line max-params
	constructor(
		dispatch: GeneralFunction,
		protected getNthPointer: (n: number) => Pointer,
		protected toTargetCoords: (raw: Coordinates) => Coordinates,
		protected window: Window,
		protected pointers: Pointers,
		protected element: HTMLElement,
		public options: object,
	) {
		this.dispatch = dispatch;
	}

	onPointerDown(..._args: PointerEventArgs): void {}
	onPointerUp(..._args: PointerEventArgs): void {}
	onPointerMove(..._args: PointerEventArgs): void {}
	onWheel(..._args: [event: WheelEvent]): void {}
	onStart(): void {}
	onStop(): void {}
	dispose(): void {}
	modifiers: {
		[K in keyof AllEvents<typeof this.events>]?: (
			event: AllEvents<typeof this.events>[K],
		) => boolean | AllEvents<typeof this.events>[K];
	} = {};
	readonly augmentation: object = {};
	declare readonly events: object;
}
