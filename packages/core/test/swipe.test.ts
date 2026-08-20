import { Swipe } from '@';
import { expect, test, vi } from 'bun:test';
import setup from './test-utils';

test('swipe right', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p = new Pointer();
	p.down();
	p.move({ x: 50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('right');
	expect(acc.swipes[0].streak).toBe(1);
	expect(acc.swipes[0].displacement).toBeCloseTo(50);
	expect(acc.swipes[0].duration).toBeGreaterThanOrEqual(0);
	dispose();
});

test('swipe left', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p = new Pointer();
	p.down({ x: 100, y: 0 });
	p.move({ x: -50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('left');
	expect(acc.swipes[0].streak).toBe(1);
	expect(acc.swipes[0].displacement).toBeCloseTo(50);
	dispose();
});

test('swipe up', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p = new Pointer();
	p.down({ x: 0, y: 100 });
	p.move({ x: 0, y: -50 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('up');
	expect(acc.swipes[0].streak).toBe(1);
	expect(acc.swipes[0].displacement).toBeCloseTo(50);
	dispose();
});

test('swipe down', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p = new Pointer();
	p.down();
	p.move({ x: 0, y: 50 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('down');
	expect(acc.swipes[0].streak).toBe(1);
	expect(acc.swipes[0].displacement).toBeCloseTo(50);
	dispose();
});

test('does not fire when distance is below threshold', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinDistance: 20, swipeMinVelocity: 0 });
	const p = new Pointer();
	p.down();
	p.move({ x: 10, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(0);
	dispose();
});

test('does not fire when velocity is below threshold', () => {
	const time = 0;
	const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(time);
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 1 });
	const p = new Pointer();
	p.down();
	// No time advances → all timestamps at 0 → wTime = 0 → velocity = 0
	p.move({ x: 50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(0);
	dateSpy.mockRestore();
	dispose();
});

test('velocity is computed correctly', () => {
	let time = 0;
	const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => time);
	const { acc, dispose, Pointer } = setup([Swipe]);
	const p = new Pointer();
	p.down(); // T=0, x=0
	time = 50;
	p.move({ x: 50, y: 0 }); // T=50, x=50
	time = 100;
	p.move({ x: 50, y: 0 }); // T=100, x=100
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].velocity).toBeCloseTo(1, 1); // 100px / 100ms = 1 px/ms
	expect(acc.swipes[0].duration).toBe(100);
	expect(acc.swipes[0].displacement).toBeCloseTo(100);
	dateSpy.mockRestore();
	dispose();
});

test('two-finger swipe emits per-pointer and combined events', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down({ x: 0, y: 50 });
	p2.down({ x: 50, y: 50 });
	p1.move({ x: 50, y: 0 });
	p2.move({ x: 50, y: 0 });
	p1.up();
	p2.up();
	// P1 fires pointerNumber:1, p2 fires pointerNumber:1, then combined pointerNumber:2
	expect(acc.swipes).toHaveLength(2);
	expect(acc.swipes[0].streak).toBe(1);
	expect(acc.swipes[1].streak).toBe(2);
	expect(acc.swipes[1].direction).toBe('right');
	dispose();
});

test('two-finger swipe in opposite directions does not emit combined event', () => {
	const { acc, dispose, Pointer } = setup([Swipe], { swipeMinVelocity: 0 });
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down({ x: 50, y: 50 });
	p2.down({ x: 100, y: 50 });
	p1.move({ x: 50, y: 0 });
	p2.move({ x: -50, y: 0 });
	p1.up();
	p2.up();
	// Each pointer fires its own event; directions differ so no combined event
	expect(acc.swipes).toHaveLength(2);
	expect(acc.swipes.every((s) => s.streak === 1)).toBe(true);
	dispose();
});
