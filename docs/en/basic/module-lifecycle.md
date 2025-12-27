# Module Lifecycle

## Instantiation

All modules are instantiated when a Pointeract instance is constructed.

## Start and Stop

To turn on/off modules at runtime, also use `start()` and `stop()`. For these two methods, if you do not pass any arguments, they will start/stop the Pointeract instance; otherwise the specified modules. All modules passed in are enabled by default at Pointeract construction.

You start/stop modules by passing in the **constructors** of modules, the methods accept a single module or an array of modules:

```TypeScript
pointeract.start(PreventDefault); // single module
pointeract.stop([PreventDefault, Drag]); // multiple modules
```

::: tip
Note that the start/stop of modules are independent to the start/stop of the base class: when the base class is stopped, all modules will be paused; but when the base class is started, only modules not explicitly stopped will be resumed. E.g.:

```TypeScript
// remember we have modules PreventDefault and Drag
pointeract.stop(); // everything is paused
pointeract.stop(PreventDefault); // no apparent change, but PreventDefault is disabled at module level
pointeract.start(); // only the base class and Drag are started
pointeract.start(PreventDefault); // PreventDefault will not be restarted unless explicitly reenabled here
```
:::

::: warning
You cannot start/stop a module that is not passed into the Pointeract constructor.
:::

## Disposal

All modules of a instance are collectively disposed when the `dispose()` it is called.