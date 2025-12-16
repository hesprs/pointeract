import BaseModule from '@/baseModule';
import type { Pointer, Pointers } from '@/declarations';

export default class SinglePointer_Drag extends BaseModule {
	onPointerMove = (e: PointerEvent, pointer: Pointer, pointers: Pointers) => {
		const last = this.utils.getLast(pointer.records, 1);
		if (pointers.size === 1) {
			const dx = e.clientX - last.x;
			const dy = e.clientY - last.y;
			this.utils.dispatch('drag', { x: dx, y: dy });
		}
	};
}
