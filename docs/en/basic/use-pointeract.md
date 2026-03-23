# Use the `Pointeract` Class

Everything Pointeract does is based on this class. It serves as an orchestrator of all the modules, interfaces and events.

## CheatSheet

| Description                             | Method                                                       |
| --------------------------------------- | ------------------------------------------------------------ |
| [Instantiate the Class](#instantiation) | `new Pointeract(options, modules?)`                          |
| [Start Base Class](#start-and-stop)     | `pointeract.start()`                                         |
| [Stop Base Class](#start-and-stop)      | `pointeract.stop()`                                          |
| [Start Modules](#modules)               | `pointeract.start(ModuleConstructor \| ModuleConstructor[])` |
| [Stop Modules](#modules)                | `pointeract.stop(ModuleConstructor \| ModuleConstructor[])`  |
| [Subscribe](#subscribe)                 | `pointeract.on(eventName, callback)`                         |
| [Unsubscribe](#unsubscribe)             | `pointeract.off(eventName, callback)`                        |
| [Dispose](#disposal)                    | `pointeract.dispose()`                                       |

## Lifecycle

`Pointeract` implements a four-stage runtime pattern and runtime module resume / reloading pattern to meet various flexibility requirements.

### Instantiation

First, import the class:

```TypeScript
import { Pointeract } from 'pointeract';
```

You may also want to grab some modules, find them in [Modules](/modules/):

```TypeScript
import { Drag, PreventDefault } from 'pointeract';
```

Then, you need a DOM element to attach to, below shows how to do that in Vanilla DOM:

::: code-group

```TypeScript [TypeScript]
const app = document.getElementById('app') as HTMLDivElement;
```

```HTML [HTML]
<div id="app"></div>
```

:::

Finally, you may want to define options, read elaboration in [Options](#options):

```TypeScript
const options = {
    element: app,
    coordinateOutput: 'absolute',
}
```

Now, you can create a Pointeract instance by passing the options and modules in a row, note that the `modules` is optional:

```TypeScript
const pointeract = new Pointeract(options, [Drag, PreventDefault]);
```

::: info
Powered by [SynthKernel](https://hesprs.github.io/researches/synthkernel), Pointeract uses TypeScript generics to smartly infer the types of options, events, and class methods available by scanning every module passed into the constructor.
:::

### Start and Stop

Pointeract does not do anything after initialization by design, make it running by calling `start()`:

```TypeScript
pointeract.start();
```

To stop Pointeract, call `stop()`:

```TypeScript
pointeract.stop();
```

::: tip
`stop()` also returns the class instance and does not destroy it. You can resume it later:

```TypeScript
pointeract.stop();
// ... some logic here
pointeract.start();
```

:::

### Disposal

To completely dispose Pointeract, call `dispose()`:

```TypeScript
pointeract.dispose();
```

::: tip
You don't need to call `stop()` or unsubscribe all event listeners before disposal, `dispose()` handles everything for you.
:::

### Modules

All modules are instantiated during the construction of `Pointeract` and disposed together when it is disposed.

To turn on/off modules at runtime, also use `start()` and `stop()`. For these two methods, if you do not pass any arguments, they will start/stop the Pointeract instance; otherwise the specified modules. All modules passed in are enabled by default at Pointeract construction.

You start/stop modules by passing in the **constructors** of modules, the methods accept an array of modules:

```TypeScript
pointeract.stop([PreventDefault, Drag]); // multiple modules
```

::: tip
Note that the start/stop of modules are independent to the start/stop of the base class: when the base class is stopped, all modules will be paused; but when the base class is started, only modules not explicitly stopped will be resumed. E.g.:

```TypeScript
// we have modules PreventDefault and Drag
pointeract.stop(); // everything is paused
pointeract.stop([PreventDefault]); // no apparent change, but PreventDefault is disabled at module level
pointeract.start(); // only the base class and Drag are started
pointeract.start([PreventDefault]); // PreventDefault will not be restarted unless explicitly reenabled here
```

:::

::: warning
You cannot load a module that is not passed into the Pointeract constructor after the construction.
:::

## Subscribe to Events

### Subscribe

Use `on()` to subscribe, the usage is similar to `addEventListener()`, but is fully typed and returns the pointeract instance for chaining.

```TypeScript
import type { StdEvents } from 'pointeract';

const hook = (e: StdEvents['drag']) => {
    console.log(e);
};
pointeract.on('drag', hook);
```

### Unsubscribe

Use `off()` to unsubscribe, also similar to `removeEventListener()`:

```TypeScript
pointeract.off('drag', hook);
```

## Options

### Define Options

Options are defined as an object and passed as the third argument of a Pointeract constructor:

```TypeScript
const options = {
    element: app,
    coordinateOutput: 'absolute',
}
const pointeract = new Pointeract(options, [Drag, PreventDefault]);
```

### Base Options

Most options are provided by [modules](/modules/), the only two exceptions are `coordinateOutput` and `element` shipped with the `Pointeract` class:

```TypeScript
interface BaseOptions {
    element: HTMLElement;
    coordinateOutput?: 'absolute' | 'relative' | 'relativeFraction';
}
```

**`element`** (required): the element to monitor.

**`coordinateOutput`**: defines the output coordinates format across Pointeract:

- `absolute`: screen coordinates in pixels
- `relative`(default): relative to the top-left corner of the element in pixels
- `relativeFraction`: relative to the top-left corner of the element divided by the element's size

### Update Options

Pointeract uses the same `options` reference passed in the constructor, you can reactively update options during runtime, or batch update options for many Pointeract instances at once:

```TypeScript
import { Pointeract, WheelPanZoom, Options } from 'pointeract';

const options: Options<WheelPanZoom> = {
    element: document.body
    coordinateOutput: 'absolute', // output absolute coordinates
}

const pointeract = new Pointeract(options, [WheelPanZoom]);

options.coordinateOutput = 'relative'; // output format instantly changes to relative
```

## Full Example

```TypeScript
import { Pointeract, Drag, PreventDefault, Events } from 'pointeract';

function hook(e: Events['drag']) {
    console.log(e);
};

const app = document.getElementById('app') as HTMLDivElement;
const options = {
    element: app,
    coordinateOutput: 'absolute',
}

// instantiate the class and subscribe
const pointeract = new Pointeract(options, [Drag, PreventDefault])
    .start()
    .on('drag', hook);

// Hot update options
options.coordinateOutput = 'relative';

// Unsubscribe
pointeract.off('drag', hook);

// Pause
pointeract.stop();
// Resume
pointeract.start();

// Disable PreventDefault only
pointeract.stop([PreventDefault]);

// Dispose
pointeract.dispose();
```
