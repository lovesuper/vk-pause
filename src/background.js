chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("<VK-Pause> App icon has been clicked");
  switchState();
});

chrome.commands.onCommand.addListener(function(hotkey) {
  if (hotkey == HOTKEYS.switchState.value) {
    console.log("<VK-Pause> Extension hotkey 'switchState' has been pressed")
    switchState();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("<VK-Pause> Background has recieved request. State is '" + request.state.value + "'");
  setAppIconState(request.state);
  sendResponse({result: "ok"});
});

function setAppIconState(state) {
  console.log("<VK-Pause> Changing icon to " + state.value);
  var iconPath = "images/icons/" + state.value + "/32.png"
  chrome.browserAction.setIcon({ path: iconPath });
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
        console.log("<VK-Pause> Sending command 'switchState' to tab " + tab.id);
        chrome.tabs.sendMessage(tab.id, {cmd: COMMANDS.switchState}, function(response) {
          console.log("<VK-Pause> Extension has recieved response from content script. OK");
        });
      });
    } else {
      // startNewVK();
    }
  });
}

function startNewVK() {
  console.log("<VK-Pause> Opening new VK");
  chrome.tabs.create({ url: "https://vk.com", active: true, index: 0 }, function(tab) {
    var tabId = tab.id;
    chrome.tabs.onUpdated.addListener(function(tabId, info) { if (info.status == "complete") {switchState(); }
    });
  });
}
