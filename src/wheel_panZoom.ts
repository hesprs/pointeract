import BaseModule from '@/baseModule';
import type { Coordinates } from '@/declarations';

export default class Wheel_PanZoom extends BaseModule {
	options = {
		proControlSchema: false,
		zoomFactor: 0.1,
		lockControlSchema: false,
	};

	onWheel = (e: WheelEvent) => {
		const options = this.main.options;
		if (
			!options.lockControlSchema &&
			!options.proControlSchema &&
			(e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))
		)
			options.proControlSchema = true;
		if (options.proControlSchema) {
			if (e.ctrlKey) {
				const scaleFactor = e.deltaY > 0 ? 1 - options.zoomFactor : 1 + options.zoomFactor;
				const origin = this.main.screenToPercent({ x: e.clientX, y: e.clientY });
				this.#dispatchZoomEvent(scaleFactor, origin);
			} else if (e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY))
				this.#dispatchPanEvent({ x: -e.deltaY, y: -e.deltaX });
			else this.#dispatchPanEvent({ x: -e.deltaX, y: -e.deltaY });
		} else {
			const scaleFactor = 1 - (options.zoomFactor / 50) * e.deltaY;
			const origin = this.main.screenToPercent({ x: e.clientX, y: e.clientY });
			this.#dispatchZoomEvent(scaleFactor, origin);
		}
	};

	#dispatchZoomEvent(factor: number, origin: Coordinates) {
		this.main.dispatch('zoom', { origin, factor });
	}

	#dispatchPanEvent(diff: Coordinates) {
		this.main.dispatch('pan', diff);
	}
}
