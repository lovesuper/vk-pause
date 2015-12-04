chrome.browserAction.onClicked.addListener(function(tab) { switchState(); });

chrome.commands.onCommand.addListener(function(hotkey) {
  if(hotkey == "switchState") { switchState(); }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  setAppIconState(request.state);
});

function setAppIconState(state) {
  chrome.browserAction.setIcon({ path: "images/icons/" + state.value + "/48.png" });
}

function switchState() {
  chrome.storage.local.get('isPlaying', function (result) {
    var isPlaying = Boolean(result.isPlaying);
    var state = isPlaying ? STATES.playing : STATES.paused;
    setAppIconState(state);
    chrome.storage.local.set({'isPlaying': !isPlaying}, function() {
      spreadStateToTabs(state);
    });
  });
}

function spreadStateToTabs(state) {
  chrome.tabs.query({url: "*://vk.com/*", lastFocusedWindow: true}, function(vkTabs) {
    if (vkTabs.length) {
      vkTabs.forEach(function(tab) {
        chrome.tabs.sendMessage(tab.id, {cmd: COMMANDS.switchState}, function(response) {});
      });
    } else {
      startNewVK();
    }
  });
}

function startNewVK() {
  chrome.tabs.create({ url: "https://vk.com", active: true, index: 0 }, function(tab) {
    var tabId = tab.id;
    chrome.tabs.onUpdated.addListener(function(tabId, info) { if (info.status == "complete") { switchState(); }
    });
  });
}
