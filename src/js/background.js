(function (console) {
  "use strict";

  const CHROME_EXTENSION_URL = 'chrome://extensions/';
  const SOCKET_IO_PORT = '8890';

  // See https://github.com/robin-drexler/chrome-extension-auto-reload/pull/2#issuecomment-154829693
  var reloadMethod = "page"; // can be "api" or "page"

  function applyReloadMethod() {
    chrome.storage.sync.get({
      reloadMethod: 'page'
    }, function(items) {
      reloadMethod = items.reloadMethod
    });
  }
  applyReloadMethod();

  // apply new reload method whenever options have been saved
  chrome.runtime.onMessage.addListener(function(message) {
    if(message.type === 'options-saved') {
      applyReloadMethod();
    }
  });

  var io = require('socket.io-client');
  var socket = io('http://localhost:' + SOCKET_IO_PORT);

  function reloadTab(tab) {
    console.log('reloading tab', tab);
    chrome.tabs.reload(tab.id);
  }

  function reloadExtensionsUsingApi() {
    // find all unpacked extensions and reload them
    chrome.management.getAll(function(a) {
      var ext = {};
      for (var i = 0; i < a.length; i++) {
        ext = a[i];
        if ((ext.name !== 'Chrome Unpacked Extension Auto Reload') &&  // don't reload yourself
          (ext.installType=="development") &&
          (ext.enabled == true) &&
          (ext.name != "Extensions Reloader")) {
            console.log(ext.name + " reloaded");
            (function (extensionId, extensionType) {
              // disable
              chrome.management.setEnabled(extensionId, false, function() {
                // re-enable
                chrome.management.setEnabled(extensionId, true, function() {
                  // re-launch packaged app
                  if (extensionType == "packaged_app") {
                    chrome.management.launchApp(extensionId);
                  }
                });
              });
            })(ext.id, ext.type);
        }
      }
    });
  }

  function reloadExtensionsUsingPage() {
    // search for any open extension tab and reload
    chrome.tabs.query({
      url: CHROME_EXTENSION_URL
    }, function (tabs) {
      console.log('found tabs', tabs.length, tabs);

      if (tabs.length) {
        reloadTab(tabs[0]);
      } else {
        // no extension tab found. Create and reload
        console.log('creating new tab');
        chrome.tabs.create({
              url: CHROME_EXTENSION_URL,
              index: 0,
              pinned: true,
              active: false
            }, function (tab) {
              window.setTimeout(function () {
                reloadTab(tab);
              }, 500); //not sure why immediate reload does not seem to work...
              // note to self, probably one has to wait for load event, so it can be actually *re*loaded
            }
        );
      }

    });
  }

  socket.on('file.change', function () {
    console.log('received ping');
    if(reloadMethod === 'page') {
      reloadExtensionsUsingPage();
    } else {
      reloadExtensionsUsingApi();
    }
  });

})(window.console);
