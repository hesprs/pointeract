# Custom Events

The events that can be emitted by your modules are not limited to the ones listed in [Standard Events](/events/#standard-events). You can literally emit any event you want.

## Extending `StdEvents` <Badge type="tip" text="TypeScript Only" />

You may have seen a type error when trying to emit a custom event within a module:

```TypeScript
import { BaseModule } from 'pointeract';

class YourModule extends BaseModule {
 onPointerMove = () => {
  this.utils.dispatch('moveMove'); // TypeError: Argument of type '"moveMove"' is not assignable to parameter of type '"pan" | "drag" | "trueClick" | "zoom"'.
 };
}
```

That's because Pointeract aims to provide the best-in-class type safety, if you want to use custom events, you first need to declare your custom events by extending `StdEvents`:

```TypeScript
import { BaseModule } from 'pointeract'; // [!code --]
import { BaseModule, StdEvents } from 'pointeract'; // [!code ++]
interface CustomEvents extends StdEvents { // [!code ++]
 moveMove: CustomEvent; // add an event with no detail // [!code ++]
 moveDetail: CustomEvent<{ x: number; y: number }>; // add an event with detail of coordinates // [!code ++]
} // [!code ++]
```

Then you can pass your custom events to `BaseClass` as a type parameter:

```TypeScript
class YourModule extends BaseModule { // [!code --]
class YourModule extends BaseModule<CustomEvents> { // [!code ++]
 onPointerMove = () => {
  this.utils.dispatch('moveMove'); // no error
  this.utils.dispatch('moveDetail', { x: 0, y: 0 }); // no error
 };
}
```

Then you can dispatch your custom events. Yourself and your module users will gain full type safety.

> **Reference to**:
>
> - [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
