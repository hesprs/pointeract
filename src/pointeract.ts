import type BaseModule from '@/baseModule';
import type {
	Augmentation,
	Coordinates,
	Events,
	GeneralObject,
	ModuleCtor,
	ModuleInput,
	ModuleInputCtor,
	Options,
	Pointers,
	Reloadable,
	Constrain,
} from '@/declarations';

import { HookKeys } from '@/baseModule';
import { toArray } from '@/utils';

export class Pointeract<T extends ModuleInputCtor = []> extends EventTarget {
	#element: HTMLElement;
	#pointers: Pointers = new Map();
	#modules: Record<string, BaseModule> = {};
	#pausedModules: Record<string, BaseModule> = {};
	#_window: Window | null;
	options: Options<T>;
	// oxlint-disable-next-line typescript/no-explicit-any
	declare private _augmentSlot: any;

	get #window() {
		if (!this.#_window) throw new Error('[Pointeract] Window is not defined.');
		return this.#_window;
	}

	constructor(options: Options<T>, _modules?: T) {
		super();
		const modules = toArray(_modules ? _modules : ([] as Array<ModuleCtor>));
		this.#_window = options.element.ownerDocument.defaultView;
		this.#element = options.element;
		if (!options.coordinateOutput) options.coordinateOutput = 'relative';
		this.options = options;
		modules.forEach((module) => {
			const instance = new module(
				this.moduleUtils,
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
		super.addEventListener(type as string, listener as EventListener);
		return () => this.off(type, listener);
	};
	off<K extends keyof Events<T>>(type: K, listener: (event: Events<T>[K]) => void) {
		super.removeEventListener(type as string, listener as EventListener);
	}

	private moduleUtils = {
		getNthPointer: (n: number) => {
			const error = new Error('[Pointeract] Invalid pointer index.');
			if (n < 0 || n >= this.#pointers.size) throw error;
			let i = 0;
			for (const value of this.#pointers.values()) {
				if (i === n) return value;
				i++;
			}
			throw error;
		},

		// Screen to Container
		toTargetCoords: (raw: Coordinates) => {
			if (this.options.coordinateOutput === 'absolute') return raw;
			const rect = this.#element.getBoundingClientRect();
			raw.x -= rect.left;
			raw.y -= rect.top;
			if (this.options.coordinateOutput === 'relative') return raw;
			raw.x /= rect.width;
			raw.y /= rect.height;
			return raw;
		},

		dispatch: <N extends keyof Constrain<Events<T>>>(
			name: N,
			detail?: Events<T>[N]['detail'],
		) => {
			let lastResult: boolean | Events<T>[N]['detail'] = true;
			for (const value of Object.values(this.#modules)) {
				if (!value.modifiers || !(name in value.modifiers)) continue;
				lastResult = !detail
					? (
							value.modifiers[
								name as keyof typeof value.modifiers
							] as unknown as () => boolean
						)()
					: (
							value.modifiers[name as keyof typeof value.modifiers] as unknown as (
								detail?: Events<T>[N]['detail'],
							) => boolean | Events<T>[N]['detail']
						)(detail);
				if (lastResult === false) return;
			}
			let event: CustomEvent;
			if (lastResult === true)
				event = detail
					? new CustomEvent<N>(name as string, { detail })
					: new CustomEvent(name as string);
			else event = new CustomEvent<N>(name as string, { detail: lastResult });
			this.dispatchEvent(event);
		},

		augment: (aug: GeneralObject) => {
			Object.entries(aug).forEach(([key, value]) => {
				this[key as '_augmentSlot'] = value;
			});
		},
	};

	dispatch = this.moduleUtils.dispatch;

	#runHooks<K extends HookKeys>(field: K, ...args: Parameters<Required<BaseModule>[K]>) {
		Object.values(this.#modules).forEach((module) => {
			const hook = module[field];
			// oxlint-disable-next-line typescript/no-explicit-any
			if (hook) hook(...(args as any));
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
		if (!_toStop) stopPointeract();
		else
			toArray(_toStop).forEach((module) => {
				stopModule(module);
			});
		return this;
	};

	start = (_toStart?: Reloadable<T>) => {
		const startPointeract = () => {
			this.#element.addEventListener('pointerdown', this.#onPointerDown);
			this.#window.addEventListener('pointermove', this.#onPointerMove);
			this.#window.addEventListener('pointerup', this.#onPointerUp);
			this.#element.addEventListener('wheel', this.#onWheel);
			this.#runHooks('onStart');
		};
		const startModule = (moduleCtor: ModuleCtor) => {
			if (!(moduleCtor.name in this.#pausedModules)) return;
			const module = this.#pausedModules[moduleCtor.name];
			if (module.onStart) module.onStart();
			this.#modules[moduleCtor.name] = module;
			delete this.#pausedModules[moduleCtor.name];
		};
		if (!_toStart) startPointeract();
		else
			toArray(_toStart).forEach((module) => {
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

type PointeractType = new <M extends ModuleInputCtor = []>(
	...args: ConstructorParameters<typeof Pointeract<M>>
) => Pointeract<M> & Augmentation<M>;

export type PointeractInterface<M extends ModuleInput = []> = Pointeract<[]> & Augmentation<M>;

export default Pointeract as PointeractType;
