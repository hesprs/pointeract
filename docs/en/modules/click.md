# Click Module

The click module in checks whether the mouse/touch has actually moved during down and up, and dispatches events when the it has not moved.

**Event**: [`trueClick`](/events/true-click)

## Loading

```TypeScript
import { Click, Pointeract } from 'pointeract';
const pointeract = new Pointeract(app, Click);
```

## Options

```TypeScript
type options = {
    clickPreserveTime: number;
    moveThreshold: number;
}
```

- `clickPreserveTime`: The interval in milliseconds between which two click event are considered in a streak. Defaults to **400**.
- `moveThreshold`: The upper limit in pixels for pointer movement to be considered a click. Defaults to **5**.