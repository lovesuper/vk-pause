chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("<VK-Pause> Extension icon has been clicked");
  switchState();
});

chrome.commands.onCommand.addListener(function(hotkey) {
  if (hotkey == HOTKEYS.switchState.value) {
    console.log("<VK-Pause> Extension hotkey 'switchState' has been pressed")
    switchState();
  }
});

function switchState() {
  chrome.tabs.query({url: "*://vk.com/*", lastFocusedWindow: true}, function(tabs) {
    if (tabs.length) {
      tabs.forEach(function(tab) {
        console.log("<VK-Pause> Sending command 'switchState' to tab " + tab.id);
        chrome.tabs.sendMessage(tab.id, {cmd: COMMANDS.switchState}, function(response) {
          console.log("<VK-Pause> Extension has recieved response from content script. State is '" + response.newState.value + "'");
          switchIconState(response.newState);
        });
      });
    } else {
       console.log("<VK-Pause> No VKs was found. Open new one");
       chrome.tabs.create({ url: "https://vk.com", active: true, index: 0 }, function(tab) {
         var tabId = tab.id;
         chrome.tabs.onUpdated.addListener(function(tabId, info) {
           if (info.status == "complete") {
             switchState();
           }
         });
      });
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("<VK-Pause> Background has recieved request. State is '" + request.state.value + "'");
  switchIconState(request.state);
  sendResponse({result: "ok"});
});

function switchIconState(state) {
  // chrome.storage.local.get('isPlaying', function (result) {
  //   switchState();
  //   chrome.storage.local.set({'isPlaying': !result.isPlaying}, function() {});
  // });
  var iconPath = "images/icons/play/32.png"
  if(state.value == STATES.playing.value) {
    iconPath = "images/icons/pause/32.png"
  }
  console.log("<VK-Pause> Changing icon to " + iconPath);
  chrome.browserAction.setIcon({ path: iconPath });
}
