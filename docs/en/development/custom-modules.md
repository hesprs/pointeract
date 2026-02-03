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

If you want to customize the construction process, grab `BaseArgs` and spread the constructor parameters into `super()`:

```TypeScript
import { BaseModule, type BaseArgs } from 'pointeract';

class MyModule extends BaseModule {
    constructor(...args: BaseArgs) {
        super(...args);
        // ... your logic
    }
}
```

## Type Orchestration

`BaseModule` accepts the type parameters as: `BaseModule<Options, Events, Augmentation>`.

It uses default declarations if no parameters are provided:

- Events: `StdEvents`
- Options: `BaseOptions`
- Augmentation: `{}`

Modules claim their custom [events](#custom-events), [options](#custom-options) and [Augmentation](#augment-the-pointeract-instance) declaratively, which are then used in the type orchestration engine to provide first-of-class type safety, modularity and DX.

You can always declare you custom ones by extending either one above and pass to `BaseModule`.

## Properties

This class provides the basic data and helpers for a module:

```TypeScript
class BaseModule {
    options: <orchestrated options>;
    element: HTMLElement;
    window: Window;
    pointers: Map<number, Pointer>;
    getNthPointer: (n: number) => Pointer;
    toTargetCoords: (raw: Coordinates) => Coordinates;
    augment: (<orchestrated augmentations>) => void;
    dispatch: (name: <orchestrated event names>, detail?: <corresponding detail>) => void;
}

type Pointer = {
    records: Array<{ x: number; y: number; timestamp: number }>; // pointer records, coordinates are absolute screen coords
    target: EventTarget | null;
    [key: Indexable]: any; // your can add your own properties into a pointer, the key can be a string, number or symbol
};
```

- `element`: The element to be monitored, the same as the `event` field in `BaseOptions`.
- `window`: The window context of the monitoring element. It's always better practice to use `this.window` instead of direct `window` in a module.
- `options`: The full options that the suer passes in.
- `pointers`: A hot-updated map of pointers, the key is the pointer ID, the value is a pointer object.
- `getNthPointer`: Get the nth pointer value in the pointers map.
- `toTargetCoords`: Convert screen coordinates to target coordinates that is configured by `coordinateOutput`, always use it if you are emitting events that involve coordinates.
- `dispatch`: Dispatch an event with a given name and detail.
- `augment`: inject properties into the parent `Pointeract` instance, you must provide what you have passed in as `Augmentations` in the type parameters.

## Hooks

```TypeScript
class BaseModule {
    onPointerDown?: (...args: [PointerEvent, Pointer, Pointers]) => void;
    onPointerMove?: (...args: [PointerEvent, Pointer, Pointers]) => void;
    onPointerUp?: (...args: [PointerEvent, Pointer, Pointers]) => void;
    onWheel?: (...args: [WheelEvent]) => void;
    onStart?: () => void;
    onStop?: () => void;
    dispose?: () => void;
}
```

- `onPointerDown`: Triggered when a pointer is pressed (same to `pointerdown` event but with extra context and avoids repeatedly adding listeners).
- `onPointerMove`: Triggered when a pointer is moved (same to `pointermove` event).
- `onPointerUp`: Triggered when a pointer is released (same to `pointerup` event).
- `onWheel`: Triggered when a wheel event is triggered (same to `wheel` event).
- `onStart`: Triggered when the module is started or after construction (`pointeract.start(MyModule)`).
- `onStop`: Triggered when the module is stopped or before disposal (`pointeract.stop(MyModule)`).
- `dispose`: Triggered when the module and the Pointeract instance is disposed (`pointeract.dispose()`).

::: tip
Always remember to use arrow functions when defining these hooks, otherwise the `this` keyword will be undefined when trying the access the hook outside the module (which Pointeract does).
:::

> **Reference to**:
>
> - [MDN PointerEvent](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
> - [MDN WheelEvent](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)

## Dispatching Events

Use `this.dispatch(name, detail)` to dispatch an event, the first argument is the event name, the second one is the event body, which can be undefined.

There are [existing event types](/events/) that you can follow, or you can [write your own events](#custom-events).

## Modifiers

Since all tasks Pointeract does is to dispatch all kinds of events, you can alter anything by intercepting events.

Modifier is such a powerful tool that allows you to read, intercept, and modify all events before they are dispatched.

### Define a Modifier

Use the `modifier` hook in a module to define modifiers, it consists any number of fields: the key is the name of the event you want to modify, and the value is the handler function. For the function: argument is the body of the raw event.

```TypeScript
class BaseModule {
    modifiers?: {
		[Key in <orchestrated event names>]?: (event: <corresponding detail>) => boolean | <custom detail>;
	};
}
```

### Modifier Return

- `true`: The event will be kept as-is and dispatched.
- `false`: The event will be ignored.
- `<custom detail>`: The event will be dispatched with your custom data, you still need to follow the corresponding event type.

The example above monitors the zoom event and logs the number of times it has been dispatched. It keeps all events unchanged.

::: info
When multiple modifiers are used, the first modifier that does not return `true` will be the only one that is executed.
:::

## Custom Events

The events that can be emitted by your modules are not limited to the ones listed in [Standard Events](/events/). You can literally emit any event you want.

### Extending `StdEvents` <Badge type="tip" text="TypeScript Only" />

If you want to use custom events, you first need to declare your custom events by extending `StdEvents`:

```TypeScript
import { BaseModule, StdEvents, BaseOptions } from 'pointeract';

interface CustomEvents extends StdEvents {
    moveMove: undefined; // add an event with no detail
    moveDetail: { x: number; y: number }; // add an event with detail of coordinates
}
```

Then you can pass your custom events to `BaseClass` as a type parameter:

```TypeScript
class YourModule extends BaseModule<BaseOptions, CustomEvents> {
    onPointerMove = () => {
        this.utils.dispatch('moveMove'); // no error
        this.utils.dispatch('moveDetail', { x: 0, y: 0 }); // no error
    };
}
```

Then you can dispatch your custom events. Yourself and your module users will gain full type safety.

## Custom Options

Pointeract inherits the same `options` reference from the constructor across the base class and all modules.

You also need to make an interface extend `BaseOptions` to declare the types.

```TypeScript
import { BaseModule, BaseOptions } from 'pointeract';

interface Options extends BaseOptions {
    moduleEnabled?: boolean,
}

class YourModule extends BaseModule<Options> {
    onPointerMove = () => {
        if (!this.options.moduleEnabled) return; // no error
    }
}
```

## Augment the `Pointeract` Instance

Almost same as options and events, but this time you don't need to extend anything since the default augmentation is empty. You also need to manually call `this.augment()` in your constructor.

```TypeScript
import { BaseModule, BaseOptions, StdEvents, BaseArgs } from 'pointeract';

interface Augmentation {
    log: YourModule['log'];
}

export default class YourModule extends BaseModule<Options, StdEvents, Augmentation> {
    private log = () => console.log('log injected!');

    constructor(...args: BaseArgs) {
        super(...args);
        this.augment({ log: this.log });
    }
}
```

Then when you instantiate the `Pointeract` class with your module loaded, you can see `log` appearing directly in the `Pointeract` instance:

```TypeScript
import { Pointeract } from 'pointeract';
import YourModule from './your-module';

const instance = new Pointeract({ element: app }, YourModule);
instance.log();

// Result:
// no type error
// 'log injected!' appears in the console
```
