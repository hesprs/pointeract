import type { BaseOptions, Pointer, Pointers } from '@/types';
import BaseModule from '@/BaseModule';
import { getLast } from '@/utils';

interface Options extends BaseOptions {
	swipeMinDistance?: number;
	swipeMinVelocity?: number;
	swipeVelocityWindow?: number;
	swipeStreakWindow?: number;
	swipeDirectionMap?: Record<string, number>;
}

type ProcessedSwipe = {
	direction: string;
	velocity: number;
	duration: number;
	angle: number;
	displacement: number;
};

type CompletedSwipe = ProcessedSwipe & { completedAt: number };

const defaultDirectionMap = {
	left: -(Math.PI / 4) * 3, // -135 degrees
	down: -Math.PI / 4, // -45 degrees
	right: Math.PI / 4, // 45 degrees
	up: (Math.PI / 4) * 3, // 135 degrees
};

export default class Swipe extends BaseModule<Options> {
	#buffer: Array<CompletedSwipe> = [];

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

		const angle = Math.atan2(-dy, dx); // specially invert dy to for standard Cartesian displacements

		const directionMap = this.options.swipeDirectionMap ?? defaultDirectionMap;
		let direction = Object.keys(directionMap)[0];
		for (const [key, value] of Object.entries(directionMap)) {
			if (angle <= value) {
				direction = key;
				break;
			}
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

		return { direction, velocity, duration, displacement, angle };
	}

	onPointerUp = (_e: PointerEvent, pointer: Pointer, _pointers: Pointers) => {
		const minDistance = this.options.swipeMinDistance ?? 10;
		const minVelocity = this.options.swipeMinVelocity ?? 0.1;
		const velocityWindow = this.options.swipeVelocityWindow ?? 200;
		const groupingWindow = this.options.swipeStreakWindow ?? 400;

		const result = this.#processPointer(
			pointer.records,
			minDistance,
			minVelocity,
			velocityWindow,
		);
		if (!result) return;
		const now = Date.now();

		this.#buffer = this.#buffer.filter((s) => now - s.completedAt <= groupingWindow);
		const similar = this.#buffer.filter((s) => s.direction === result.direction);
		this.#buffer.push({ ...result, completedAt: now });

		// Emit combined event when similar concurrent swipes exist
		const allSwipes = [...similar, result];
		const streak = allSwipes.length;
		const avg = (fn: (s: ProcessedSwipe) => number) => {
			if (streak === 1) return fn(allSwipes[0]);
			return allSwipes.reduce((sum, s) => sum + fn(s), 0) / streak;
		};

		this.dispatch('swipe', {
			direction: result.direction,
			velocity: avg((s) => s.velocity),
			streak,
			angle: avg((s) => s.angle),
			duration: avg((s) => s.duration),
			displacement: avg((s) => s.displacement),
		});
	};
}

export const diagonalDirectionMap = {
	'down-left': -Math.PI / 2, // -90 degrees
	'down-right': 0, // 0 degrees
	'up-right': Math.PI / 2, // 90 degrees
	'up-left': Math.PI, // 180 degrees
};

export const eightDirectionMap = {
	left: -(Math.PI / 8) * 7, // -157.5 degrees
	'down-left': -(Math.PI / 8) * 5, // -112.5 degrees
	down: -(Math.PI / 8) * 3, // -67.5 degrees
	'down-right': -Math.PI / 8, // -25.5 degrees
	right: Math.PI / 8, // 25.5 degrees
	'up-right': (Math.PI / 8) * 3, // 67.5 degrees
	up: (Math.PI / 8) * 5, // 112.5 degrees
	'up-left': (Math.PI / 8) * 7, // 157.5 degrees
};
