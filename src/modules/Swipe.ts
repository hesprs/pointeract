import type { BaseOptions, Pointer, Pointers } from '@/types';
import BaseModule from '@/BaseModule';
import { getLast } from '@/utils';

/* TODO
Seems that swipe detection processes swipe at per-pointer level. Consider adding multiple-pointer-single-swipe detection (my sketchy mental model, reference only):

- add a new field pointerNumber in swipe event to record number of pointers involved in one swipe.
- keep each pointer in the swipe pointer array for a short time even after pointerUp.
- emit events with pointerNumber: 1 for all pointer swipes.
- during pointerUp check swipe pointer array to find similar pointer swipes, if found, emit another event with pointerNumber: <more than 1>.
- that is to say, a swipe caused by a pointer can emit multiple swipe events if similar patterns are found.

- Expose more information in swipe event, like duration, displacement and extend the direction to eight directions if possible.
*/

interface Options extends BaseOptions {
	minDistance?: number;
	minVelocity?: number;
	velocityWindow?: number;
	pointers?: number;
}

type Direction = 'left' | 'right' | 'up' | 'down';

export default class Swipe extends BaseModule<Options> {
	#gesturePointers: Array<Pointer['records']> = [];

	onPointerDown = (_e: PointerEvent, _pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 1) this.#gesturePointers = [];
	};

	#processPointer(
		records: Pointer['records'],
		minDistance: number,
		minVelocity: number,
		velocityWindow: number,
	): { direction: Direction; velocity: number } | null {
		if (records.length < 2) return null;

		const first = records[0];
		const last = getLast(records);
		const dx = last.x - first.x;
		const dy = last.y - first.y;
		if (Math.sqrt(dx * dx + dy * dy) < minDistance) return null;

		const direction: Direction =
			Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';

		const windowRecords = records.filter((r) => r.timestamp >= last.timestamp - velocityWindow);
		let velocity = 0;
		if (windowRecords.length >= 2) {
			const wFirst = windowRecords[0];
			const wLast = getLast(windowRecords);
			const wDx = wLast.x - wFirst.x;
			const wDy = wLast.y - wFirst.y;
			const wTime = wLast.timestamp - wFirst.timestamp;
			velocity = wTime > 0 ? Math.sqrt(wDx * wDx + wDy * wDy) / wTime : 0;
		}
		if (velocity < minVelocity) return null;

		return { direction, velocity };
	}

	onPointerUp = (_e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		this.#gesturePointers.push(pointer.records);

		if (pointers.size > 0) return;
		if (this.#gesturePointers.length < (this.options.pointers ?? 1)) return;

		const minDistance = this.options.minDistance ?? 10;
		const minVelocity = this.options.minVelocity ?? 0.1;
		const velocityWindow = this.options.velocityWindow ?? 100;

		let direction: Direction | null = null;
		let totalVelocity = 0;

		for (const records of this.#gesturePointers) {
			const result = this.#processPointer(records, minDistance, minVelocity, velocityWindow);
			if (!result) return;
			if (direction === null) direction = result.direction;
			else if (direction !== result.direction) return;
			totalVelocity += result.velocity;
		}

		if (!direction) return;

		this.dispatch('swipe', {
			direction,
			velocity: totalVelocity / this.#gesturePointers.length,
		});
	};
}
