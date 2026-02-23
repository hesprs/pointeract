# Access Types <Badge type="tip" text="TypeScript Only" />

Pointeract implements advanced type orchestration engine, which serves as a key component of its modularity and flexibility.

## Key Concepts

The `Pointeract` class is purely a module loader. It does nothing else than managing module lifecycles. The class comes with some pre-defined **standard events (`StdEvents`)**, some base options (`BaseOptions`), and some class methods and properties.

All the functionalities are achieved by modules, they add custom events and options by extending `StdEvents` and `BaseOptions`, as well as augmenting the `Pointeract` instance by injecting custom methods and properties.

Everything modules extend is done declaratively, and the type orchestration of all options, events and instance properties is done automatically when you load modules.

This architecture can create highly modular apps and nice DX. Here we provide you comprehensive types to ensure you always can access what you need.

:::tip
All the types shown below are designed to be flexible, they accept:

- an array of module constructor types
- an array of module instance types
- nothing (which means no module loaded)

as their type parameters

for example:

```TypeScript
import { Drag, PreventDefault, type Options } from "pointeract";

type MyOptions1 = Options<[Drag, PreventDefault]>;
type MyOptions2 = Options<[typeof Drag, typeof PreventDefault]>;
type MyOptions3 = Options<PreventDefault>;
type MyOptions3 = Options<typeof PreventDefault>;
type MyOptions4 = Options;
```

In the example above, `MyOptions1` and `MyOptions2`, `MyOptions3` and `MyOptions4` are equivalent, `MyOptions4` is the base options.
:::

## Options

Pointeract automatically orchestrates the type of the options when you instantiate the class:

```TypeScript
import { Pointeract, Click } from 'pointeract';

new Pointeract({});
// available options: element, coordinateOutput

new Pointeract({}, Click);
// available options: element, coordinateOutput, clickPreserveTime, moveThreshold
```

If you need to access the type elsewhere, simply use the `Options` export, pass the same modules as the ones in your constructor:

```TypeScript
import { Options, Click } from 'pointeract';

type AvailableOptions = Options<Click>;
// available options: coordinateOutput, element, clickPreserveTime, moveThreshold
```

## Events

Like `Options`, simply use the `Events` export:

```TypeScript
import { Events, Click } from 'pointeract';

type AvailableEvents = Events<Click>;
// available events: pan, zoom, drag, trueClick
```

To use the type of a single event, simply extract one:

```TypeScript
type PanEvents = Events<Click>['pan'];

const onPan = (e: PanEvent) => console.log(e);
```

## Interface

As simple as usual, you can use the `PointeractInterface` exported class:

```TypeScript
import { PointeractInterface, Pointeract, Click } from 'pointeract';

const instance = new Pointeract({}, Click);
type InstanceType = PointeractInterface<Click>;
```

Above, `InstanceType` is exactly the type of `instance`.
