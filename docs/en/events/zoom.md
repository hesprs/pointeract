# Zoom Event

- **Event Name**: `zoom`
- **Access Type**: `Events['zoom']`
- **Details**:

```TypeScript
type ZoomEvent = {
    x: number;
    y: number;
    factor: number;
}
```

- `x`, `y`: The coordinates of the zoom origin.
- `factor`: The zoom factor, smaller than 1 zooms out, larger than 1 zooms in.

## Smooth Zooming

Pointeract supports using [`Lubricator`](/modules/lubricator) to smoothify `zoom` events. You can use the `zoomPreset` or customize yourself:

```TypeScript
import { WheelPanZoom, Lubricator, Pointeract, zoomPreset as zoom } from 'pointeract';

new Pointeract({
    element: app,
    lubricator: { zoom },
}, [WheelPanZoom, Lubricator])
```
