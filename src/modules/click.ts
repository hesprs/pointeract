import type { BaseOptions, Pointer, Pointers } from '@/declarations';

import BaseModule from '@/baseModule';
import { getLast } from '@/utils';

interface Options extends BaseOptions {
	clickPreserveTime?: number;
	moveThreshold?: number;
}

export default class Click extends BaseModule<Options> {
	#lastClickTime = -Infinity;
	#clickSteak = 0;

	onPointerDown = (_e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 2) {
			const pointer0 = this.getNthPointer(0);
			/*
            interrupted means that when a pointer is moving on the screen while another pointer is down, possibly for zooming, both pointers will be seen as "interrupted" so that they won't be used for triggering a real click.
            */
			pointer0.interrupted = true;
			pointer.interrupted = true;
		}
	};

	onPointerUp = (e: PointerEvent, pointer: Pointer) => {
		if (pointer.interrupted) return;
		const threshold = this.options.moveThreshold ?? 5;
		if (
			Math.abs(pointer.records[0].x - e.clientX) >= threshold ||
			Math.abs(pointer.records[0].y - e.clientY) >= threshold
		)
			return;
		const newLast = getLast(pointer.records).timestamp;
		const time = this.options.clickPreserveTime ?? 400;
		if (newLast - this.#lastClickTime <= time) this.#clickSteak++;
		else this.#clickSteak = 1;
		this.#lastClickTime = newLast;
		const coords = this.toTargetCoords({ x: e.clientX, y: e.clientY });
		this.dispatch('trueClick', {
			...coords,
			target: pointer.target,
			streak: this.#clickSteak,
		});
	};
}
