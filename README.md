# x-float
Floating UI plugin for Alpine.js

## Installation
Grab this repository to `path/to/x-float`. Then initialize it from your bundle:

```js
import Alpine from 'alpinejs'
import float from '/path/to/x-float/src/index.js'
 
Alpine.plugin(float)
```

## x-float

```html
<div x-data="{ foo: false }" class="relative">
    <button @click="foo = !foo" x-ref="bar">Button</button>

    <div @click.outside="foo = false" x-float:bar="foo" class="absolute top-0 left-0 w-max">
        Floated content
    </div>
</div>
```
