# Modifier <Badge type="tip" text="Experimental" />

Since all tasks Pointeract does is to dispatch all kinds of events, once you've controlled the channel of events, you would own the absolute power of Pointeract.

Modifier is such a powerful tool that allows you to read, intercept, and modify all events before they are dispatched.

## Define a Modifier

Use the `modifier` hook in a module to define a modifier, the first argument is the event name, the second argument is the event detail:

```TypeScript
class BaseModule {
    modifier?: (...args: [string, unknown]) => ModifierReturn;
}

type ModifierReturn = true | false | { name: string; detail: unknown };
```

## Modifier Return

- `true`: The event will be kept as-is and dispatched.
- `false`: The event will be ignored.
- `{ name: string; detail: unknown }`: The event will be renamed and dispatched.

```TypeScript
class YourModule extends BaseModule {
    private zoomCount = 0;
    modifier = (name) => {
        if (name !== 'zoom') return true;
        this.zoomCount++;
        console.log(`Zoom has been dispatched for ${this.zoomCount} times.`);
        return true;
    }
}
```

The example above monitors the zoom event and logs the number of times it has been dispatched. It keeps all  events unchanged.

::: info
When multiple modifiers are used, the first modifier that does not return `true` will be the only one that is executed.
:::