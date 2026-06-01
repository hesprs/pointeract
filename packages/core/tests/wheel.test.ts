import { WheelPanZoom } from '@';
import { expect, test } from 'vitest';
import setup from './test-utils';

test('normal wheel', async () => {
	const { acc, dispose, wheel } = setup([WheelPanZoom]);
	wheel({ x: 0, y: 50 });
	const smallerScale = acc.scale;
	expect(smallerScale).toBeLessThan(0.9);
	wheel({ x: 0, y: -50 });
	expect(acc.scale).toBeGreaterThan(smallerScale);
	await dispose();
});

test('professional control schema', async () => {
	const options = { proControlSchema: false };
	const { acc, dispose, wheel } = setup([WheelPanZoom], options);

	// Normal schema
	wheel({ x: 0, y: 200 });
	const smallerScale = acc.scale;
	expect(smallerScale).toBeLessThan(0.9);
	acc.clear();

	// Intend to pan horizontally
	wheel({ x: -200, y: 100 });
	expect(acc.scale).toBe(1);
	expect(acc.pan).toStrictEqual({ x: 200, y: -100 });
	expect(options.proControlSchema).toBe(true);
	options.proControlSchema = false;
	acc.clear();

	// Shift key down
	wheel({ x: 0, y: 200 }, { shift: true });
	expect(acc.scale).toBe(1);
	expect(acc.pan.x).toBe(-200);
	// Preserve already horizontal scroll
	wheel({ x: -200, y: 0 }, { shift: true });
	expect(acc.pan.x).toBe(0);
	expect(options.proControlSchema).toBe(true);
	options.proControlSchema = false;
	acc.clear();

	// Ctrl key down
	wheel({ x: 0, y: -200 }, { ctrl: true });
	expect(acc.scale).toBeGreaterThan(1);
	expect(options.proControlSchema).toBe(true);

	await dispose();
});
