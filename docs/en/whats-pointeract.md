# What's Pointeract?

Pointeract is a tiny utility library focusing on one thing - handling user interactions with DOM elements. It is fully typed, small, and easy to use. You need to bind your DOM elements, load some modules, and it will start monitoring user interactions and dispatch events like `trueClick` and `pan` with data.

It is build in an extensible architecture with base bundle size only **1KB** minified + gzipped, functionalities come from also byte-sized modules. So it's fully **tree-shakable**, the fewer modules you use, the smaller your bundle is.

It does not modify the DOM, which gives full control of how your app should like. If you need ready to use DOM manipulation, consider [Dragula](https://bevacqua.github.io/dragula/) or [React Pan Zoom Pinch](https://github.com/prc5/react-zoom-pan-pinch).

## Advantages

- **🐣 Tiny**: With base **1KB** minified and gzipped, **1-2KB** for normal usage.
- **💪 Robust**: Excels at complex gestures where most interaction libraries fail, [Why?](/development/testing#chaotic-testing)
- **🧩 Extensible**: Extend Pointeract effortlessly via our module API.
- **🔌 Flexible during Runtime**: Options are updated reactively. Stop/start any module during runtime.
- **🛡️ Safe**: Not modifying the DOM (except the `PreventDefault` module). Meticulous clean up prevents memory leaks.

## Currently Supported Interactions

- **Click (Double Click, Triple Click, Quadruple Click, Any Click)**
- **Drag**
- **Pan and Zoom via Mouse Wheel (`ctrl`/`shift` key binding, touchpad support)**
- **Pan and Zoom via Multitouch (Pan, Pinch)**

Those interactions are shipped via modules, which can be composed from a single drag-and-drop to a canvas app.

Missing your desired interaction? [Write your own module](/development/custom-modules)!

## How Pointeract Stands Out?

There're already plenty of interaction libraries out there, most famous ones are `Interact.js` and `Hammer.js`, but Pointeract is different.

| Criteria                                                      | Pointeract                                            | [Hammer.js](https://hammerjs.github.io)          | [Interact.js](https://interactjs.io)                |
|:--------------------------------------------------------------|:-----------------------------------------------------:|:------------------------------------------------:|:---------------------------------------------------:|
| Written in TypeScript?                                        | ✅                                                    | ❌                                               | ✅                                                  |
| Tree-shakeable?                                               | [✅](https://bundlephobia.com/package/pointeract)     | [❌](https://bundlephobia.com/package/hammerjs)  | [❌](https://bundlephobia.com/package/interactjs)   |
| Bundle Size (Minified + Gzipped)                              | 👑 [2KB](https://bundlephobia.com/package/pointeract) | [7KB](https://bundlephobia.com/package/hammerjs) | [28KB](https://bundlephobia.com/package/interactjs) |
| Last Updated                                                  | 👑 Actively Maintained                                | 2015                                             | 2023                                                |
| Features                                                      | Pointer and Wheel Related                             | Pointer Related                                  | 👑 Pointer and Wheel Related + Comprehensive Utils  |
| Robust? (See [Testing](/development/testing#chaotic-testing)) | ✅                                                    | ❌ Element Jerks                                 | ❌ Element Ignores the Second Touch                 |
| Extensible?                                                   | ✅                                                    | ❌                                               | ❌                                                  |

## License

Pointeract is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).