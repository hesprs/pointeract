# Get Started

## Compatibility

- Supported Browsers: **All Modern Browsers (IE11+)**
- Supported Frameworks: **All**
- Supported Module Standards: **ESM**, **CJS**

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

:::

Or include the following lines directly in your HTML file:

```html
<script type="module">
	import { Pointeract } from 'https://unpkg.com/pointeract/dist/index.js';
</script>
```

This link ships the latest ESM version by default, to access CJS version or earlier versions, try using a different URL like:

```html
<script src="https://unpkg.com/pointeract@1.0.1/dist/index.cjs"></script>
```

The link above ships version 1.0.1 in CJS.

## Kickstart

Simply grab the core class and a module:

```TypeScript
import { Pointeract, Drag } from 'pointeract';

new Pointeract({ element: yourElement }, Drag)
    .start()
    .on('drag', e => console.log(e));
```

Congratulations! You can now press your mouse or finger to the element and move, the console will log events like a waterfall.

**Read next**: dive into the usage of Pointeract in [Use Pointeract](/basic/use-pointeract).
