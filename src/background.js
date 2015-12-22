chrome.browserAction.onClicked.addListener(function(tab) {
  switchState();

});

chrome.commands.onCommand.addListener(function(hotkey) {
  if (hotkey == "switchState") {
    switchState();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  setAppIconState(request.state);
});

function setAppIconState(state) {
  chrome.browserAction.setIcon({
    path: "images/icons/" + state.value + "/48.png"
  });
}

function switchState() {
  chrome.storage.local.get('isPlaying', function(result) {
    var isPlaying = Boolean(result.isPlaying);
    var state = isPlaying ? STATES.playing : STATES.paused;
    setAppIconState(state);
    chrome.storage.local.set({
      'isPlaying': !isPlaying
    }, function() {
      spreadStateToTabs(state);
    });
  });
}

function spreadStateToTabs(state) {
  chrome.tabs.query({
    url: "*://vk.com/*"
  }, function(vkTabs) {
    if (vkTabs.length) {
      vkTabs.forEach(function(tab) {
        if(tab.audible) {
          chrome.tabs.sendMessage(tab.id, {
            cmd: COMMANDS.switchState
          }, function(response) {});
        }
      });
    } else {
      startNewVkTab();
    }
  });
}

function completeListener(tabId, info, tab) {
  if (info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    switchState();
    chrome.tabs.onUpdated.removeListener(completeListener);
  }
}

function startNewVkTab() {
  chrome.tabs.create({
    url: "https://vk.com",
    active: true,
    index: 0
  }, function(tab) {
    chrome.tabs.onUpdated.addListener(completeListener);
  });
}

