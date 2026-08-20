import { afterAll, beforeEach, spyOn } from 'bun:test';
import { Window as HappyWindow, DOMRect } from 'happy-dom';

const window = new HappyWindow({ url: 'https://localhost:8080' });
const animationQueue: Array<FrameRequestCallback> = [];

Object.assign(globalThis, {
	HTMLDivElement: window.HTMLDivElement,
	HTMLElement: window.HTMLElement,
	PointerEvent: window.PointerEvent,
	WheelEvent: window.WheelEvent,
	cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
	document: window.document,
	requestAnimationFrame: window.requestAnimationFrame.bind(window),
	window,
});

spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
	function mockBoundingClientRect(this: InstanceType<typeof window.HTMLElement>): DOMRect {
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

spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
	animationQueue.push(callback);
	return animationQueue.length;
});

const nextFrame = () => animationQueue.shift()?.(1);

export default nextFrame;

beforeEach(() => {
	animationQueue.length = 0;
	document.body.replaceChildren();
});

afterAll(async () => {
	await window.happyDOM.abort();
	window.close();
});
