# Prevent Default Module

This module disables all default browser behaviors related to touch / mouse / wheel events about the target element. After starting pointeract, the prevention is started, when the class is disposed or stopped, the prevention will be stopped as well.

## Loading

```TypeScript
import { PreventDefault, Pointeract } from 'pointeract';
const pointeract = new Pointeract({ element: app }, PreventDefault);
```
