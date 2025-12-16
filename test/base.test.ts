import { expect, test } from 'vitest';
import { SinglePointer_TrueClick } from '@';
import setup from './testUtils';

test('hot stop / start a module', () => {
	const { acc, dispose, Pointer, pointeract } = setup([SinglePointer_TrueClick], {
		preventDefault: true,
		coordinateOutput: 'relativeFraction',
	});
	const p = new Pointer();

	pointeract.stop([SinglePointer_TrueClick]);
	for (let i = 0; i < 3; i++) {
		p.down();
		p.up();
	}
	expect(acc.clicks).toBe(0);

	pointeract.start([SinglePointer_TrueClick]);
	for (let i = 0; i < 3; i++) {
		p.down();
		p.up();
	}
	expect(acc.clicks).toBe(3);

	dispose();
});
