# Multitouch Pan Zoom Module

This module monitors touches on the screen.

- Pan events are emitted when the position of midpoint between two touches changes.
- Zoom events are emitted when the distance between two touches changes.

**Events**: [`pan`](/events/pan) [`zoom`](/events/zoom)

## Loading

```TypeScript
import { MultitouchPanZoom, Pointeract } from 'pointeract';
const pointeract = new Pointeract(app, MultitouchPanZoom);
```
