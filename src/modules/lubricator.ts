import BaseModule, { BaseArgs } from '@/baseModule';
import { BaseOptions, GeneralObject } from '@/declarations';

interface Options extends BaseOptions {
	lubricator?: Record<string, PerEventOption>;
}

type PerEventOption = {
	decayFactor: number;
	fields: Record<string, { countType: 'sum' | 'product'; diminishBoundary: number }>;
};

type PerEventStates = {
	sample: GeneralObject;
	fields: Record<
		string,
		{
			catch: number;
			release: number;
		}
	>;
};

export default class Lubricator extends BaseModule<Options> {
	#states: Record<string, PerEventStates> = {};
	#animationId: number | null = null;

	constructor(...args: BaseArgs) {
		super(...args);
		const lubricatee = this.options.lubricator;
		if (!lubricatee) return;
		Object.entries(lubricatee).forEach(([key, value]) => {
			// per event scope
			const states = {
				sample: {},
				fields: {},
			} as PerEventStates;
			Object.keys(value.fields).forEach((field) => {
				states.fields[field] = {
					catch: 1,
					release: 1,
				};
			});
			this.#states[key] = states;
			this.modifiers[key] = this.#makeLubricate(states, value);
		});
	}

	onStart = () => {
		this.#animationId = requestAnimationFrame(this.#perFrame);
	};

	onStop = () => {
		if (this.#animationId) cancelAnimationFrame(this.#animationId);
		this.#animationId = null;
		Object.values(this.#states).forEach((value) => {
			// per event scope
			Object.values(value.fields).forEach((value) => {
				// per field scope
				value.release = 1;
				value.catch = 1;
			});
		});
	};

	#makeLubricate =
		(states: PerEventStates, options: PerEventOption) => (detail: GeneralObject) => {
			if (detail.lubricated) return true;
			states.sample = detail;
			this.#accumulate(states.fields, options.fields, detail);
			return false;
		};

	#accumulate = (
		stateFields: PerEventStates['fields'],
		optionsFields: PerEventOption['fields'],
		detail: GeneralObject,
	) => {
		Object.entries(stateFields).forEach(([key, value]) => {
			if (typeof detail[key] !== 'number') return;
			const config = optionsFields[key].countType;
			if (config === 'sum') {
				value.catch += detail[key];
			} else if (config === 'product') value.catch *= detail[key];
		});
	};

	#perFrame = () => {
		const states = this.#states;
		const options = this.options.lubricator;
		if (!options) return;
		Object.entries(states).forEach(([event, perEventStates]) => {
			// per event scope
			const detail = perEventStates.sample;
			detail.lubricated = true;
			let needEmit = false;
			for (const [field, value] of Object.entries(perEventStates.fields)) {
				// per field scope
				if (value.catch === 1) continue;
				const type = options[event].fields[field].countType;

				let absDiff: number, diff: number;
				if (type === 'sum') {
					diff = value.catch - value.release;
					absDiff = Math.abs(diff);
				} else {
					diff = value.catch / value.release;
					absDiff = this.#reciprocalAbs(diff) - 1;
				}

				if (absDiff <= options[event].fields[field].diminishBoundary) {
					if (!needEmit) needEmit = true;
					detail[field] = diff;
					value.release = 1;
					value.catch = 1;
					continue;
				}

				// more to interpolate
				let delta: number;
				if (type === 'sum') {
					delta = diff * options[event].decayFactor;
					value.release += delta;
				} else {
					delta = Math.pow(diff, options[event].decayFactor);
					value.release *= delta;
				}
				detail[field] = delta;
				needEmit = true;
			}
			// oxlint-disable-next-line typescript/no-explicit-any
			if (needEmit) this.dispatch(event as any, detail);
		});
		this.#animationId = requestAnimationFrame(this.#perFrame);
	};

	// in: positive number; out: positive number > 1
	#reciprocalAbs = (num: number) => (num > 1 ? num : 1 / num);

	// oxlint-disable-next-line typescript/no-explicit-any
	modifiers: Record<string, any> = {};
}

export const panPreset = {
	decayFactor: 0.25,
	fields: {
		deltaX: {
			countType: 'sum',
			diminishBoundary: 0.5,
		},
		deltaY: {
			countType: 'sum',
			diminishBoundary: 0.5,
		},
	},
} satisfies PerEventOption;

export const dragPreset = panPreset;

export const zoomPreset = {
	decayFactor: 0.25,
	fields: {
		factor: {
			countType: 'product',
			diminishBoundary: 0.01,
		},
	},
} satisfies PerEventOption;
