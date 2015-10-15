(function (console) {
  "use strict";

  const CHROME_EXTENSION_URL = 'chrome://extensions/';
  const SOCKET_IO_PORT = '8890';

  var io = require('./external/socket.io.js');
  var socket = io('http://localhost:' + SOCKET_IO_PORT);

  function reloadTab(tab) {
    console.log('reloading tab', tab);
    chrome.tabs.reload(tab.id);
  }

	function reloadExtensions() {
		// find all unpacked extensions and reload them
		chrome.management.getAll(function(a) {
			var ext = {};
			for (var i = 0; i < a.length; i++) {
				ext = a[i];
				if ((ext.name !== 'Chrome Unpacked Extension Auto Reload') &&	// don't reload yourself
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

  socket.on('file.change', function () {
    console.log('received ping');
    reloadExtensions();
  });

})(window.console);


