import { Drag } from '@';
import { expect, test } from 'vitest';

import setup from './testUtils';

test('drag', async () => {
	const { acc, dispose, Pointer } = setup(Drag);
	const p = new Pointer();
	p.down();
	p.move({ x: 100, y: 100 });
	p.up();
	expect(acc.drag).toEqual({ x: 100, y: 100 });
	await dispose();
});
