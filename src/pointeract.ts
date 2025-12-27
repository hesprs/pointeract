import type BaseModule from '@/baseModule';
import type {
	Constructor,
	Coordinates,
	EventMap,
	GeneralArguments,
	GeneralObject,
	Hooks,
	ModifierReturn,
	ModuleInput,
	Options,
	Pointers,
	Reloadable,
} from '@/declarations';

export default class Pointeract<T extends ModuleInput> extends EventTarget {
	#monitoringElement: HTMLElement;
	#pointers: Pointers = new Map();
	#modules: Record<string, BaseModule> = {};
	#pausedModules: Record<string, BaseModule> = {};
	#_window: Window | null;
	options: GeneralObject;

	get #window() {
		if (!this.#_window) throw new Error('[Pointeract] Window is not defined.');
		return this.#_window;
	}

	constructor(monitoringElement: HTMLElement, _modules: T, options: Options<T> = {}) {
		super();
		const modules = toArray(_modules);
		this.#_window = monitoringElement.ownerDocument.defaultView;
		this.#monitoringElement = monitoringElement;
		this.options = options;
		this.#fillIn({ coordinateOutput: 'relative' });
		modules.forEach(module => {
			const instance = new module(
				this.moduleUtils,
				this.#window,
				this.#pointers,
				this.#monitoringElement,
			);
			if (instance.options) this.#fillIn(instance.options);
			Object.assign(instance, { options });
			this.#modules[module.name] = instance;
		});
	}

	#fillIn = (patch: GeneralObject) => {
		for (const [k, v] of Object.entries(patch))
			if (!(k in this.options)) (this.options as GeneralObject)[k] = v;
	};

	on = <K extends keyof EventMap<T>>(type: K, listener: (event: EventMap<T>[K]) => void) => {
		super.addEventListener(type as string, listener as EventListener);
		return () => this.off(type, listener);
	};
	off<K extends keyof EventMap<T>>(type: K, listener: (event: EventMap<T>[K]) => void) {
		super.removeEventListener(type as string, listener as EventListener);
	}

	declare readonly events: EventMap<T>;

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
			if (this.options.coordinateOutput === 'absolute') return raw;
			const rect = this.#monitoringElement.getBoundingClientRect();
			raw.x -= rect.left;
			raw.y -= rect.top;
			if (this.options.coordinateOutput === 'relative') return raw;
			raw.x /= rect.width;
			raw.y /= rect.height;
			return raw;
		},

		dispatch: <T>(name: string, detail?: T) => {
			let lastResult: ModifierReturn = true;
			for (const value of Object.values(this.#modules)) {
				if (!value.modifier) continue;
				lastResult = value.modifier(name, detail);
				if (lastResult !== true) break;
			}
			if (lastResult === false) return;
			let event: CustomEvent;
			if (lastResult === true) event = new CustomEvent<T>(name, { detail });
			else event = new CustomEvent(lastResult.name, { detail: lastResult.detail });
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

	#onWheel = (e: WheelEvent) => this.#runHooks('onWheel', e);

	stop = (_toStop?: Reloadable<T>) => {
		const stopPointeract = () => {
			this.#monitoringElement.removeEventListener('pointerdown', this.#onPointerDown);
			this.#window.removeEventListener('pointermove', this.#onPointerMove);
			this.#window.removeEventListener('pointerup', this.#onPointerUp);
			this.#monitoringElement.removeEventListener('wheel', this.#onWheel);
			this.#runHooks('onStop');
		};
		const stopModule = (moduleCtor: Constructor<typeof BaseModule>) => {
			if (!(moduleCtor.name in this.#modules)) return;
			const module = this.#modules[moduleCtor.name];
			if (module.onStop) module.onStop();
			this.#pausedModules[moduleCtor.name] = module;
			delete this.#modules[moduleCtor.name];
		};
		if (!_toStop) stopPointeract();
		else
			toArray(_toStop).forEach(module => {
				stopModule(module);
			});
		return this;
	};

	start = (_toStart?: Reloadable<T>) => {
		const startPointeract = () => {
			this.#monitoringElement.addEventListener('pointerdown', this.#onPointerDown);
			this.#window.addEventListener('pointermove', this.#onPointerMove);
			this.#window.addEventListener('pointerup', this.#onPointerUp);
			this.#monitoringElement.addEventListener('wheel', this.#onWheel);
			this.#runHooks('onStart');
		};
		const startModule = (moduleCtor: Constructor<typeof BaseModule>) => {
			if (!(moduleCtor.name in this.#pausedModules)) return;
			const module = this.#pausedModules[moduleCtor.name];
			if (module.onStart) module.onStart();
			this.#modules[moduleCtor.name] = module;
			delete this.#pausedModules[moduleCtor.name];
		};
		if (!_toStart) startPointeract();
		else
			toArray(_toStart).forEach(module => {
				startModule(module);
			});
		return this;
	};

	dispose = () => {
		this.stop();
		this.#_window = null;
		this.#runHooks('dispose');
	};
}

const toArray = <T>(toTrans: T | Array<T>) => (Array.isArray(toTrans) ? toTrans : [toTrans]);
