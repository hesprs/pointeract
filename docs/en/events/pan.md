# Pan Event

- **Event Name**: `pan`
- **Access Type**: `Events['pan']`
- **Details**:

```TypeScript
type PanEvent = {
    deltaX: number;
    deltaY: number;
}
```

- `deltaX`, `deltaY`: Amount of pan - the difference between the current position and the position of the last dispatch.

## Smooth Panning

Pointeract supports using [`Lubricator`](/modules/lubricator) to smoothify `pan` events. You can use the `panPreset` or customize yourself:

```TypeScript
import { WheelPanZoom, Lubricator, Pointeract, panPreset as pan } from 'pointeract';

new Pointeract({
    element: app,
    lubricator: { pan },
}, [WheelPanZoom, Lubricator])
```
