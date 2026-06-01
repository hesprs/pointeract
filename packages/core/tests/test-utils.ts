import type { Click, Drag, WheelPanZoom, Swipe } from '@';
import { PointeractInterface, Pointeract } from '@';
import { Window as HappyWindow, PointerEvent, HTMLDivElement, WheelEvent } from 'happy-dom';
import { beforeEach, vi } from 'vitest';
import type { Coordinates, StdEvents } from '@/types';
import { ModuleInputCtor, Options } from '@/BaseModule';

beforeEach(() => {
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
		function dummyRect(this: HTMLElement) {
			if (this.id === 'test-square')
				return {
					bottom: 200,
					height: 200,
					left: 0,
					right: 200,
					top: 0,
					width: 200,
					x: 0,
					y: 0,
				} as DOMRect;

			return {
				bottom: 0,
				height: 0,
				left: 0,
				right: 0,
				top: 0,
				width: 0,
				x: 0,
				y: 0,
			} as DOMRect;
		},
	);
});

type ModulePreset = [WheelPanZoom, Drag, Click, Swipe];

class Accumulator {
	pan = {
		x: 0,
		y: 0,
	};
	drag = {
		x: 0,
		y: 0,
	};
	scale = 1;
	clicks = 0;
	swipes: Array<StdEvents['swipe']> = [];
	constructor(pointeract: PointeractInterface<ModulePreset>) {
		pointeract
			.on('pan', this.panner)
			.on('drag', this.dragger)
			.on('zoom', this.zoomer)
			.on('trueClick', this.clicker)
			.on('swipe', this.swiper);
	}
	private readonly panner = (e: StdEvents['pan']) => {
		this.pan.x += e.deltaX;
		this.pan.y += e.deltaY;
	};
	private readonly swiper = (e: StdEvents['swipe']) => {
		this.swipes.push(e);
	};
	private readonly dragger = (e: StdEvents['drag']) => {
		this.drag.x += e.deltaX;
		this.drag.y += e.deltaY;
	};
	private readonly zoomer = (e: StdEvents['zoom']) => (this.scale *= e.factor);
	private readonly clicker = () => this.clicks++;
	clear = () => {
		this.pan = {
			x: 0,
			y: 0,
		};
		this.drag = {
			x: 0,
			y: 0,
		};
		this.scale = 1;
		this.clicks = 0;
		this.swipes = [];
	};
}

class PointerManager {
	private onPressing = 0;
	private idCounter = 0;
	press = () => {
		this.onPressing++;
		this.idCounter++;
		return {
			id: this.idCounter,
			isPrimary: this.onPressing === 1,
		};
	};
	release = () => {
		this.onPressing--;
	};
}

export default function setup<T extends ModuleInputCtor>(
	modules: T,
	options?: Omit<Options<T>, 'element'>,
) {
	const window = new HappyWindow({ url: 'https://localhost:8080' });
	const document = window.document;

	const animationQueue: Array<FrameRequestCallback> = [];
	const nextFrame = () => animationQueue.shift()?.(1);
	vi.spyOn(global, 'requestAnimationFrame').mockImplementation((callback) =>
		animationQueue.push(callback),
	);

	document.body.innerHTML = '<div id="test-square"></div>';
	const square = document.getElementById('test-square') as HTMLDivElement;
	const pointeract = new Pointeract(
		Object.assign(options ?? {}, { element: square }) as Options<T>,
		modules,
	);
	const acc = new Accumulator(pointeract as PointeractInterface<ModulePreset>);
	const pm = new PointerManager();

	const dispose = async () => {
		pointeract.dispose();
		await window.happyDOM.abort();
		window.close();
	};

	const wheel = (
		diff: Coordinates,
		_keys?: { shift?: boolean; ctrl?: boolean; alt?: boolean },
		coords: Coordinates = { x: 0, y: 0 },
	) => {
		const keys = {
			alt: false,
			ctrl: false,
			shift: false,
			..._keys,
		};
		const event = Object.assign(
			new WheelEvent('wheel', {
				deltaX: diff.x,
				deltaY: diff.y,
			}),
			{
				altKey: keys.alt,
				clientX: coords.x,
				clientY: coords.y,
				ctrlKey: keys.ctrl,
				shiftKey: keys.shift,
			},
		);
		square.dispatchEvent(event);
	};

	class Pointer {
		x = 0;
		y = 0;
		private readonly data = {
			id: 0,
			isPrimary: false,
			onPress: false,
		};
		down = (coords?: Coordinates) => {
			if (this.data.onPress) return;
			this.data.onPress = true;
			const info = pm.press();
			Object.assign(this.data, info);
			if (coords) {
				this.x = coords.x;
				this.y = coords.y;
			}
			square.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: this.x,
					clientY: this.y,
					isPrimary: this.data.isPrimary,
					pointerId: this.data.id,
				}),
			);
		};
		move = (diff: Coordinates) => {
			if (!this.data.onPress) return;
			this.x += diff.x;
			this.y += diff.y;
			window.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: this.x,
					clientY: this.y,
					isPrimary: this.data.isPrimary,
					pointerId: this.data.id,
				}),
			);
		};
		up = () => {
			if (!this.data.onPress) return;
			this.data.onPress = false;
			pm.release();
			window.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: this.x,
					clientY: this.y,
					isPrimary: this.data.isPrimary,
					pointerId: this.data.id,
				}),
			);
		};
	}

	pointeract.start();
	return {
		Pointer,
		acc,
		dispose,
		nextFrame,
		pointeract,
		square,
		wheel,
	};
}
