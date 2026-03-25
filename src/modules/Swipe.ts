import type { BaseOptions, Pointer, Pointers } from '@/types';
import BaseModule from '@/BaseModule';
import { getLast } from '@/utils';

interface Options extends BaseOptions {
	minDistance?: number;
	minVelocity?: number;
	velocityWindow?: number;
	pointers?: number;
	groupingWindow?: number;
}

type Direction =
	| 'left'
	| 'right'
	| 'up'
	| 'down'
	| 'up-left'
	| 'up-right'
	| 'down-left'
	| 'down-right';

type ProcessedSwipe = {
	direction: Direction;
	velocity: number;
	duration: number;
	displacement: number;
};

type CompletedSwipe = ProcessedSwipe & { completedAt: number };

// tan(22.5°) — boundary between cardinal and diagonal sectors
const TAN_22_5 = Math.tan(Math.PI / 8);

export default class Swipe extends BaseModule<Options> {
	#buffer: CompletedSwipe[] = [];

	onPointerDown = (_e: PointerEvent, _pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 1) this.#buffer = [];
	};

	#processPointer(
		records: Pointer['records'],
		minDistance: number,
		minVelocity: number,
		velocityWindow: number,
	): ProcessedSwipe | null {
		if (records.length < 2) return null;

		const first = records[0];
		const last = getLast(records);
		const dx = last.x - first.x;
		const dy = last.y - first.y;
		const displacement = Math.sqrt(dx * dx + dy * dy);
		if (displacement < minDistance) return null;

		const absDx = Math.abs(dx);
		const absDy = Math.abs(dy);

		let direction: Direction;
		if (absDy <= absDx * TAN_22_5) {
			direction = dx > 0 ? 'right' : 'left';
		} else if (absDx <= absDy * TAN_22_5) {
			direction = dy > 0 ? 'down' : 'up';
		} else {
			direction =
				dy > 0
					? dx > 0
						? 'down-right'
						: 'down-left'
					: dx > 0
						? 'up-right'
						: 'up-left';
		}

		const duration = last.timestamp - first.timestamp;

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

		return { direction, velocity, duration, displacement };
	}

	onPointerUp = (_e: PointerEvent, pointer: Pointer, _pointers: Pointers) => {
		const minDistance = this.options.minDistance ?? 10;
		const minVelocity = this.options.minVelocity ?? 0.1;
		const velocityWindow = this.options.velocityWindow ?? 100;
		const groupingWindow = this.options.groupingWindow ?? 100;
		const requiredPtrs = this.options.pointers ?? 1;

		const result = this.#processPointer(pointer.records, minDistance, minVelocity, velocityWindow);
		if (!result) return;

		const now = Date.now();

		// Purge stale entries from grouping buffer
		this.#buffer = this.#buffer.filter((s) => now - s.completedAt <= groupingWindow);

		// Find existing same-direction swipes before adding the current one
		const similar = this.#buffer.filter((s) => s.direction === result.direction);

		// Add current swipe to buffer for future grouping
		this.#buffer.push({ ...result, completedAt: now });

		// Emit per-pointer event
		if (requiredPtrs <= 1) {
			this.dispatch('swipe', {
				direction: result.direction,
				velocity: result.velocity,
				pointerNumber: 1,
				duration: result.duration,
				displacement: result.displacement,
			});
		}

		// Emit combined event when similar concurrent swipes exist
		if (similar.length > 0) {
			const allSwipes = [...similar, result];
			const pointerNumber = allSwipes.length;
			if (pointerNumber >= requiredPtrs) {
				const avg = (fn: (s: ProcessedSwipe) => number) =>
					allSwipes.reduce((sum, s) => sum + fn(s), 0) / pointerNumber;

				this.dispatch('swipe', {
					direction: result.direction,
					velocity: avg((s) => s.velocity),
					pointerNumber,
					duration: avg((s) => s.duration),
					displacement: avg((s) => s.displacement),
				});
			}
		}
	};
}
