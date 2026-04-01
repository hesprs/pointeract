# Testing

Go to [Codecov](https://codecov.io/github/hesprs/pointeract) to see the current test coverage.

## Techstack

- [Vitest](https://vitest.dev/): testing framework
- [HappyDOM](https://github.com/capricorn86/happy-dom): DOM environment, essential for a front-end library

## Standards

Pointeract obeys the test requirements as follows:

- When developing a new module, it is mandatory to write a unit test unless it's untestable.
- The overall test coverage should be higher than 90%.

## Monkey Test

One great feature of Pointeract that we are proud of is its robustness which exceeds most competitors. The following test is an example:

<<< ../../../tests/integration.test.ts#monkey-test

The interaction denoted by the code is visualized as follows:

![Monkey Test](/monkey-test.svg)

The aim of this test is to simulate chaotic multitouch drag, pan and zoom intends to ensure `drag` and `multitouchPanZoom` modules can survive extreme conditions. Pointeract handled it decently.

But when the similar manual human test is conducted in the website demos of `Hammer.js` and `Interact.js`, [they failed for different symptoms](/whats-pointeract#how-pointeract-stands-out).

This test demonstrates how `Pointeract` can handle extreme conditions with the least amount of code.
