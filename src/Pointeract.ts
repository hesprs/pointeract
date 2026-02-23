import type BaseModule from '@/BaseModule';
import type {
	Augmentation,
	Events,
	Options,
	ModuleCtor,
	ModuleInputCtor,
	ModuleInput,
} from '@/BaseModule';
import type { Coordinates, GeneralObject, Pointers } from '@/types';
import { HookKeys } from '@/BaseModule';

type Reloadable<T extends ModuleInputCtor> = Array<T[number]>;

export class Pointeract<T extends ModuleInputCtor = []> {
	#element: HTMLElement;
	#pointers: Pointers = new Map();
	#modules: Record<string, BaseModule> = {};
	#pausedModules: Record<string, BaseModule> = {};
	#_window: Window | null;
	#subscribers: { [K in keyof Events<T>]?: Set<(event: Events<T>[K]) => void> } = {};
	options: Options<T>;
	declare private _augmentSlot: unknown;

	get #window() {
		if (!this.#_window) throw new Error('[Pointeract] Window is not defined.');
		return this.#_window;
	}

	constructor(options: Options<T>, _modules?: T) {
		const modules = _modules ? _modules : [];
		this.#_window = options.element.ownerDocument.defaultView;
		this.#element = options.element;
		if (!options.coordinateOutput) options.coordinateOutput = 'relative';
		this.options = options;
		modules.forEach((module) => {
			const instance = new module(
				this.#augment,
				this.dispatch,
				this.#getNthPointer,
				this.#toTargetCoords,
				this.#window,
				this.#pointers,
				this.#element,
				this.options,
			);
			Object.assign(instance, { options });
			this.#modules[module.name] = instance;
		});
	}

	on = <K extends keyof Events<T>>(type: K, listener: (event: Events<T>[K]) => void) => {
		if (!this.#subscribers[type]) this.#subscribers[type] = new Set();
		this.#subscribers[type]?.add(listener);
		return this;
	};

	off = <K extends keyof Events<T>>(type: K, listener: (event: Events<T>[K]) => void) => {
		this.#subscribers[type]?.delete(listener);
		return this;
	};

	#getNthPointer = (n: number) => {
		const error = new Error('[Pointeract] Invalid pointer index.');
		if (n < 0 || n >= this.#pointers.size) throw error;
		let i = 0;
		for (const value of this.#pointers.values()) {
			if (i === n) return value;
			i++;
		}
		throw error;
	};

	// Screen to Container
	#toTargetCoords = (raw: Coordinates) => {
		if (this.options.coordinateOutput === 'absolute') return raw;
		const rect = this.#element.getBoundingClientRect();
		raw.x -= rect.left;
		raw.y -= rect.top;
		if (this.options.coordinateOutput === 'relative') return raw;
		raw.x /= rect.width;
		raw.y /= rect.height;
		return raw;
	};

	dispatch = <N extends keyof Events<T>>(
		...args: undefined extends Events<T>[N] ? [N] : [N, Events<T>[N]]
	) => {
		const name = args[0];
		const e = args[1];
		let lastResult: boolean | Events<T>[N] = true;
		for (const value of Object.values(this.#modules)) {
			if (!value.modifiers || !(name in value.modifiers)) continue;
			lastResult =
				e === undefined
					? (value.modifiers[name] as () => boolean)()
					: (value.modifiers[name] as (detail?: Events<T>[N]) => boolean | Events<T>[N])(
							e,
						);
			if (lastResult === false) return;
		}
		let event: Events<T>[N];
		if (lastResult === true) event = e as Events<T>[N];
		else event = lastResult;
		this.#subscribers[name]?.forEach((listener) => listener(event));
	};

	#augment = (aug: GeneralObject) => {
		const descriptors = Object.getOwnPropertyDescriptors(aug);
		Object.defineProperties(this, descriptors);
	};

	#runHooks = <K extends HookKeys>(field: K, ...args: Parameters<Required<BaseModule>[K]>) => {
		Object.values(this.#modules).forEach((module) => {
			const hook = module[field];
			// oxlint-disable-next-line typescript/no-explicit-any
			if (hook) hook(...(args as any));
		});
	};

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

	stop = (toStop?: Reloadable<T>) => {
		const stopPointeract = () => {
			this.#element.removeEventListener('pointerdown', this.#onPointerDown);
			this.#window.removeEventListener('pointermove', this.#onPointerMove);
			this.#window.removeEventListener('pointerup', this.#onPointerUp);
			this.#element.removeEventListener('wheel', this.#onWheel);
			this.#runHooks('onStop');
		};
		const stopModule = (moduleCtor: ModuleCtor) => {
			if (!(moduleCtor.name in this.#modules)) return;
			const module = this.#modules[moduleCtor.name];
			if (module.onStop) module.onStop();
			this.#pausedModules[moduleCtor.name] = module;
			delete this.#modules[moduleCtor.name];
		};
		if (!toStop) stopPointeract();
		else
			toStop.forEach((module) => {
				stopModule(module);
			});
		return this;
	};

	start = (toStart?: Reloadable<T>) => {
		const startPointeract = () => {
			this.#element.addEventListener('pointerdown', this.#onPointerDown);
			this.#window.addEventListener('pointermove', this.#onPointerMove);
			this.#window.addEventListener('pointerup', this.#onPointerUp);
			this.#element.addEventListener('wheel', this.#onWheel, { passive: false });
			this.#runHooks('onStart');
		};
		const startModule = (moduleCtor: ModuleCtor) => {
			if (!(moduleCtor.name in this.#pausedModules)) return;
			const module = this.#pausedModules[moduleCtor.name];
			if (module.onStart) module.onStart();
			this.#modules[moduleCtor.name] = module;
			delete this.#pausedModules[moduleCtor.name];
		};
		if (!toStart) startPointeract();
		else
			toStart.forEach((module) => {
				startModule(module);
			});
		return this;
	};

	dispose = () => {
		this.stop();
		this.#_window = null;
		this.#runHooks('dispose');
		this.#subscribers = {};
	};
}

type PointeractType = new <M extends ModuleInputCtor = []>(
	...args: ConstructorParameters<typeof Pointeract<M>>
) => Pointeract<M> & Augmentation<M>;

export type PointeractInterface<M extends ModuleInput = []> = Pointeract<never> & Augmentation<M>;

export default Pointeract as PointeractType;
