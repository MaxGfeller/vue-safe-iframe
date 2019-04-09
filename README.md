# vue-safe-iframe

Display raw HTML code safely in an iFrame.

## Usage

The module can be initialzed as follows:

```javascript
import VueSafeIframe from 'vue-safe-iframe'

Vue.use(VueSafeIframe)
```

The component `vue-safe-iframe` is the automatically available in all
your components.

### Props

The following props can be defined:

| Prop               | Description                                                                                          | Default value |
|--------------------|------------------------------------------------------------------------------------------------------|---------------|
| `html`             | Raw HTML code that should be displayed inside iFrame                                                 | ""            |
| `openLinksInFrame` | If links inside the iFrame should be opened in the same frame, per default they open in a new window | false         |
| `allowScripts`     | If script should be allowed                                                                          | false         |
| `allowHrefTargets` | Enable links to have a `target`                                                                      | false         |
| `csp`              | Define a CSP for the page                                                                            | null          |
| `stylesheet`       | Set a stylesheet that should be applied on the iFrame                                                | null          |

## License

Copyright 2019 Max Gfeller

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
