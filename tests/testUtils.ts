import { type Click, type Ctors, type Drag, Pointeract, type WheelPanZoom } from '@';
import { Window as HappyWindow } from 'happy-dom';

import type { Coordinates, ModuleInput, Options, StdEvents } from '@/declarations';

type ModulePreset = Ctors<[WheelPanZoom, Drag, Click]>;

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
	private pointeract: Pointeract<ModulePreset>;
	constructor(pointeract: Pointeract<ModulePreset>) {
		this.pointeract = pointeract;
		pointeract.on('pan', this.panner);
		pointeract.on('drag', this.dragger);
		pointeract.on('zoom', this.zoomer);
		pointeract.on('trueClick', this.clicker);
	}
	private panner = (e: StdEvents['pan']) => {
		const detail = e.detail;
		this.pan.x += detail.x;
		this.pan.y += detail.y;
	};
	private dragger = (e: StdEvents['drag']) => {
		const detail = e.detail;
		this.drag.x += detail.x;
		this.drag.y += detail.y;
	};
	private zoomer = (e: StdEvents['zoom']) => {
		const detail = e.detail;
		this.scale *= detail.factor;
	};
	private clicker = () => {
		this.clicks++;
	};
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
	};
	dispose = () => {
		this.pointeract.off('pan', this.panner);
		this.pointeract.off('drag', this.dragger);
		this.pointeract.off('zoom', this.zoomer);
		this.pointeract.off('trueClick', this.clicker);
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

export default function setup<T extends ModuleInput>(modules: T, options: Options<T> = {}) {
	const window = new HappyWindow({ url: 'https://localhost:8080' }) as unknown as Window;
	const document = window.document;
	document.body.innerHTML = '<div id="test-square"></div>';
	const square = document.getElementById('test-square') as unknown as HTMLDivElement;
	const pointeract = new Pointeract(square, modules, options);
	const acc = new Accumulator(pointeract);
	const pm = new PointerManager();

	const dispose = async () => {
		pointeract.dispose();
		acc.dispose();
		await (window as unknown as HappyWindow).happyDOM.abort();
		window.close();
	};

	const wheel = (
		diff: Coordinates,
		_keys?: { shift?: boolean; ctrl?: boolean; alt?: boolean },
		coords: Coordinates = { x: 0, y: 0 },
	) => {
		const keys = Object.assign(
			{
				shift: false,
				ctrl: false,
				alt: false,
			},
			_keys,
		);
		const event = Object.assign(
			new WheelEvent('wheel', {
				clientX: coords.x,
				clientY: coords.y,
				deltaX: diff.x,
				deltaY: diff.y,
			}),
			{
				shiftKey: keys.shift,
				ctrlKey: keys.ctrl,
				altKey: keys.alt,
			},
		);
		square.dispatchEvent(event);
	};

	class Pointer {
		x = 0;
		y = 0;
		private data = {
			onPress: false,
			isPrimary: false,
			id: 0,
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
		pointeract,
		acc,
		square,
		dispose,
		Pointer,
		wheel,
	};
}
