// TODO: sync vs local storage
chrome.browserAction.onClicked.addListener(function(tab) {
  appIconClicked();
});

chrome.commands.onCommand.addListener(function(hotkey) {
  switch (hotkey) {
    case HOTKEY.main.value:
    case HOTKEY.localmain.value:
      appIconClicked();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.set({
    "lastPlayedTabId": sender.tab.id,
    "isPlaying": request.state.value == STATE.playing.value
  });
  chrome.browserAction.setIcon({ path: "images/icons/" + request.state + "/48.png" });
});

function appIconClicked() {
  var currentTimestamp = (new Date()).getTime();
  chrome.storage.local.get("lastTimeClicked", function(result) {
    chrome.storage.local.get("intervalMills", function(values) {
      if (!values.intervalMills) {
        chrome.storage.local.set({ "intervalMills": DEFAULT_INTERVAL_MILLS });
      }

      if (result.lastTimeClicked && currentTimestamp - result.lastTimeClicked < values.intervalMills) {
        nextAudioTrack();
      } else {
        switchPlayingState();
      }
      chrome.storage.local.set({ "lastTimeClicked": currentTimestamp });
    });
  });
}

function switchPlayingState() {
  chrome.storage.local.get("isPlaying", function(result) {
    newPlayingState = Boolean(result.isPlaying) ? COMMAND.setTPause : COMMAND.setToPlay;
    chrome.storage.local.set({ isPlaying: result.isPlaying }, function() {
      chrome.tabs.query({ url: URL.vk.value }, function(tabs) {
        if(tabs && tabs.length) {
          chrome.storage.local.get("lastPlayedTabId", function(result) {
            chrome.tabs.query({ url: URL.vk.value }, function(tabs) {
                if((tabs && tabs.length) ) {
                  tabs.forEach(function(tab) {
                    if(tab.id == result.lastPlayedTabId) {
                      chrome.tabs.sendMessage(tab.id, newPlayingState);
                    } else if(tab.audible) {
                      chrome.tabs.sendMessage(tab.id, COMMAND.setToPause);
                    }
                    chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
                  });
                }
            });
          });
        } else {
          startNewVkInstance();
        }
      });
    });
  });
}

function nextAudioTrack() {
  chrome.tabs.query({ url: URL.vk.value}, function(tabs) {
    if (!tabs) {
      startNewVkInstance();
      return;
    }

    chrome.storage.local.get("lastPlayedTabId", function(result) {
      tabs.forEach(function(tab) {
        if (tab.id == result.lastPlayedTabId) {
          chrome.tabs.sendMessage(tab.id, COMMAND.setToNext);
        }
      });
    });

  });
}

function startNewVkInstance() {
  chrome.tabs.create({ url: SSL_VK_URL, active: true, index: 0 }, function(tab) {
    chrome.tabs.onUpdated.addListener(completeListener);
  });
}

function completeListener(tabId, info, tab) {
  if(info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id }, function() {
      switchPlayingState();
    });
    chrome.tabs.onUpdated.removeListener(completeListener);
  }
}

