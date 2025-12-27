# Testing

Any professional library should have a test suite, Pointeract is no different.

[![Test Coverage](https://img.shields.io/codecov/c/github/hesprs/pointeract/main?style=flat&logo=codecov&logoColor=white&label=Test%20Coverage&labelColor=ff0077&color=333333)](https://codecov.io/github/hesprs/pointeract)

Above is the current test coverage.

## Techstack

- [Vitest](https://vitest.dev/): testing framework
- [HappyDOM](https://github.com/capricorn86/happy-dom): DOM environment, essential for a front-end library

## Requirements

Currently, tests obey the requirements as follows:
- Each module has a unit test.
- When the test relates to more than one module, it is a integration test.
- The overall test coverage should be more than 90%.

## Chaotic Testing

One great feature of Pointeract that we are proud of is its robustness which exceeds most competitors. One testing technique we use is Chaotic Testing, which is basically simulating a lot of complex input scenarios. Here is an example:

<<< ../../../tests/integration.test.ts#chaotic-test

The interaction denoted by the code is visualized as follows:

![Chaotic Testing](/chaoticTest.svg)

The aim of this test is to simulate chaotic multitouch drag, pan and zoom intends to ensure `drag` and `multitouchPanZoom` modules can survive extreme conditions. Of course, Pointeract performs well.