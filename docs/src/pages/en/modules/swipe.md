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
	swipeMinDistance?: number;
	swipeMinVelocity?: number;
	swipeVelocityWindow?: number;
	swipeStreakWindow?: number;
    swipeDirectionMap?: Record<string, number>;
}
```

- `swipeMinDistance`: The minimum distance in pixels that the pointer must move to be considered a swipe. Defaults to **20**.
- `swipeMinVelocity`: The minimum velocity in pixels per second that the pointer must move to be considered a swipe. Defaults to **0**.
- `swipeVelocityWindow`: The time window in milliseconds used to calculate the final velocity of the swipe. Defaults to **200**.
- `swipeStreakWindow`: The time window in milliseconds within which concurrent pointer swipes are grouped into a combined event. Defaults to **400**.
- `swipeDirectionMap`: The map of direction names with their boundary values of the angles that split a circle. The keys are the values of `direction` field in the [swipe event](/events/swipe). You can use this field to detect custom swipe directions, such diagonal directions. See detailed explanation [below](#direction-map).

## Direction Map

The direction map is an object that maps direction names to their boundary values of the angle. During a swipe, the module traverses the map in anticlockwise order and finds the first entry whose boundary value is greater than the angle of the swipe. Since the angle is represented in radians internally from **π** to **-π**, so the values of the boundary angles should also be in this range.

For example, the default direction map when you pass no map into the options is:

```TypeScript
const defaultDirectionMap = {
	left: -(Math.PI / 4) * 3, // -135 degrees
	down: -Math.PI / 4,       // -45 degrees
	right: Math.PI / 4,       // 45 degrees
	up: (Math.PI / 4) * 3,    // 135 degrees
};
```

This map outlines the boundary values of four cardinal directions, and makes the module recognize swipes in `'left' | 'down' | 'right' | 'up'` directions.

To detect swipes only in diagonal directions or in eight directions, you can pass maps like this:

```TypeScript
const diagonalDirectionMap = {
	'down-left': -Math.PI / 2, // -90 degrees
	'down-right': 0,           // 0 degrees
	'up-right': Math.PI / 2,   // 90 degrees
	'up-left': Math.PI,        // 180 degrees
};

const eightDirectionMap = {
	left: -(Math.PI / 8) * 7,        // -157.5 degrees
	'down-left': -(Math.PI / 8) * 5, // -112.5 degrees
	down: -(Math.PI / 8) * 3,        // -67.5 degrees
	'down-right': -Math.PI / 8,      // -25.5 degrees
	right: Math.PI / 8,              // 25.5 degrees
	'up-right': (Math.PI / 8) * 3,   // 67.5 degrees
	up: (Math.PI / 8) * 5,           // 112.5 degrees
	'up-left': (Math.PI / 8) * 7,    // 157.5 degrees
};
```

The above two maps are included into the package exports.
