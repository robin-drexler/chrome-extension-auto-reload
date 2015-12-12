
var methodSelector = document.getElementById('reload-method');

function updateMethodDescription() {
  var html = document.getElementById(methodSelector.value + '-method').nextSibling.nextSibling.innerHTML
  document.getElementById('reload-method-desc').innerHTML = html;
}

methodSelector.onchange = function() {
  updateMethodDescription();
  saveOptions();
};

function saveOptions() {
  chrome.storage.sync.set({
    reloadMethod: methodSelector.value
  }, function() {
    chrome.runtime.sendMessage({type: "options-saved"});
    var status = document.getElementById('status');
    status.textContent = '(saved)';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    reloadMethod: 'page'
  }, function(items) {
    methodSelector.selectedIndex = items.reloadMethod === 'api' ? 1 : 0;
    updateMethodDescription();
  });
}

document.getElementById('readme-md').innerHTML = require('../../readme.md');
restoreOptions()
