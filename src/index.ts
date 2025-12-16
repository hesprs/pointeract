import type BaseModule from '@/baseModule';
import type { Constructor, Coordinates, GeneralArguments, GeneralObject, Pointers } from '@/declarations';

type Hooks = 'onPointerDown' | 'onPointerUp' | 'onPointerMove' | 'onWheel' | 'onStart' | 'onStop' | 'dispose';

export { default as BaseModule } from '@/baseModule';
export type { Coordinates, Pointer, Pointers } from '@/declarations';
export { default as MultiPointer_PanZoom } from '@/multiPointer_panZoom';
export { default as SinglePointer_Drag } from '@/singlePointer_drag';
export { default as SinglePointer_TrueClick } from '@/singlePointer_trueClick';
export { default as Wheel_PanZoom } from '@/wheel_panZoom';

export class Pointeract extends EventTarget {
	#monitoringElement: HTMLElement;
	#pointers: Pointers = new Map();
	#modules: Record<string, BaseModule> = {};
	#pausedModules: Record<string, BaseModule> = {};
	#_window: Window | null;
	mainOptions: GeneralObject;

	get #window() {
		if (!this.#_window) throw new Error('[Pointeract] Window is not defined.');
		return this.#_window;
	}

	constructor(
		monitoringElement: HTMLElement,
		modules: Array<Constructor<typeof BaseModule>> = [],
		options: GeneralObject = {},
	) {
		super();
		this.#_window = monitoringElement.ownerDocument.defaultView;
		function fillIn(patch: GeneralObject) {
			for (const [k, v] of Object.entries(patch)) if (!(k in options)) options[k] = v;
		}
		this.#monitoringElement = monitoringElement;
		this.mainOptions = options;
		fillIn({
			preventDefault: false,
			coordinateOutput: 'relative', // absolute / relative / relativeFraction
		});
		modules.forEach(module => {
			const instance = new module(this.moduleUtils, this.mainOptions);
			this.#modules[module.name] = instance;
			if (instance.options) fillIn(instance.options);
		});
	}

	moduleUtils = {
		getNthValue: (n: number) => {
			const error = new Error('[Pointeract] Invalid pointer index');
			if (n < 0 || n >= this.#pointers.size) throw error;
			let i = 0;
			for (const value of this.#pointers.values()) {
				if (i === n) return value;
				i++;
			}
			throw error;
		},

		// Screen to Container
		screenToTarget: (raw: Coordinates) => {
			if (this.mainOptions.coordinateOutput === 'absolute') return raw;
			const rect = this.#monitoringElement.getBoundingClientRect();
			raw.x -= rect.left;
			raw.y -= rect.top;
			if (this.mainOptions.coordinateOutput === 'relative') return raw;
			raw.x /= rect.width;
			raw.y /= rect.height;
			return raw;
		},

		dispatch: <T>(name: string, detail?: T) => {
			const event = new CustomEvent<T>(name, { detail: detail });
			this.dispatchEvent(event);
		},

		getLast: <T>(arr: Array<T>, num: number = 0) => arr[arr.length - 1 - num],
	};

	#runHooks(field: Hooks, ...args: GeneralArguments) {
		Object.values(this.#modules).forEach(module => {
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
		if (this.mainOptions.preventDefault) e.preventDefault();
		this.#runHooks('onWheel', e);
	};

	#preventDefaultFunction = (e: Event) => e.preventDefault();

	stop = (
		toStop: Array<Constructor<typeof BaseModule> | Constructor<typeof Pointeract>> = [Pointeract],
	) => {
		const stopPointeract = () => {
			this.#monitoringElement.removeEventListener('pointerdown', this.#onPointerDown);
			this.#window.removeEventListener('pointermove', this.#onPointerMove);
			this.#window.removeEventListener('pointerup', this.#onPointerUp);
			this.#monitoringElement.removeEventListener('wheel', this.#onWheel);
			if (this.mainOptions.preventDefault) {
				this.#monitoringElement.style.touchAction = '';
				this.#monitoringElement.removeEventListener('gesturestart', this.#preventDefaultFunction);
				this.#monitoringElement.removeEventListener('gesturechange', this.#preventDefaultFunction);
			}
			this.#runHooks('onStop');
		};
		const stopModule = (moduleCtor: Constructor<typeof BaseModule>) => {
			if (!(moduleCtor.name in this.#modules)) return;
			const module = this.#modules[moduleCtor.name];
			if (module.onStop) module.onStop();
			this.#pausedModules[moduleCtor.name] = module;
			delete this.#modules[moduleCtor.name];
		};
		toStop.forEach(module => {
			if (module === Pointeract) stopPointeract();
			else stopModule(module as Constructor<typeof BaseModule>);
		});
	};

	start = (
		toStart: Array<Constructor<typeof BaseModule> | Constructor<typeof Pointeract>> = [Pointeract],
	) => {
		const startPointeract = () => {
			this.#monitoringElement.addEventListener('pointerdown', this.#onPointerDown);
			this.#window.addEventListener('pointermove', this.#onPointerMove);
			this.#window.addEventListener('pointerup', this.#onPointerUp);
			this.#monitoringElement.addEventListener(
				'wheel',
				this.#onWheel,
				this.mainOptions.preventDefault ? { passive: false } : {},
			);
			if (this.mainOptions.preventDefault) {
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
		const startModule = (moduleCtor: Constructor<typeof BaseModule>) => {
			if (!(moduleCtor.name in this.#pausedModules)) return;
			const module = this.#pausedModules[moduleCtor.name];
			if (module.onStart) module.onStart();
			this.#modules[moduleCtor.name] = module;
			delete this.#pausedModules[moduleCtor.name];
		};
		toStart.forEach(module => {
			if (module === Pointeract) startPointeract();
			else startModule(module as Constructor<typeof BaseModule>);
		});
	};

	dispose = () => {
		this.stop();
		this.#_window = null;
		this.#runHooks('dispose');
	};
}
