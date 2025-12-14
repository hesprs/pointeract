import Pointeract from '@';

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
const pointeract = new Pointeract(square);
pointeract.addEventListener('pan', e => {
	const detail = (e as CustomEvent<Coordinates>).detail;
	data.x += detail.x;
	data.y += detail.y;
});
pointeract.addEventListener('zoom', e => {
	const detail = (e as CustomEvent<{ factor: number; origin: Coordinates }>).detail;
	data.scale *= detail.factor;
});
pointeract.addEventListener('trueClick', () => {
    square.style.animation = 'none';
    // Trigger a reflow to ensure the animation is reset
    void square.offsetWidth;
    square.style.animation = 'amplify-and-shrink 0.4s';
});
pointeract.start();
refresh();

function refresh() {
	square.style.transform = `translate(${data.x}px, ${data.y}px) scale(${data.scale})`;
	requestAnimationFrame(refresh);
}
