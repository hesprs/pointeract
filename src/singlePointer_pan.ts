import BaseModule from '@/baseModule';
import type { Pointer, Pointers } from '@/declarations';
import { getLast } from '@/utils';

export default class SinglePointer_Pan extends BaseModule {
	onPointerMove = (e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		const last = getLast(pointer.records, 1);
		if (pointers.size === 1) {
			const dx = e.clientX - last.x;
			const dy = e.clientY - last.y;
			this.main.dispatch('pan', { x: dx, y: dy });
		}
	};
}
