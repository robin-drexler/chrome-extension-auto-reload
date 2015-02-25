## What?
Reloads all unpacked extension whenever a file is changed in an extension that is currently under development.
You'll never need to go to `chrome://extensions` and smash reload again.

## How
Extension tries to connect to socket.io server on `http://localhost:8890` (yes, that port is random) and waits for `file.change` events to flow in.
When an event is incoming, the extension reloads `chrome://extensions` automatically, which causes all unpacked extensions to reload and update (e.g. content scripts).
If there is no open tab, currently at `chrome://extensions`, the extension creates and reloads one.

An example on how to communicate with the extension can be found here:
[robin-drexler/chrome-extension-auto-reload-watcher](https://github.com/robin-drexler/chrome-extension-auto-reload-watcher)


## Why...

...reloading the entire tab instead of just using the extensions management api too reload/re-enable extensions?
Currently disabling and enabling extensions again causes any open inspection window (console log etc.) to close, which I found to be too annoying.


## Development

```
npm install
npm install -g browserify
```

`app/js` is created from `src/js` by:

```
browserify src/js/background.js -o app/js/background.js
```
