<h1 align="center">
  Pointeract
  <br>
</h1>

<h4 align="center"> 🖱️🤏 lightweight, robust and extensible human gesture detector </h4>

<p align="center">
    <a href="https://pointeract.consensia.cc/playground">
        <strong>Demo</strong>
    </a> • 
    <a href="https://pointeract.consensia.cc">
        <strong>Documentation</strong>
    </a> • 
    <a href="https://www.npmjs.com/package/pointeract">
        <strong>npm</strong>
    </a>
</p>

## Get Started

Install Pointeract using your favorite package manager:

```sh
# npm
npm add pointeract

# pnpm
pnpm add pointeract

# yarn
yarn add pointeract

# bun
bun add pointeract
```

Or include the following lines directly in your HTML file:

```html
<script type="module">
  import { Pointeract } from 'https://unpkg.com/pointeract';
</script>
```

This link ships the latest ESM version by default.

Then simply grab the core class and a module:

```TypeScript
import { Pointeract, Drag } from 'pointeract';

new Pointeract({ element: yourElement }, [Drag])
    .start()
    .on('drag', e => console.log(e));
```

Congratulations! You can now press your mouse or finger to the element and move, the console will log events like a waterfall.

**Read next**: dive into the usage of Pointeract in [Use Pointeract](https://pointeract.consensia.cc/basic/use-pointeract).

## Currently Supported Features

- **Click (Double Click, Triple Click, Quadruple Click, Any Click)**
- **Drag**
- **Swipe (All directions, single / multiple fingers)**
- **Pan and Zoom via Mouse Wheel (`ctrl`/`shift` key binding, touchpad support)**
- **Pan and Zoom via Multitouch (Pan, Pinch)**
- **One-line Prevent Default**
- **Smooth Everything (drag / pan / zoom / any interaction involving numbers)**

Those interactions are shipped via modules, which can be composed from a single drag-and-drop to a canvas app.

Missing your desired interaction? [Write your own module](https://pointeract.consensia.cc/development/custom-modules)!

## Copyright and License

Copyright ©️ 2025-2026 Hesprs (Hēsperus) | [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
