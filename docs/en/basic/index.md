# Base Class

Everything Pointeract does is based on this class.

## TL;DR CheatSheet

| Description                                             | Method                                            |
| ------------------------------------------------------- | ------------------------------------------------- |
| [Instantiate the Class](/basic/lifecycle#instantiation) | `new Pointeract(element, modules, options?)`      |
| [Start Base Class](/basic/lifecycle#start)              | `start()`                                         |
| [Stop Base Class](/basic/lifecycle#stop)                | `stop()`                                          |
| [Start Modules](/basic/module-lifecycle#start-and-stop) | `start(moduleConstructor \| ModuleConstructor[])` |
| [Stop Modules](/basic/module-lifecycle#start-and-stop)  | `stop(moduleConstructor \| ModuleConstructor[])`  |
| [Subscribe](/basic/subscribe-unsubscribe#subscribe)     | `on(eventName, callback)`                         |
| [Unsubscribe](/basic/subscribe-unsubscribe#unsubscribe) | `off(eventName, callback)`                        |
| [Get Event Types](/events/#obtain-event-types)          | `typeof events.<eventName>`                       |
| [Dispose](/basic/lifecycle#disposal)                    | `dispose()`                                       |

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
