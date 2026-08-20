import type { Click, Drag, WheelPanZoom, Swipe } from '@';
import { PointeractInterface, Pointeract } from '@';
import type { Coordinates, StdEvents } from '@/types';
import { ModuleInputCtor, Options } from '@/BaseModule';
import nextFrame from './setup';

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
	const square = document.createElement('div');
	square.id = 'test-square';
	document.body.append(square);
	const window = square.ownerDocument.defaultView as Window;
	const pointeract = new Pointeract(
		Object.assign(options ?? {}, { element: square }) as Options<T>,
		modules,
	);
	const acc = new Accumulator(pointeract as PointeractInterface<ModulePreset>);
	const pm = new PointerManager();

	const dispose = () => pointeract.dispose();

	const wheel = (
		diff: Coordinates,
		_keys?: { shift?: boolean; ctrl?: boolean; alt?: boolean },
		coords?: Coordinates,
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
				clientX: coords?.x ?? 0,
				clientY: coords?.y ?? 0,
				ctrlKey: keys.ctrl,
				shiftKey: keys.shift,
			},
		);
		square.dispatchEvent(event);
	};

	class Pointer {
		x = 0;
		y = 0;
		readonly data = {
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
