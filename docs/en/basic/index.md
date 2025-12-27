# Base Class

Everything Pointeract does is based on this class.

## TL;DR CheatSheet

| Description                                      | Method                                            |
| ------------------------------------------------ | ------------------------------------------------- |
| [Instantiate the Class](#instantiation)          | `new Pointeract(element, modules, options?)`      |
| [Start Base Class](#start)                       | `start()`                                         |
| [Stop Base Class](#stop)                         | `stop()`                                          |
| [Start Modules](#turn-on/off-modules-at-runtime) | `start(moduleConstructor \| ModuleConstructor[])` |
| [Stop Modules](#turn-on/off-modules-at-runtime)  | `stop(moduleConstructor \| ModuleConstructor[])`  |
| [Subscribe](#subscribe/unsubscribe)              | `on(eventName, callback)`                         |
| [Unsubscribe](#subscribe/unsubscribe)            | `off(eventName, callback)`                        |
| [Get Event Types](#obtain-event-types)           | `typeof events.<eventName>`                       |
| [Dispose](#dispose-and-clean-up)                 | `dispose()`                                       |

## Full Example

```TypeScript
import { Pointeract, Drag, PreventDefault } from 'pointeract';

const app = document.getElementById('app') as HTMLDivElement;
const options = {
    coordinateOutput: 'absolute',
}
const pointeract = new Pointeract(app, [Drag, PreventDefault], options).start();

const hook = (e: typeof pointeract.events.drag) => {
    console.log(e.detail);
};

// Subscribe to drag events
const unsubscribe = pointeract.on('drag', hook);
// Unsubscribe
unsubscribe();
// Or: pointeract.off('drag', hook);

// Hot update options
options.coordinateOutput = 'relative';

// Pause
pointeract.stop();
// Resume
pointeract.start();
pointeract.stop(PreventDefault); // Disable PreventDefault only

// Dispose
pointeract.dispose();
```