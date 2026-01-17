# Wheel Pan Zoom Module

This module monitors wheel events, resolves them and emits pan/zoom events. It supports touchpad gestures and different control schemas, and is able to automatically change the control schema based on the user's behavior.

**Events**: [`pan`](/events/pan) [`zoom`](/events/zoom)

## Control Schemas

**Normal Control Schema**: uses the mouse wheel to zoom.

**Professional Control Schema**:

- **Zoom**: mouse wheel + `ctrl` key
- **Pan Horizontally**: mouse wheel + `shift` key
- **Pan Vertically**: mouse wheel

::: info
Most devices with touchpad interpret touchpad gestures as mouse wheel + key press. So professional control schema enables critical touchpad support.
:::

## Loading

```TypeScript
import { WheelPanZoom, Pointeract } from 'pointeract';
const pointeract = new Pointeract(app, WheelPanZoom);
```

## Options

```TypeScript
type options = {
    proControlSchema: boolean;
    lockControlSchema: boolean;
 zoomFactor: number;
}
```

- `proControlSchema`: Whether to use the professional control schema, you can reactively change this during runtime. Defaults to **false**.
- `lockControlSchema`: Whether to disable schema auto-detection. Defaults to **false**.
- `zoomFactor`: How fast it zooms. Defaults to **0.1**.
