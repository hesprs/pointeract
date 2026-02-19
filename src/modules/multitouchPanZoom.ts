import type { Coordinates, Pointer, Pointers } from '@/declarations';
import BaseModule from '@/baseModule';
import { getLast } from '@/utils';

export default class MultitouchPanZoom extends BaseModule {
	#pinchZoomState = {
		lastDistance: 0,
		lastMidpoint: { x: 0, y: 0 },
	};

	#getPointerDistance() {
		const pointer0Coords = getLast(this.getNthPointer(0).records);
		const pointer1Coords = getLast(this.getNthPointer(1).records);
		const dx = pointer0Coords.x - pointer1Coords.x;
		const dy = pointer0Coords.y - pointer1Coords.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// output screen coords
	#getPointerMidpoint() {
		const pointer0Coords = getLast(this.getNthPointer(0).records);
		const pointer1Coords = getLast(this.getNthPointer(1).records);
		return {
			x: (pointer0Coords.x + pointer1Coords.x) / 2,
			y: (pointer0Coords.y + pointer1Coords.y) / 2,
		};
	}

	onPointerDown = (_e: PointerEvent, _pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 2) {
			this.#pinchZoomState.lastDistance = this.#getPointerDistance();
			this.#pinchZoomState.lastMidpoint = this.toTargetCoords(this.#getPointerMidpoint());
		}
	};

	onPointerMove = (_e: PointerEvent, _pointer: Pointer, pointers: Pointers) => {
		if (pointers.size === 2) {
			const newDistance = this.#getPointerDistance();
			const newMidpointOnScreen = this.#getPointerMidpoint();
			const zoomFactor = newDistance / this.#pinchZoomState.lastDistance;
			this.#pinchZoomState.lastDistance = newDistance;
			const newMidpoint = this.toTargetCoords(newMidpointOnScreen);
			const dx = newMidpoint.x - this.#pinchZoomState.lastMidpoint.x;
			const dy = newMidpoint.y - this.#pinchZoomState.lastMidpoint.y;
			this.#pinchZoomState.lastMidpoint = newMidpoint;
			this.#dispatchPanEvent({ deltaX: dx, deltaY: dy });
			this.#dispatchZoomEvent(zoomFactor, newMidpoint);
		}
	};

	#dispatchZoomEvent(factor: number, origin: Coordinates) {
		this.dispatch('zoom', { x: origin.x, y: origin.y, factor });
	}

	#dispatchPanEvent(diff: { deltaX: number; deltaY: number }) {
		this.dispatch('pan', diff);
	}
}
