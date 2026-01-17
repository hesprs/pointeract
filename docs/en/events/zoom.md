# Zoom Event

- **Event Name**: `zoom`
- **Access Type**: `StdEvents['zoom']`
- **Details**:

```TypeScript
type event = {
    // ...
    detail: {
        x: number;
        y: number;
        factor: number;
    }
}
```

- `x/y`: The coordinates of the zoom origin.
- `factor`: The zoom factor, smaller than 1 zooms out, larger than 1 zooms in.
