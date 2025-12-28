import BaseModule from '@/baseModule';
import type { Pointer, Pointers } from '@/declarations';

export default class Click extends BaseModule {
	#lastClickTime = -Infinity;
	#clickSteak = 0;

	options = {
		clickPreserveTime: 400,
		moveThreshold: 5,
	};

	onPointerDown = (_e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 2) {
			const pointer0 = this.utils.getNthValue(0);
			/*
            interrupted means that when a pointer is moving on the screen while another pointer is down, possibly for zooming, both pointers will be seen as "interrupted" so that they won't be used for triggering a real click.
            */
			pointer0.interrupted = true;
			pointer.interrupted = true;
		}
	};

	onPointerUp = (e: PointerEvent, pointer: Pointer) => {
		if (pointer.interrupted) return;
		const threshold = this.options.moveThreshold;
		if (
			Math.abs(pointer.records[0].x - e.clientX) >= threshold ||
			Math.abs(pointer.records[0].y - e.clientY) >= threshold
		)
			return;
		const newLast = this.utils.getLast(pointer.records).timestamp;
		if (newLast - this.#lastClickTime <= this.options.clickPreserveTime) this.#clickSteak++;
		else this.#clickSteak = 1;
		this.#lastClickTime = newLast;
		const coords = this.utils.screenToTarget({ x: e.clientX, y: e.clientY });
		this.utils.dispatch('trueClick', {
			...coords,
			target: pointer.target,
			streak: this.#clickSteak,
		});
	};
}
