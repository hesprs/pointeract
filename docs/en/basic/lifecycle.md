# Lifecycle

## Instantiation

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

Finally, you may want to define options, read elaboration in [Options](./options):

```TypeScript
const options = {
    coordinateOutput: 'absolute',
}
```

Now, you can create a Pointeract instance by passing the element, modules, and options in a row, note that the `options` is optional:

```TypeScript
const pointeract = new Pointeract(app, [Drag, PreventDefault], options);
```

::: info
Pointeract uses TypeScript generics to smartly infer the types of options and events available by scanning every module passed into the constructor.
:::

## Start

Pointeract does not do anything after initialization by design, make it running by calling `start()`:

```TypeScript
pointeract.start();
```

::: tip
`start()` returns the instance itself, so you can chain it:

```TypeScript
const pointeract = new Pointeract(app, [Drag, PreventDefault]); // [!code --]
const pointeract = new Pointeract(app, [Drag, PreventDefault]).start(); // [!code ++]
```

:::

## Stop

To stop Pointeract, call `stop()`:

```TypeScript
pointeract.stop();
```

::: tip
`stop()` also returns the class instance and does not destroy it. You can start it again later:

```TypeScript
pointeract.stop();
// ... some logic here
pointeract.start();
```

:::

## Disposal

To completely dispose Pointeract, call `dispose()`:

```TypeScript
pointeract.dispose();
```

::: tip
You don't need to call `stop()` before disposal, `dispose()` handles everything for you.
:::
