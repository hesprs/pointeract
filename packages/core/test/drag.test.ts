import { Drag } from '@';
import { expect, test } from 'bun:test';
import setup from './test-utils';

test('drag', () => {
	const { acc, dispose, Pointer } = setup([Drag]);
	const p = new Pointer();
	p.down();
	p.move({ x: 100, y: 100 });
	p.up();
	expect(acc.drag).toStrictEqual({ x: 100, y: 100 });
	dispose();
});
