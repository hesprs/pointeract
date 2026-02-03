# What's Pointeract?

Pointeract is a tiny JavaScript/TypeScript utility library focusing on one thing - handling user interactions with DOM elements, e.g. multitouch and touchpad.

With the unique strength of versatile typings in TypeScript and its dynamic nature, Pointeract have achieved a highly _modular, extendable and efficient_ architecture. Its core bundle size is only **1KB** minified + gzipped, functionalities come from also byte-sized modules. It's fully **tree-shakable**, the fewer modules you use, the smaller your bundle is.

To use it, one only needs to bind a DOM element and load some modules, and it will start monitoring user interactions and dispatch consumable events like `pan` and `zoom`.

## Advantages

- **🐣 Tiny**: With base **1KB** minified and gzipped, **1-2KB** for normal usage.
- **🦾 Robust**: Excels at complex gestures where most interaction libraries fail, [Why?](/development/testing#monkey-test)
- **🧩 Extensible**: Extend Pointeract effortlessly via our module API.
- **🔌 Flexible during Runtime**: Options are updated reactively. Stop/start any module during runtime.
- **🛡️ Safe**: Not modifying the DOM (except the `PreventDefault` module). Meticulous clean up prevents memory leaks.

## Currently Supported Features

- **Click (Double Click, Triple Click, Quadruple Click, Any Click)**
- **Drag**
- **Pan and Zoom via Mouse Wheel (`ctrl`/`shift` key binding, touchpad support)**
- **Pan and Zoom via Multitouch (Pan, Pinch)**
- **One-line Prevent Default**
- **Smooth Everything (drag / pan / zoom / any interaction involving numbers)**

Those interactions are shipped via modules, which can be composed from a single drag-and-drop to a canvas app.

Missing your desired interaction? [Write your own module](/development/custom-modules)!

## How Pointeract Stands Out?

There're already plenty of interaction libraries out there, most famous ones are `Interact.js` and `Hammer.js`, but Pointeract is different.

| Criteria                                                  |                      Pointeract                       |     [Hammer.js](https://hammerjs.github.io)      |        [Interact.js](https://interactjs.io)         |
| :-------------------------------------------------------- | :---------------------------------------------------: | :----------------------------------------------: | :-------------------------------------------------: |
| Written in TypeScript?                                    |                          ✅                           |                        ❌                        |                         ✅                          |
| Tree-shakeable?                                           |   [✅](https://bundlephobia.com/package/pointeract)   | [❌](https://bundlephobia.com/package/hammerjs)  |  [❌](https://bundlephobia.com/package/interactjs)  |
| Total Bundle Size (Minified + Gzipped)                    | 👑 [3KB](https://bundlephobia.com/package/pointeract) | [7KB](https://bundlephobia.com/package/hammerjs) | [28KB](https://bundlephobia.com/package/interactjs) |
| Last Updated                                              |                👑 Actively Maintained                 |                       2015                       |                        2023                         |
| Features                                                  |        Pointer and Wheel Related + Some Utils         |                 Pointer Related                  | 👑 Pointer and Wheel Related + Comprehensive Utils  |
| Robust? (See [Testing](/development/testing#monkey-test)) |                          ✅                           |                 ❌ Element Jerks                 |         ❌ Element Ignores the Second Touch         |
| Extensible?                                               |                          ✅                           |                        ❌                        |                         ❌                          |

## License

Pointeract is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
