# Options

## Define Options

Options are defined as an object and passed as the third argument of a Pointeract constructor:

```TypeScript
const options = {
    coordinateOutput: 'absolute',
}
const pointeract = new Pointeract(app, [Drag, PreventDefault], options);
```

## Base Options

Most options are provided by [modules](/modules/), the only exception is `coordinateOutput` which is shipped with the base class:

```TypeScript
type options = {
    coordinateOutput: 'absolute' | 'relative' | 'relativeFraction';
}
```

It defines how the coordinates are output across Pointeract, options are:

- `absolute`: screen coordinates in pixels
- `relative`(default): relative to the top-left corner of the element in pixels
- `relativeFraction`: relative to the top-left corner of the element divided by the element's size

## Update Options

Pointeract uses the same `options` reference passed in the constructor, so you can reactively update options during runtime, or batch update options for many Pointeract instances at once:

```TypeScript
import { Pointeract, WheelPanZoom, Options } from 'pointeract';

const options: Options<typeof WheelPanZoom> = {
    coordinateOutput: 'absolute', // output absolute coordinates
}

const pointeract = new Pointeract(document.body, WheelPanZoom, options);

options.coordinateOutput = 'relative'; // output format instantly changes to relative
```

::: tip
To ensure type safety of options, you can import `Options` from `pointeract` and assign it to your options object, it accepts a single module constructor or a list of modules constructors as type parameter.

You need to use `typeof <ModuleName>` to get the constructor type of the module.
:::
