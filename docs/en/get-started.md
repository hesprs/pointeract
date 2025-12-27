# Get Started

## Compatibility

- Supported Browsers: **All Modern Browsers (IE11+)**
- Supported Frameworks: **All**
- Supported Module Standards: **ESM**, **CJS**

## Installation

Install Pointeract using your favorite package manager:

::: code-group
```sh [npm]
$ npm add pointeract
```
```sh [pnpm]
$ pnpm add pointeract
```
```sh [yarn]
$ yarn add pointeract
```
```sh [bun]
$ bun add pointeract
```
:::

Or include the following lines directly in your HTML file:

```html
<script type="module">
    import { Pointeract } from 'https://unpkg.com/pointeract/dist/pointeract.js';
</script>
```

This link ships the latest ESM version by default, to access CJS version or earlier versions, try using a different URL like:

```html
<script src="https://unpkg.com/pointeract@1.0.0/dist/pointeract.cjs"></script>
```

The link above ships version 1.0.0 in CJS.