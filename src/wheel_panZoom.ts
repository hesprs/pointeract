import BaseModule from '@/baseModule';
import type { Coordinates } from '@/declarations';

/*
to normal computer users:

# normal schema
diff y > 0 => zooms in => zoom factor < 1
diff y < 0 => zooms out => zoom factor > 1

# professional schema
diff y > 0 => pan up => pan y < 0
diff y < 0 => pan down => pan y > 0
diff x > 0 => pan left => pan x < 0
diff y < 0 => pan right => pan y > 0
*/

export default class Wheel_PanZoom extends BaseModule {
	options = {
		proControlSchema: false,
		zoomFactor: 0.1,
		lockControlSchema: false,
	};

	onWheel = (e: WheelEvent) => {
		const options = this.mainOptions;
		if (
			!options.proControlSchema &&
			!options.lockControlSchema &&
			(e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))
		)
			options.proControlSchema = true;
		if (options.proControlSchema) {
			if (e.ctrlKey) {
				const scaleFactor = e.deltaY > 0 ? 1 - options.zoomFactor : 1 + options.zoomFactor;
				const origin = this.utils.screenToTarget({ x: e.clientX, y: e.clientY });
				this.#dispatchZoomEvent(scaleFactor, origin);
			} else if (e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY))
				this.#dispatchPanEvent({ x: -e.deltaY, y: -e.deltaX });
			else this.#dispatchPanEvent({ x: -e.deltaX, y: -e.deltaY });
		} else {
			const scaleFactor = 1 - (options.zoomFactor / 50) * e.deltaY;
			const origin = this.utils.screenToTarget({ x: e.clientX, y: e.clientY });
			this.#dispatchZoomEvent(scaleFactor, origin);
		}
	};

	#dispatchZoomEvent(factor: number, origin: Coordinates) {
		this.utils.dispatch('zoom', { origin, factor });
	}

	#dispatchPanEvent(diff: Coordinates) {
		this.utils.dispatch('pan', diff);
	}
}
