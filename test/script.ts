import {
	MultiPointer_PanZoom,
	Pointeract,
	SinglePointer_Pan,
	SinglePointer_TrueClick,
	Wheel_PanZoom,
} from '@';

type Coordinates = {
	x: number;
	y: number;
};

const square = document.getElementById('test-square') as HTMLElement;
const data = {
	x: 0,
	y: 0,
	scale: 1,
};
function pan(e: Event) {
	const detail = (e as CustomEvent<Coordinates>).detail;
	data.x += detail.x;
	data.y += detail.y;
}
function zoom(e: Event) {
	const detail = (e as CustomEvent<{ factor: number; origin: Coordinates }>).detail;
	data.scale *= detail.factor;
}
function trueClick(e: Event) {
	const detail = (e as CustomEvent<{ steak: number }>).detail;
	console.log(detail.steak);
	square.style.animation = 'none';
	// Trigger a reflow to ensure the animation is reset
	void square.offsetWidth;
	square.style.animation = 'amplify-and-shrink 0.4s';
}

const pointeract = new Pointeract(square, [
	MultiPointer_PanZoom,
	SinglePointer_Pan,
	SinglePointer_TrueClick,
	Wheel_PanZoom,
], {preventDefault: true});
pointeract.addEventListener('pan', pan);
pointeract.addEventListener('zoom', zoom);
pointeract.addEventListener('trueClick', trueClick);
pointeract.start();
refresh();

function refresh() {
	square.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.scale})`;
	requestAnimationFrame(refresh);
}
