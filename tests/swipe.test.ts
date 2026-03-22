import { Swipe } from '@';
import { expect, test, vi } from 'vitest';
import setup from './testUtils';

test('swipe right', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p = new Pointer();
	p.down();
	p.move({ x: 50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('right');
	await dispose();
});

test('swipe left', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p = new Pointer();
	p.down({ x: 100, y: 0 });
	p.move({ x: -50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('left');
	await dispose();
});

test('swipe up', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p = new Pointer();
	p.down({ x: 0, y: 100 });
	p.move({ x: 0, y: -50 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('up');
	await dispose();
});

test('swipe down', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p = new Pointer();
	p.down();
	p.move({ x: 0, y: 50 });
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('down');
	await dispose();
});

test('does not fire when distance is below threshold', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0, minDistance: 20 });
	const p = new Pointer();
	p.down();
	p.move({ x: 10, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(0);
	await dispose();
});

test('does not fire when velocity is below threshold', async () => {
	let time = 0;
	const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => time);
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 1 });
	const p = new Pointer();
	p.down();
	// no time advances → all timestamps at 0 → wTime = 0 → velocity = 0
	p.move({ x: 50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(0);
	dateSpy.mockRestore();
	await dispose();
});

test('velocity is computed correctly', async () => {
	let time = 0;
	const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => time);
	const { acc, dispose, Pointer } = setup([Swipe]);
	const p = new Pointer();
	p.down(); // t=0, x=0
	time = 50;
	p.move({ x: 50, y: 0 }); // t=50, x=50
	time = 100;
	p.move({ x: 50, y: 0 }); // t=100, x=100
	p.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].velocity).toBeCloseTo(1, 1); // 100px / 100ms = 1 px/ms
	dateSpy.mockRestore();
	await dispose();
});

test('two-finger swipe fires', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down({ x: 0, y: 50 });
	p2.down({ x: 50, y: 50 });
	p1.move({ x: 50, y: 0 });
	p2.move({ x: 50, y: 0 });
	p1.up();
	p2.up();
	expect(acc.swipes).toHaveLength(1);
	expect(acc.swipes[0].direction).toBe('right');
	await dispose();
});

test('two-finger swipe in opposite directions does not fire', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0 });
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down({ x: 50, y: 50 });
	p2.down({ x: 100, y: 50 });
	p1.move({ x: 50, y: 0 });
	p2.move({ x: -50, y: 0 });
	p1.up();
	p2.up();
	expect(acc.swipes).toHaveLength(0);
	await dispose();
});

test('pointers option: single finger does not fire when 2 required', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0, pointers: 2 });
	const p = new Pointer();
	p.down();
	p.move({ x: 50, y: 0 });
	p.up();
	expect(acc.swipes).toHaveLength(0);
	await dispose();
});

test('pointers option: two fingers fire when 2 required', async () => {
	const { acc, dispose, Pointer } = setup([Swipe], { minVelocity: 0, pointers: 2 });
	const p1 = new Pointer();
	const p2 = new Pointer();
	p1.down({ x: 0, y: 50 });
	p2.down({ x: 50, y: 50 });
	p1.move({ x: 50, y: 0 });
	p2.move({ x: 50, y: 0 });
	p1.up();
	p2.up();
	expect(acc.swipes).toHaveLength(1);
	await dispose();
});
