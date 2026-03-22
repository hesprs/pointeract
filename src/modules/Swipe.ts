import type { BaseOptions, Pointer, Pointers } from '@/types';
import BaseModule from '@/BaseModule';
import { getLast } from '@/utils';

interface Options extends BaseOptions {
	minDistance?: number;
	minVelocity?: number;
	velocityWindow?: number;
}

export default class Swipe extends BaseModule<Options> {
	onPointerUp = (_e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		if (pointers.size > 1) return;

		const records = pointer.records;
		if (records.length < 2) return;

		const first = records[0];
		const last = getLast(records);

		const dx = last.x - first.x;
		const dy = last.y - first.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const minDistance = this.options.minDistance ?? 10;
		if (distance < minDistance) return;

		const velocityWindow = this.options.velocityWindow ?? 100;
		const recentStart = last.timestamp - velocityWindow;
		const windowRecords = records.filter((r) => r.timestamp >= recentStart);

		let velocity = 0;
		if (windowRecords.length >= 2) {
			const wFirst = windowRecords[0];
			const wLast = getLast(windowRecords);
			const wDx = wLast.x - wFirst.x;
			const wDy = wLast.y - wFirst.y;
			const wDistance = Math.sqrt(wDx * wDx + wDy * wDy);
			const wTime = wLast.timestamp - wFirst.timestamp;
			velocity = wTime > 0 ? wDistance / wTime : 0;
		}

		const minVelocity = this.options.minVelocity ?? 0.1;
		if (velocity < minVelocity) return;

		const direction =
			Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';

		this.dispatch('swipe', { direction, velocity });
	};
}
