import type {
	Constrain,
	GeneralObject,
	ModifierReturn,
	Pointer,
	Pointers,
	StdEvents,
} from '@/declarations';
import type Pointeract from '@/pointeract';

type IsAny<T> = 0 extends 1 & T ? true : false;

export default class BaseModule<Events extends StdEvents = StdEvents> {
	protected utils: Omit<Pointeract<never>['moduleUtils'], 'dispatch'> & {
		dispatch: <T extends keyof Constrain<Events>>(
			name: T,
			...args: IsAny<Events[T]['detail']> extends false ? [detail: Events[T]['detail']] : []
		) => void;
	};
	protected window: Window;
	protected pointers: Pointers;
	protected monitoringElement: HTMLElement;
	constructor(
		utils: Pointeract<never>['moduleUtils'],
		window: Window,
		pointers: Pointers,
		monitoringElement: HTMLElement,
	) {
		this.utils = utils as typeof this.utils;
		this.window = window;
		this.pointers = pointers;
		this.monitoringElement = monitoringElement;
	}
	declare readonly events: Events;

	options?: GeneralObject;

	// hooks
	dispose?: (...args: []) => void;
	modifier?: (...args: [string, unknown]) => ModifierReturn;
	onPointerDown?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onPointerMove?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onPointerUp?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onWheel?: (...args: [WheelEvent]) => void;
	onStart?: (...args: []) => void;
	onStop?: (...args: []) => void;
}
