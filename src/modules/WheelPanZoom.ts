import type { Coordinates, BaseOptions } from '@/types';
import BaseModule, { BaseArgs } from '@/BaseModule';
import { fillIn } from '@/utils';

/*
# normal schema
diff y > 0 => zooms in => zoom factor < 1
diff y < 0 => zooms out => zoom factor > 1

# professional schema
diff y > 0 => pan up => pan y < 0
diff y < 0 => pan down => pan y > 0
diff x > 0 => pan left => pan x < 0
diff y < 0 => pan right => pan y > 0
*/

interface Options extends BaseOptions {
	proControlSchema?: boolean;
	zoomFactor?: number;
	lockControlSchema?: boolean;
}

export default class wheelPanZoom extends BaseModule<Options> {
	constructor(...args: BaseArgs) {
		super(...args);
		fillIn(
			{ proControlSchema: false, zoomFactor: 0.1, lockControlSchema: false },
			this.options,
		);
	}

	onWheel = (e: WheelEvent) => {
		const options = this.options as Required<Options>;
		if (
			!options.proControlSchema &&
			!options.lockControlSchema &&
			(e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY))
		)
			options.proControlSchema = true;
		if (options.proControlSchema) {
			if (e.ctrlKey) {
				const scaleFactor = 1 - options.zoomFactor * e.deltaY;
				const origin = this.toTargetCoords({ x: e.clientX, y: e.clientY });
				this.#dispatchZoomEvent(scaleFactor, origin);
			} else if (e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY))
				this.#dispatchPanEvent({ deltaX: -e.deltaY, deltaY: -e.deltaX });
			else this.#dispatchPanEvent({ deltaX: -e.deltaX, deltaY: -e.deltaY });
		} else {
			const scaleFactor = 1 - (options.zoomFactor / 20) * e.deltaY;
			const origin = this.toTargetCoords({ x: e.clientX, y: e.clientY });
			this.#dispatchZoomEvent(scaleFactor, origin);
		}
	};

	#dispatchZoomEvent(factor: number, origin: Coordinates) {
		this.dispatch('zoom', { x: origin.x, y: origin.y, factor });
	}

	#dispatchPanEvent(diff: { deltaX: number; deltaY: number }) {
		this.dispatch('pan', diff);
	}
}
