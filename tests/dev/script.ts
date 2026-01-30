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

const square = document.getElementById('test-square') as HTMLElement;
const data = {
	x: 0,
	y: 0,
	scale: 1,
};
function pan(e: StdEvents['pan']) {
	const detail = e.detail;
	data.x += detail.deltaX;
	data.y += detail.deltaY;
}
function zoom(e: StdEvents['zoom']) {
	const detail = e.detail;
	data.scale *= detail.factor;
	data.x += detail.x * (1 - detail.factor);
	data.y += detail.y * (1 - detail.factor);
}
function trueClick(e: StdEvents['trueClick']) {
	const detail = e.detail;
	console.log(detail.streak);
	square.style.animation = 'none';
	// Trigger a reflow to ensure the animation is reset
	void square.offsetWidth;
	square.style.animation = 'amplify-and-shrink 0.4s';
}

const pointeract = new Pointeract(
	{
		element: square,
		lubricator: {
			pan: panPreset,
			drag: dragPreset,
			zoom: zoomPreset,
		},
	},
	[PreventDefault, MultitouchPanZoom, Drag, Click, WheelPanZoom, Lubricator],
).start();
new Pointeract({ element: document.body }, PreventDefault).start();
pointeract.on('drag', pan);
pointeract.on('pan', pan);
pointeract.on('zoom', zoom);
pointeract.on('trueClick', trueClick);
refresh();

function refresh() {
	square.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.scale})`;
	requestAnimationFrame(refresh);
}
