import BaseModule from '@/baseModule';
import type { Pointer, Pointers } from '@/declarations';
import { getLast } from './utils';

export default class SinglePointer_TrueClick extends BaseModule {
	#lastClickTime = -Infinity;
	#clickSteak = 0;

	options = {
		clickPreserve: 400,
	};

	onPointerDown = (_e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 2) {
			const pointer0 = this.main.getNthValue(0);
			/*
            interrupted means that when a pointer is moving on the screen while another pointer is down, possibly for zooming, both pointers will be seen as "interrupted" so that they won't be used for triggering a real click.
            */
			pointer0.interrupted = true;
			pointer.interrupted = true;
		}
	};

	onPointerUp = (e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 0 && !pointer.interrupted) {
			if (Math.abs(pointer.records[0].x - e.clientX) + Math.abs(pointer.records[0].y - e.clientY) >= 5)
				return;
			const newLast = getLast(pointer.records).timestamp;
			if (newLast - this.#lastClickTime <= this.main.options.clickPreserve) this.#clickSteak++;
			else this.#clickSteak = 1;
			this.#lastClickTime = newLast;
			const coords = this.main.screenToPercent({ x: e.clientX, y: e.clientY });
			this.main.dispatch('trueClick', { position: coords, target: pointer.target, steak: this.#clickSteak });
		}
	};
}
