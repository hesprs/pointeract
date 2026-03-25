# Swipe Event

- **Event Name**: `swipe`
- **Access Type**: `Events['swipe']`
- **Details**:

```TypeScript
type SwipeEvent = {
    direction: 'left' | 'right' | 'up' | 'down'
             | 'up-left' | 'up-right' | 'down-left' | 'down-right';
    velocity: number;
    pointerNumber: number;
    duration: number;
    displacement: number;
}
```

- `direction`: the direction of the swipe. Cardinal directions (`left`, `right`, `up`, `down`) are used when the movement is within ±22.5° of the axis; diagonal directions (`up-left`, `up-right`, `down-left`, `down-right`) cover the remaining 45° sectors.
- `velocity`: the average velocity of the swipe across all contributing pointers, calculated as distance divided by time (**px/ms**).
- `pointerNumber`: the number of pointers that contributed to this swipe. `1` for a single-pointer swipe; `N` for a multi-pointer combined swipe.
- `duration`: the time elapsed from the first recorded position to pointer-up (**ms**).
- `displacement`: the straight-line distance from the start position to the end position (**px**).

## Event Emission Behaviour

Each pointer that completes a valid swipe emits an event immediately with `pointerNumber: 1`. If other pointers have recently completed swipes in the same direction (within the `groupingWindow`), an additional combined event is emitted with `pointerNumber` equal to the total number of matching pointers.

When `options.pointers` is set to a value greater than `1`, per-pointer events are suppressed and only the combined event fires once enough matching pointers have swiped.
