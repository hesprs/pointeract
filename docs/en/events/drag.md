# Drag Event

- **Event Name**: `drag`
- **Access Type**: `Events['drag']`
- **Details**:

```TypeScript
type DragEvent = {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
}
```

- `deltaX`, `deltaY`: the amount of drag - the difference between the current position and the position of the last dispatch.
- `x`, `y`: The position of the pointer when the drag event is triggered.

## Smooth Dragging

Pointeract supports using [`Lubricator`](/modules/lubricator) to smoothify `drag` events. For quick config, you can use presets:

```TypeScript
import { Drag, Lubricator, Pointeract, dragPreset as drag } from 'pointeract';

new Pointeract({
    element: app,
    lubricator: { drag },
}, [Drag, Lubricator])
```
