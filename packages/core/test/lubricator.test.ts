import {
	Drag,
	WheelPanZoom,
	Lubricator,
	lubricatorDragPreset as drag,
	lubricatorZoomPreset as zoom,
} from '@';
import { expect, test } from 'bun:test';
import setup from './test-utils';

test('drag/pan', () => {
	const { acc, dispose, Pointer, nextFrame } = setup([Drag, Lubricator], {
		lubricator: { drag },
	});
	const p = new Pointer();
	p.down();
	p.move({ x: 100, y: 100 });
	p.up();
	expect(acc.drag).toStrictEqual({ x: 0, y: 0 });

	// Interpolate by factor 0.25
	nextFrame();
	expect(acc.drag).toStrictEqual({ x: 25, y: 25 });

	nextFrame();
	expect(acc.drag).toStrictEqual({ x: 43.75, y: 43.75 });

	for (let i = 0; i < 20; i++) nextFrame();
	expect(acc.drag).toStrictEqual({ x: 100, y: 100 });

	dispose();
});

test('zoom', () => {
	const { acc, dispose, wheel, nextFrame } = setup([WheelPanZoom, Lubricator], {
		lubricator: { zoom },
	});
	wheel({ x: 0, y: 50 });
	expect(acc.scale).toBe(1);

	nextFrame();
	expect(acc.scale).toStrictEqual(0.75 ** 0.25);

	for (let i = 0; i < 20; i++) nextFrame();
	expect(acc.scale).toStrictEqual(0.75);

	dispose();
});
