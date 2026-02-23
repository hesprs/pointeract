import {
	Click,
	Drag,
	MultitouchPanZoom,
	Pointeract,
	PreventDefault,
	Lubricator,
	type StdEvents,
	WheelPanZoom,
	panPreset,
	zoomPreset,
	dragPreset,
} from '@';
import { Coordinates } from '@/types';

const square = document.getElementById('test-square') as HTMLElement;
const squareRect = square.getBoundingClientRect();
const bodyRect = document.body.getBoundingClientRect();
const data = {
	x: (bodyRect.width - squareRect.width) / 2,
	y: (bodyRect.height - squareRect.height) / 2,
	scale: 1,
};

function C2C(coords: Coordinates) {
	return {
		x: coords.x - data.x,
		y: coords.y - data.y,
	};
}

function pan(e: StdEvents['pan']) {
	data.x += e.deltaX;
	data.y += e.deltaY;
}
function zoom(e: StdEvents['zoom']) {
	data.scale *= e.factor;
	const canvas = C2C(e);
	data.x = e.x - canvas.x * e.factor;
	data.y = e.y - canvas.y * e.factor;
}
function trueClick(e: StdEvents['trueClick']) {
	console.log(e.streak);
	square.style.animation = 'none';
	// Trigger a reflow to ensure the animation is reset
	void square.offsetWidth;
	square.style.animation = 'amplify-and-shrink 0.4s';
}

new Pointeract(
	{
		element: document.body,
		lubricator: {
			pan: panPreset,
			drag: dragPreset,
			zoom: zoomPreset,
		},
	},
	[PreventDefault, MultitouchPanZoom, Drag, Click, WheelPanZoom, Lubricator],
)
	.start()
	.on('drag', pan)
	.on('pan', pan)
	.on('zoom', zoom)
	.on('trueClick', trueClick);

refresh();

function refresh() {
	square.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.scale})`;
	requestAnimationFrame(refresh);
}
