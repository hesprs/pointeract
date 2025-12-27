# Custom Options

Pointeract inherits the same `options` reference from the constructor across the base class and all modules.

## Define Options

Simply use the `options` property to define options with their default values:

```TypeScript
import { BaseModule } from 'pointeract';

class YourModule extends BaseModule {
	options = {
        customModule: true,
    };
}
```

Pointeract will process options in your modules, when the user of your module passes the it into Pointeract, they will get full type completions.

## Use Options

Simply use the options you just defined in your module:

```TypeScript
class YourModule extends BaseModule {
    onPointerMove = () => {
        if (this.options.customModule) console.log('custom module is enabled');
    }
}
```

Your options will be merged into the user options passed into Pointeract. So when you access your options, it's already polyfilled with the user's options.