import type BaseModule from '@/baseModule';
import type {
	Coordinates,
	GeneralArguments,
	GeneralObject,
	ModuleConstructor,
	Pointers,
} from '@/declarations';

type Hooks = 'onPointerDown' | 'onPointerUp' | 'onPointerMove' | 'onWheel' | 'onStart' | 'onStop' | 'dispose';

export { default as BaseModule } from '@/baseModule';
export type { Coordinates, Pointer, Pointers } from '@/declarations';
export { default as MultiPointer_PanZoom } from '@/multiPointer_panZoom';
export { default as SinglePointer_Pan } from '@/singlePointer_pan';
export { default as SinglePointer_TrueClick } from '@/singlePointer_trueClick';
export { default as Wheel_PanZoom } from '@/wheel_panZoom';

export class Pointeract extends EventTarget {
	#monitoringElement: HTMLElement;
	#pointers: Pointers = new Map();
	#moduleList: Array<BaseModule> = [];
	options: GeneralObject;

	constructor(
		monitoringElement: HTMLElement,
		modules: Array<ModuleConstructor> = [],
		options: GeneralObject = {},
	) {
		super();
		function fillIn(patch: GeneralObject) {
			for (const [k, v] of Object.entries(patch)) if (!(k in options)) options[k] = v;
		}
		this.#monitoringElement = monitoringElement;
		this.options = options;
		fillIn({
			preventDefault: false,
		});
		modules.forEach(module => {
			const instance = new module(this);
			this.#moduleList.push(instance);
			if (instance.options) fillIn(instance.options);
		});
	}

	getNthValue(n: number) {
		const error = new Error('[Pointeract] Invalid pointer index');
		if (n < 0 || n >= this.#pointers.size) throw error;
		let i = 0;
		for (const value of this.#pointers.values()) {
			if (i === n) return value;
			i++;
		}
		throw error;
	}

	// Screen to Container
	screenToPercent({ x: screenX, y: screenY }: Coordinates) {
		const rect = this.#monitoringElement.getBoundingClientRect();
		return {
			x: (screenX - rect.left) / rect.width,
			y: (screenY - rect.top) / rect.height,
		};
	}

	#runHooks(field: Hooks, ...args: GeneralArguments) {
		this.#moduleList.forEach(module => {
			if (module[field]) module[field](...args);
		});
	}

	#onPointerDown = (e: PointerEvent) => {
		if (this.#pointers.size >= 2) return;
		if (e.isPrimary) this.#pointers.clear();
		const pointer = {
			records: [{ x: e.clientX, y: e.clientY, timestamp: Date.now() }],
			target: e.target,
		};
		this.#pointers.set(e.pointerId, pointer);
		this.#runHooks('onPointerDown', e, pointer, this.#pointers);
	};

	#onPointerMove = (e: PointerEvent) => {
		const pointer = this.#pointers.get(e.pointerId);
		if (!pointer) return;
		pointer.records.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
		this.#runHooks('onPointerMove', e, pointer, this.#pointers);
	};

	#onPointerUp = (e: PointerEvent) => {
		const pointer = this.#pointers.get(e.pointerId);
		if (!pointer) return;
		this.#pointers.delete(e.pointerId);
		this.#runHooks('onPointerUp', e, pointer, this.#pointers);
	};

	#onWheel = (e: WheelEvent) => {
		if (this.options.preventDefault) e.preventDefault();
		this.#runHooks('onWheel', e);
	};

	dispatch<T>(name: string, detail?: T) {
		const event = new CustomEvent<T>(name, { detail: detail });
		this.dispatchEvent(event);
	}

	#preventDefaultFunction = (e: Event) => e.preventDefault();

	stop = () => {
		this.#monitoringElement.removeEventListener('pointerdown', this.#onPointerDown);
		window.removeEventListener('pointermove', this.#onPointerMove);
		window.removeEventListener('pointerup', this.#onPointerUp);
		this.#monitoringElement.removeEventListener('wheel', this.#onWheel);
		if (this.options.preventDefault) {
			this.#monitoringElement.style.touchAction = '';
			this.#monitoringElement.removeEventListener('gesturestart', this.#preventDefaultFunction);
			this.#monitoringElement.removeEventListener('gesturechange', this.#preventDefaultFunction);
		}
		this.#runHooks('onStop');
	};

	start = () => {
		this.#monitoringElement.addEventListener('pointerdown', this.#onPointerDown);
		window.addEventListener('pointermove', this.#onPointerMove);
		window.addEventListener('pointerup', this.#onPointerUp);
		this.#monitoringElement.addEventListener(
			'wheel',
			this.#onWheel,
			this.options.preventDefault ? { passive: false } : {},
		);
		if (this.options.preventDefault) {
			this.#monitoringElement.style.touchAction = 'none';
			this.#monitoringElement.addEventListener('gesturestart', this.#preventDefaultFunction, {
				passive: false,
			});
			this.#monitoringElement.addEventListener('gesturechange', this.#preventDefaultFunction, {
				passive: false,
			});
		}
		this.#runHooks('onStart');
	};

	dispose = () => {
		this.stop();
		this.#runHooks('dispose');
	};
}
