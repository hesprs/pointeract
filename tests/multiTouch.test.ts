import { expect, test } from 'vitest';
import { Drag, MultitouchPanZoom } from '@';
import setup from './testUtils';

test('two touches 100px apart, zoom in and pan up', () => {
	const { acc, dispose, Pointer } = setup(MultitouchPanZoom);
	const p1 = new Pointer();
	const p2 = new Pointer();

	p1.down();
	p2.down({ x: 100, y: 0 });

	// zoom in & pan up
	p1.move({ x: -50, y: 100 });
	p2.move({ x: 50, y: 100 });

	p1.up();
	p2.up();

	expect(acc.scale).toEqual(2);
	expect(acc.pan).toEqual({ x: 0, y: 100 });

	dispose();
});
