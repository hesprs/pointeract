# Swipe Module

This module handles swipe interactions, events are dispatched when a single (or multiple) touch or mouse is pressed and moved in a specific direction.

**Event**: [`swipe`](/events/swipe)

## Loading

```TypeScript
import { Swipe, Pointeract } from 'pointeract';
const pointeract = new Pointeract({ element: app }, [Swipe]);
```

## Options

```TypeScript
interface Options extends BaseOptions {
	minDistance?: number;
	minVelocity?: number;
	velocityWindow?: number;
	pointers?: number;
	groupingWindow?: number;
}
```

- `minDistance`: The minimum distance in pixels that the pointer must move to be considered a swipe. Defaults to **20**.
- `minVelocity`: The minimum velocity in pixels per second that the pointer must move to be considered a swipe. Defaults to **0**.
- `velocityWindow`: The time window in milliseconds used to calculate the velocity of the swipe. Defaults to **100**.
- `pointers`: The minimum number of pointers that must have swiped in the same direction for a combined swipe event to be emitted. When set to `1` (default), every valid single-pointer swipe fires immediately. When set to `N > 1`, per-pointer events are suppressed and only the combined event fires once `N` pointers have swiped in the same direction within `groupingWindow` ms.
- `groupingWindow`: The time window in milliseconds within which concurrent pointer swipes are grouped into a combined event. Defaults to **100**.
