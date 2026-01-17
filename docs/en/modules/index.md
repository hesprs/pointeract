# Modules

Modules are the heart of Pointeract.

## Shipped Modules

Here you can find all modules shipped with Pointeract:

|                      Module                       |     Target     | Description                                             |
| :-----------------------------------------------: | :------------: | ------------------------------------------------------- |
|    [PreventDefault](/modules/prevent-default)     |  The Element   | Prevents default browser behavior.                      |
|              [Click](/modules/click)              | Single Pointer | Checks if a click was performed without any movement.   |
|               [Drag](/modules/drag)               | Single Pointer | Tracks pointer movement and emits drag events.          |
|      [WheelPanZoom](/modules/wheel-pan-zoom)      |  Mouse Wheel   | Tracks pointer wheel movement and key press.            |
| [MultiTouchPanZoom](/modules/multitouch-pan-zoom) |   Multitouch   | Resolves pan/zoom by analyzing movement of two touches. |

## Module Types Conversion

TypeScript class behavior is weird:

- In actual runtime logic, a constructor is constructor.
- But When you are passing a class constructor as a type, it actually infers the class instance type.
- You need to use `typeof` to get the constructor type.

This may seem confusing at first glance:

```TypeScript
import { Drag } from 'pointeract'
const dragCtor: Drag = Drag; // Type Error: Type 'typeof Drag' is missing the following properties from type 'Drag': onPointerMove, utils, window, pointers, and 2 more.
const dragCtor: typeof Drag = Drag; // OK
```

All module arguments Pointeract accepts are module constructors, so in your runtime code, you pass constructors:

```TypeScript
import { Pointeract, Drag, PreventDefault } from 'pointeract';
const pointeract = new Pointeract(app, [Drag, PreventDefault]).start();
```

However, when you are accessing types, you need to use `typeof`:

```TypeScript
import { Pointeract, Drag, PreventDefault } from 'pointeract';
type pointeract = Pointeract<typeof Drag, typeof PreventDefault>;
```

For this reason, Pointeract has a type helper export `Ctors<T extends Array<BaseModule> | BaseModule>` when accessing types:

```TypeScript
import { Pointeract, Drag, PreventDefault, Ctors, Options } from 'pointeract';
type pointeract = Pointeract<Ctors<[Drag, PreventDefault]>>;
type options = Options<Ctors<[Drag, PreventDefault]>>;
```
