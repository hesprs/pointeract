# Pan Event

- **Event Name**: `pan`
- **Access Type**: `StdEvents['pan']`
- **Details**:

```TypeScript
type event = {
    // ...
    detail: {
        x: number;
        y: number;
    }
}
```

- `x/y`: Amount of pan - the difference between the current position and the position of the last dispatch.