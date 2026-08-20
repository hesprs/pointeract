# Swipe Event

- **Event Name**: `swipe`
- **Access Type**: `Events['swipe']`
- **Details**:

```TypeScript
type SwipeEvent = {
    direction: string;
    velocity: number;
    angle: number;
    streak: number;
    duration: number;
    displacement: number;
}
```

- `direction`: the direction of the swipe. Configured by [`swipeDirectionMap`](/modules/swipe#options), if no map is defined, cardinal directions (`left`, `right`, `up`, `down`) are used.
- `velocity`: the average velocity of the swipe across all contributing pointers, calculated as distance divided by time (**px/ms**).
- `streak`: the streak of pointers that contributed to this swipe. Similar to [`streak` in `trueClick` event](/events/true-click), but for swipes. This field can be used to detect swipes with multiple pointers.
- `duration`: the time elapsed from the first recorded position to pointer-up (**ms**).
- `displacement`: the straight-line distance from the start position to the end position (**px**).
- `angle`: the angle in radians of the displacement vector relative to the positive x-axis, ranges from **π** to **-π**.

## Event Emission Behaviour

Each pointer that completes a valid swipe emits an event immediately. If other pointers have recently completed swipes in the same direction (within the [`swipeStreakWindow`](/modules/swipe)), the `streak` field of the event will be the total number of valid swipes (including this one); otherwise, the `streak` field will be `1`.
