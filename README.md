## What is this?
This extension for Chrome automatically reloads unpacked extensions whenever a file change event is fired. You'll never need to go to `chrome://extensions` and smash reload again. See [__Emitting File Change Events__](#emitting-file-change-events) below to learn how to trigger trigger a file change event in your development builds.

## How does it work?
Extension tries to connect to socket.io server on `http://localhost:8890` (yes, that port is random) and waits for `file.change` events to flow in.
When an event is incoming, the extension reloads `chrome://extensions` automatically, which causes all unpacked extensions to reload and update (e.g. content scripts).
If there is no open tab, currently opened at `chrome://extensions`, the extension creates and reloads one.

An example on how to send file change events to the extension can be found in [__Emitting File Change Events__](#emitting-file-change-events) below.

There are two supported reload methods ("page" and "api"), each with their strengths and weaknesses. The default is "page", but it can be changed in the options page for this extension.

### Page Method

Reloads `chrome://extensions` page, which reloads background scripts without closing open background inspect windows, but does __not__ reload content scripts.

### API Method

Uses a Chrome API to reload extensions directly, which reloads background scripts and closes any open background inspect windows, but __does__ reload content scripts.

## Installation & Usage

[Install this extension from the webstore](https://chrome.google.com/webstore/detail/chrome-unpacked-extension/fddfkmklefkhanofhlohnkemejcbamln) or:

 1. Clone [this repo](https://github.com/robin-drexler/chrome-extension-auto-reload)
 2. Run the build as described in __[Development](#development)__ below
 3. Load `build` folder as unpacked extension in Chrome

... then start developing an unpacked extension and emit file change events in your extension as described below


## Emitting File Change Events

You will need to have a background task running to emit file change events whenever a file in the extension you are developing locally changes. This requires that you have [NodeJS](http://nodejs.org) installed on your machine.

 1. Install `gulp` globally so that it's easy to call by running the following from your command line interface in the root of your project:

 ```
 npm i gulp -g
 ```

 2. Install required dependencies:

 ```
 npm i gulp, gulp-watch, socket.io -D
 ```

 This will add the three required modules into the `devDependencies` of your `package.json` file.

 3. Create a file called `gulpfile.js` in the root of your project containing the following:

 ```
 var gulp = require('gulp');;
 var watch = require('gulp-watch');
 var io = require('socket.io');

 gulp.task('chrome-watch', function () {
      var WEB_SOCKET_PORT = 8890;
      io = io.listen(WEB_SOCKET_PORT);
      watch('**/*.*', function(file) {
        console.log('change detected', file.relative);
        io.emit('file.change', {});
      });
 });
 ```

 4. Run the file change watcher from your command line:

 ```
 gulp chrome-watch
 ```

 This will launch a process that emits a `file.change` event over `socket.io` whenever a file in your project is changes.

__Note:__ You can use the code above as a guide when modifying your existing watch method if you already have one, or if you're using another build tool like `grunt`.

## Issues and Feature requests

https://github.com/robin-drexler/chrome-extension-auto-reload/issues

## Development

To hack this code, make sure you have [NodeJS](http://nodejs.org) installed, then navigate to the root of this project in your command line interface and run the following to install all dependencies:
```
npm install
```

Generate a `build/` folder which can be loaded into Chrome as an unpacked extension:
```
npm run build
```

Automatically rebuild modified files into `build/` when they're saved:
```
npm run watch
```

Generate `dist/chrome-extension.zip`, which can be uploaded to the Chrom web store:
```
npm run dist
```

## Contributors

This extension was originally developed by [robin-drexler](https://github.com/robin-drexler/chrome-extension-auto-reload).

Updates by [JeromeDane](https://github.com/JeromeDane/chrome-extension-auto-reload) to add alternate reload method using [arikw's code](https://github.com/arikw/chrome-extensions-reloader/blob/master/background.js#L1). Added gulp build process and removed [socket.io-client](https://www.npmjs.com/package/socket.io-client) code from repo so it could be loaded as a dependency instead.
