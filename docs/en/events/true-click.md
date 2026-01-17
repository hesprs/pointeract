# True Click Event

> **Why don't use the built-in `click` event?**
>
> The built-in `click` event is dispatched when the mouse or touch is released on the same element it is pressed. In cases where the element is huge or moves with the pointer, the click event is always dispatched, although the user may not have intended to click.

- **Event Name**: `trueClick`
- **Access Type**: `StdEvents['trueClick']`
- **Details**:

```TypeScript
type event = {
    // ...
    detail: {
        x: number;
        y: number;
        target: EventTarget | null;
        streak: number;
    }
}
```

- `x/y`: The coordinates of the pointer when the click event is triggered.
- `target`: The target element of the click event.
- `streak`: The number of clicks in a streak, you can use this ti detect double/triple/quadruple/any click or tap.
