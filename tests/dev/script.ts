import { Click, Drag, MultitouchPanZoom, Pointeract, PreventDefault, type StdEvents, WheelPanZoom } from '@';

const square = document.getElementById('test-square') as HTMLElement;
const data = {
	x: 0,
	y: 0,
	scale: 1,
};
function pan(e: StdEvents['pan']) {
	const detail = e.detail;
	data.x += detail.x;
	data.y += detail.y;
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

const pointeract = new Pointeract(square, [
	PreventDefault,
	MultitouchPanZoom,
	Drag,
	Click,
	WheelPanZoom,
]).start();
new Pointeract(document.body, PreventDefault).start();
pointeract.on('drag', pan);
pointeract.on('pan', pan);
pointeract.on('zoom', zoom);
pointeract.on('trueClick', trueClick);
refresh();

function refresh() {
	square.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.scale})`;
	requestAnimationFrame(refresh);
}
