import type { Pointer, Pointers } from '@/declarations';

import BaseModule from '@/baseModule';
import { getLast } from '@/utils';

export default class Drag extends BaseModule {
	onPointerMove = (e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		const last = getLast(pointer.records, 1);
		if (pointers.size === 1) {
			const dx = e.clientX - last.x;
			const dy = e.clientY - last.y;
			this.dispatch('drag', { deltaX: dx, deltaY: dy, x: e.clientX, y: e.clientY });
		}
	};
}
