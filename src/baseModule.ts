import type { Pointeract } from '@';
import type { GeneralObject, Pointer, Pointers } from '@/declarations';

export default class BaseModule {
	main: Pointeract;
	constructor(main: Pointeract) {
		this.main = main;
	}

	options?: GeneralObject;

	// methods
	dispose?: (...args: []) => void;
	onPointerDown?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onPointerMove?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onPointerUp?: (...args: [PointerEvent, Pointer, Pointers]) => void;
	onWheel?: (...args: [WheelEvent]) => void;
	onStart?: (...args: []) => void;
	onStop?: (...args: []) => void;
}
