import type { Pointeract } from '@';
import type { GeneralObject, Pointer, Pointers } from '@/declarations';

export default class BaseModule {
	utils: Pointeract['moduleUtils'];
	mainOptions: Pointeract['mainOptions'];
	constructor(utils: Pointeract['moduleUtils'], mainOptions: Pointeract['mainOptions']) {
		this.utils = utils;
		this.mainOptions = mainOptions;
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
