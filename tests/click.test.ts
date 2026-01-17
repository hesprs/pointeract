import { Click } from '@';
import { expect, test } from 'vitest';

import setup from './testUtils';

test('trigger a trueClick', async () => {
	const { acc, dispose, Pointer } = setup(Click);
	const p = new Pointer();
	for (let i = 0; i < 3; i++) {
		p.down();
		p.up();
	}
	expect(acc.clicks).toBe(3);
	await dispose();
});

test('trigger an shifted click that is not a trueClick', async () => {
	const { acc, dispose, Pointer } = setup(Click);
	const p = new Pointer();
	p.down();
	p.move({ x: 10, y: 10 });
	p.up();
	expect(acc.clicks).toBe(0);
	await dispose();
});

test('trigger an interrupted click that is not a trueClick', async () => {
	const { acc, dispose, Pointer } = setup(Click);
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down();
	p2.down({ x: 100, y: 100 });
	p2.up();
	p1.up();
	expect(acc.clicks).toBe(0);
	await dispose();
});
