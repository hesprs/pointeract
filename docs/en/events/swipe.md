# Swipe Event

- **Event Name**: `swipe`
- **Access Type**: `Events['swipe']`
- **Details**:

```TypeScript
type SwipeEvent = {
    direction: 'left' | 'right' | 'up' | 'down';
    velocity: number;
}
```

- `direction`: the direction of the swipe.
- `velocity`: the velocity of the swipe, calculated as the distance of the swipe divided by the time it took to complete the swipe (**px/ms**).
