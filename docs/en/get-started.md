# Get Started

## Compatibility

- Supported Browsers: **All Modern Browsers (IE11+)**
- Supported Frameworks: **All**
- Supported Module Standards: **ESM**

## Installation

Install Pointeract using your favorite package manager:

::: code-group

```sh [npm]
npm add pointeract
```

```sh [pnpm]
pnpm add pointeract
```

```sh [yarn]
yarn add pointeract
```

```sh [bun]
bun add pointeract
```

```sh [deno]
deno add jsr:@hesprs/pointeract
```

:::

Or include the following lines directly in your HTML file:

```html
<script type="module">
  import { Pointeract } from 'https://unpkg.com/pointeract';
</script>
```

This link ships the latest ESM version by default.

## Start

Simply grab the core class and a module:

```TypeScript
import { Pointeract, Drag } from 'pointeract';

new Pointeract({ element: yourElement }, [Drag])
    .start()
    .on('drag', e => console.log(e));
```

Congratulations! You can now press your mouse or finger to the element and move, the console will log events like a waterfall.

**Read next**: dive into the usage of Pointeract in [Use Pointeract](/basic/use-pointeract).
