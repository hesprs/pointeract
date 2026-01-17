import { WheelPanZoom } from '@';
import { expect, test } from 'vitest';

import setup from './testUtils';

test('normal wheel', async () => {
	const { acc, dispose, wheel } = setup(WheelPanZoom);
	wheel({ x: 0, y: 200 });
	const smallerScale = acc.scale;
	expect(smallerScale < 0.9).toBe(true);
	wheel({ x: 0, y: -200 });
	expect(acc.scale > smallerScale).toBe(true);
	await dispose();
});

test('professional control schema', async () => {
	const options = { proControlSchema: false };
	const { acc, dispose, wheel } = setup(WheelPanZoom, options);

	// normal schema
	wheel({ x: 0, y: 200 });
	const smallerScale = acc.scale;
	expect(smallerScale < 0.9).toBe(true);
	acc.clear();

	// intend to pan horizontally
	wheel({ x: -200, y: 100 });
	expect(acc.scale).toBe(1);
	expect(acc.pan).toEqual({ x: 200, y: -100 });
	expect(options.proControlSchema).toBe(true);
	options.proControlSchema = false;
	acc.clear();

	// shift key down
	wheel({ x: 0, y: 200 }, { shift: true });
	expect(acc.scale).toBe(1);
	expect(acc.pan.x).toEqual(-200);
	// preserve already horizontal scroll
	wheel({ x: -200, y: 0 }, { shift: true });
	expect(acc.pan.x).toEqual(0);
	expect(options.proControlSchema).toBe(true);
	options.proControlSchema = false;
	acc.clear();

	// ctrl key down
	wheel({ x: 0, y: -200 }, { ctrl: true });
	expect(acc.scale > 1).toBe(true);
	expect(options.proControlSchema).toBe(true);

	await dispose();
});
