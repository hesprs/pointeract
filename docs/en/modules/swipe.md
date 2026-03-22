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
}
```

- `minDistance`: The minimum distance in pixels that the pointer must move to be considered a swipe. Defaults to **20**.
- `minVelocity`: The minimum velocity in pixels per second that the pointer must move to be considered a swipe. Defaults to **0**.
- `velocityWindow`: The time window in milliseconds used to calculate the velocity of the swipe. Defaults to **100**.
- `pointers`: The number of pointers that must be active for the swipe event to be dispatched. Defaults to **1**.
