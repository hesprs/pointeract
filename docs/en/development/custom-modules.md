# Write Custom Modules

The functionalities of Pointeract are thoroughly achieved by modules. It also allows you to write your own modules with ease. You can find some module examples in [our GitHub repository](https://github.com/Hesprs/Pointeract/tree/main/src/modules).

## Base Module

A module is a class that extends `BaseModule`:

```TypeScript
import { BaseModule } from 'pointeract';

class MyModule extends BaseModule {
    // ... your logic
}
```

::: tip
In most cases, a Pointeract module does not need construction by yourself, which is done in `BaseModule`.
:::

## Properties

This class provides the basic stuff for a module:

```TypeScript
class BaseModule {
    monitoringElement: HTMLElement;
    window: Window;
    pointers: Map<number, Pointer>;
    utils: {
        getNthValue: (n: number) => Pointer;
        screenToTarget: (raw: Coordinates) => Coordinates;
        dispatch: (name: string, detail?: unknown) => void;
        getLast: <T>(arr: T[], num?: number) => T;
    }
}

type Pointer = {
 records: Array<{ x: number; y: number; timestamp: number }>; // pointer records, coordinates are absolute screen coords
 target: EventTarget | null;
 [key: Indexable]: any; // your can add your own properties into a pointer, the key can be a string, number or symbol
};
```

- `monitoringElement`: The element to be monitored, the same as the first argument passed into the constructor.
- `window`: The window context of the monitoring element. It's always better practice to use `this.window` instead of direct `window` in a module.
- `pointers`: A hot-updated map of pointers, the key is the pointer ID, the value is a pointer object.
- `utils`: A set of utilities for a module:
    - `getNthValue`: Get the nth pointer value in the pointers map.
    - `screenToTarget`: Convert screen coordinates to target coordinates that is configured by `coordinateOutput`, always use it if you are emitting events that involve coordinates.
    - `dispatch`: Dispatch an event with a given name and detail.
    - `getLast`: A pure functional utility: get the last element in an array.import { BaseModule } from 'pointeract';

## Hooks

```TypeScript
class BaseModule {
 onPointerDown?: (...args: [PointerEvent, Pointer, Pointers]) => void;
 onPointerMove?: (...args: [PointerEvent, Pointer, Pointers]) => void;
 onPointerUp?: (...args: [PointerEvent, Pointer, Pointers]) => void;
 onWheel?: (...args: [WheelEvent]) => void;
 onStart?: () => void;
 onStop?: () => void;
    modifier?: () => ModifierReturn;
    dispose?: () => void;
}

type ModifierReturn = true | false | { name: string; detail: unknown };
```

- `onPointerDown`: Triggered when a pointer is pressed (same to `pointerdown` event but with extra context and avoids repeatedly adding listeners).
- `onPointerMove`: Triggered when a pointer is moved (same to `pointermove` event).
- `onPointerUp`: Triggered when a pointer is released (same to `pointerup` event).
- `onWheel`: Triggered when a wheel event is triggered (same to `wheel` event).
- `onStart`: Triggered when the module is started (`pointeract.start(MyModule)`).
- `onStop`: Triggered when the module is stopped (`pointeract.stop(MyModule)`).
- `modifier`: Triggered when an event is about to be dispatched. (find more details in [Modifier](/development/modifier))
- `dispose`: Triggered when the module and the Pointeract instance is disposed (`pointeract.dispose()`).

::: tip
Always remember to use arrow functions when defining these hooks, otherwise the `this` keyword will be undefined when trying the access the hook outside the module (which Pointeract does).
:::

> **Reference to**:
>
> - [MDN PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
> - [MDN WheelEvent](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)

## Dispatching Events

Use `this.utils.dispatch()` to dispatch an event, the second argument will be assigned to the `detail` property of the event.

There are [existing event types](/events/) that you can follow, or you can [write your own events](/development/custom-events).
