import { expect, test } from 'vitest';
import { SinglePointer_Drag } from '@';
import setup from './testUtils';

test('drag', () => {
	const { acc, dispose, Pointer } = setup([SinglePointer_Drag]);
	const p = new Pointer();
	p.down();
	p.move({ x: 100, y: 100 });
	p.up();
	expect(acc.drag).toEqual({ x: 100, y: 100 });
	dispose();
});
