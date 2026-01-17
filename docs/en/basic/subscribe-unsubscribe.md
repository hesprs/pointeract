# Subscribe/Unsubscribe

## Subscribe

Use `on()` to subscribe, the usage is similar to `addEventListener()`, but is fully typed and returns the corresponding unsubscribe function.

Pointeract utilizes native [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) internally, the events are `CustomEvent`s and event data is stored in `e.detail`.

```TypeScript
const hook = (e: typeof pointeract.events.drag) => {
    console.log(e.detail);
};
const unsubscribe = pointeract.on('drag', hook);
```

## Unsubscribe

Use `off()` or returned unsubscribe functions to unsubscribe, also similar to `removeEventListener()`:

```TypeScript
unsubscribe();
// or:
pointeract.off('drag', hook);
```

::: tip
Its good practice to unsubscribe all the events **before** the disposal of a Pointeract instance.
:::
