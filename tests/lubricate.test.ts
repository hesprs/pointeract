import { Drag, WheelPanZoom, Lubricator, dragPreset as drag, zoomPreset as zoom } from '@';
import { expect, test } from 'vitest';

import setup from './testUtils';

test('drag/pan', async () => {
	const { acc, dispose, Pointer, nextFrame } = setup([Drag, Lubricator], {
		lubricator: { drag },
	});
	const p = new Pointer();
	p.down();
	p.move({ x: 100, y: 100 });
	p.up();
	expect(acc.drag).toEqual({ x: 0, y: 0 });

	// interpolate by factor 0.25
	nextFrame();
	expect(acc.drag).toEqual({ x: 25, y: 25 });

	nextFrame();
	expect(acc.drag).toEqual({ x: 43.75, y: 43.75 });

	for (let i = 0; i < 20; i++) nextFrame();
	expect(acc.drag).toEqual({ x: 100, y: 100 });

	await dispose();
});

test('zoom', async () => {
	const { acc, dispose, wheel, nextFrame } = setup([WheelPanZoom, Lubricator], {
		lubricator: { zoom },
	});
	wheel({ x: 0, y: 200 });
	expect(acc.scale).toEqual(1);

	nextFrame();
	expect(acc.scale).toEqual(Math.pow(0.6, 0.25));

	for (let i = 0; i < 20; i++) nextFrame();
	expect(acc.scale).toEqual(0.6);

	await dispose();
});
