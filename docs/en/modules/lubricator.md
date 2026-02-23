# Lubricator Module

Lubricator digests raw events and produces smoothified interactions.

This module is a functional module, itself doesn't recognize any gesture. Instead, it intercepts all configured events that is to be dispatched via the [modifier API](/development/custom-modules#modifiers). It then interpolates them and emit smoothified events.

It is not dependent on any modules or events. Instead, it exposes a comprehensive configuration API that enables the interpolation on any events.

## Loading

```TypeScript
import { Lubricator, Pointeract, Drag, dragPreset as drag } from 'pointeract';
const pointeract = new Pointeract({
    element: app,
    lubricator: { drag },
}, [Lubricator, Drag]);
```

## Options

Lubricator requires a granular configuration of what and how to interpolate an event:

```TypeScript
interface Options extends BaseOptions {
    lubricator?: {
        // this is the configuration for each event
        [Key: string]?: {
            decayFactor: number;
	        fields: {
                // this is the configuration for each field in the emitted event
                [Key: string]?: {
                    countType: 'sum' | 'product';
                    diminishBoundary: number;
                };
            };
        };
    };
}
```

The direct children of `lubricator` consists any amount of fields, where the keys are the name of events to intercept (i.e. to smooth), and the values are configurations per-event.

In **per-event** configuration:

`decayFactor`: controls how fast it interpolates, i.e., how the smoothified event lags behind the real-time interaction. The lower this value is, the more smooth interactions are.

`fields`: the names of fields in the event to interpolate, the fields must be the type `number`, you can find the fields of events in the [event types](/basic/types#events). The values of the items in `fields` are configurations per-field.

In **per-field** configuration:

`countType`: defines the interpolation goal:

- `sum`: the aggregate sum of this field in the interpolated events must be equal to the sum of raw interaction. Typical for `deltaX`, `deltaY` in `pan` event.
- `product` the aggregate product if this field in the interpolated events must be equal to the product the raw interaction. Typical for `factor` in `zoom` event.

`diminishBoundary`: defines the threshold for the final dispatch.

- interpolation is infinite if you don't manually define a boundary. If the difference between the real dispatch and raw is smaller than this boundary, the interpolation will stop and lubricator will dispatch a final event to make the aggregate interpolation equal the raw.

In the following example, we will smoothify `zoom` event:

```TypeScript
import { WheelPanZoom, Lubricator, Pointeract } from 'pointeract';

new Pointeract({
    element: app,
    lubricator: {
        zoom: {
            decayFactor: 0.25,
            fields: {
                factor: {
                    countType: 'product',
                    diminishBoundary: 0.01,
                },
            },
        },
    },
}, [WheelPanZoom, Lubricator])
```

In this example, we've configured Lubricator to intercept event `zoom`, interpolate the `factor` field in it with product goal and stops when the leftover zoom factor is less than 0.01.

## Presets

Lubricator provides configuration presets the events, currently available ones are:

- `panPreset`: targets `pan` event
- `zoomPreset`: targets `zoom` event
- `dragPreset`: targets `drag` event

To use them, simply import them from `pointeract` and plug them into your options:

```TypeScript
import { WheelPanZoom, Lubricator, Pointeract, panPreset as pan, zoomPreset as zoom } from 'pointeract';

new Pointeract({
    element: app,
    lubricator: { pan, zoom },
}, [WheelPanZoom, Lubricator])
```
