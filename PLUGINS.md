LuxUI Plugins
=============

LuxUI provides the ability for applications to "bring their own tools" and
augment or change the way the framework renders the UI through plugins. More
likely than not these plugins, that applications are going to need, are going
to be for form field components.

## Form Field Components

The basic structure of a rendered form field is:

```
container (div or li)
  label
  data-input; either:
    single element (input, textarea, select, etc.),
    group of inputs (inputs, checkboxes, radios, etc.), or
    meta type component (list, or table)
  datalist (optional)
  helper text (optional)
  error messaging (optional)
```

## Using Plugins

If an existing plugin is what your application needs then using the plugin is
extremely easy.

```javascript
import luxReact from '@luxui/luxReact';
import customPlugin from '@custom/plugin';
import anotherPlugin from '@another/plugin';

const app = luxReact(config);

app
  .component('CustomPlugin', customPlugin)
  .component('AnotherPlugin', anotherPlugin);
```

Many of the LuxUI implementation modules - ReactJS (`src/react/`) - use this
definition method for components should you like to see working examples.

## Developing Custom Plugins

Components within a LuxUI application can "opt-in" to be provided with a context
object; check the docs pages on `react/appContext` for more info.

TODO
