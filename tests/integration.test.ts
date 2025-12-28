import { expect, test } from 'vitest';
import { Click, Drag, MultitouchPanZoom, PreventDefault } from '@';
import setup from './testUtils';

test('hot stop / start a module', () => {
	const { acc, dispose, Pointer, pointeract } = setup([Click, PreventDefault], {
		coordinateOutput: 'relativeFraction',
	});
	const p = new Pointer();

	pointeract.stop(Click);
	for (let i = 0; i < 3; i++) {
		p.down();
		p.up();
	}
	expect(acc.clicks).toBe(0);

	pointeract.start(Click);
	for (let i = 0; i < 3; i++) {
		p.down();
		p.up();
	}
	expect(acc.clicks).toBe(3);

	dispose();
});

// #region chaotic-test
test('chaotic movements', () => {
	const { acc, dispose, Pointer } = setup([MultitouchPanZoom, Drag]);
	const p1 = new Pointer();
	const p2 = new Pointer();
	const p3 = new Pointer();

	p1.down();
	p1.move({ x: -100, y: 0 }); // left 100
	// p1: (-100, 0);

	p2.down({ x: 100, y: 0 });
	p2.move({ x: -100, y: 0 }); // scale * 0.5, left 50
	// p1: (-100, 0); p2: (0, 0);

	// down 300, scale * 3
	for (let i = 0; i < 10; i++) {
		p1.move({ x: -10, y: 30 });
		p2.move({ x: 10, y: 30 });
	}
	// p1: (-200, 300); p2: (100, 300);

	p3.down();
	p3.move({ x: 100, y: -100 }); // ignore the third pointer
	p3.up();
	p1.up();

	p2.move({ x: 0, y: -600 }); // up 600
	// p2: (100, -300);

	p3.down({ x: 200, y: 0 });
	p3.move({ x: 100, y: 0 }); // scale * ~= 1.14, right 50
	// p2: (100, -300); p3: (300, 0);
	p2.up();
	p3.up();

	const pos = {
		x: acc.pan.x + acc.drag.x,
		y: acc.pan.y + acc.drag.y,
	};
	expect(pos).toEqual({ x: -100, y: -300 }); // result: left 100, up 300
	expect(1.7 < acc.scale && acc.scale < 1.72).toBe(true);

	dispose();
});
// #endregion
