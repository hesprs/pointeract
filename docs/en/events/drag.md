# Drag Event

- **Event Name**: `drag`
- **Access Type**: `StdEvents['drag']`
- **Details**:

```TypeScript
type event = {
    // ...
    detail: {
        x: number;
        y: number;
        clientX: number;
        clientY: number;
    }
}
```

- `x/y`: the amount of drag - the difference between the current position and the position of the last dispatch.
- `clientX/clientY`: The position of the pointer when the drag event is triggered.
