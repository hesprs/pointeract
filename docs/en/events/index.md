# Events

**See also**: [Create Custom Events](/development/custom-events)

## Standard Events

The following events are parts of Pointeract standard schema:

| Event Name                        | Description (often appears when intending to)     |
| :-------------------------------: | ------------------------------------------------- |
| [`drag`](/events/pan)             | move a single element                             |
| [`pan`](/events/drag)             | move the viewport in a canvas APP                 |
| [`zoom`](/events/drag)            | change the scale of elements / an element         |
| [`trueClick`](/events/true-click) | perform a simple click on an element              |

## Obtain Event Types

Pointeract has an interface export `StdEvents`, which contains all standard event types, access them as follows:

```TypeScript
import { StdEvents } from 'pointeract';
function hook(event: StdEvents['drag']) {
    console.log(event.detail);
}
```

You may also have noticed that Pointeract class has an `events` property, which contains all event types available in a specific instance. This can be helpful if you are using a module that emits custom events. Use them as type hints with `typeof`:

```TypeScript
function hook(event: typeof pointeract.events.drag) {
    console.log(event.detail);
}
```

::: warning
Do not use `pointeract.events.<eventName>` directly as real events, they contain only event types.
:::