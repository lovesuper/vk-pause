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
  chrome.storage.local.set({ lastPlayedTabId: sender.tab.id }, function() {
    var isPlayingBundle = { "isPlaying": request.state.value == STATE.playing.value };
    chrome.storage.local.set(isPlayingBundle, function() {
      setAppIconState(request.state);
    });
  });
});

function appIconClicked() {
  var currentTimestamp = (new Date()).getTime();
  chrome.storage.local.get("lastTimeClicked", function(result) {
    if (result.lastTimeClicked && currentTimestamp - result.lastTimeClicked < DOUBLE_CLICK_MILLS) {
        nextAudioTrack();
    } else {
        switchPlayingState();
    }
    // null???
    chrome.storage.local.set({ "lastTimeClicked": currentTimestamp }, function() {});
  });
}

function switchPlayingState() {
  chrome.storage.local.get("isPlaying", function(result) {
    newPlayingState = Boolean(result.isPlaying) ? COMMAND.setToPlay : COMMAND.setToPause;
    chrome.storage.local.set({ isPlaying: !result.isPlaying }, function() {
      chrome.tabs.query({ url: URL.oldVkUrl.value }, function(vkTabs) {
        chrome.tabs.query({ url: URL.newVkUrl.value}, function(newVkTabs) {
          if((vkTabs && vkTabs.length) || (newVkTabs && newVkTabs.length)) {
            setNewStateToLastPlayedTab(newPlayingState);
          } else {
            startNewVkTab();
          }
        });
      });

    });
  });
}

function nextAudioTrack() {
  chrome.tabs.query({ url: URL.oldVkUrl.value}, function(vkTabs) {
    chrome.tabs.query({ url: URL.newVkUrl.value}, function(newVkTabs) {
      if((vkTabs && vkTabs.length) || (newVkTabs && newVkTabs.length)) {
        chrome.storage.local.get("lastPlayedTabId", function(result) {
          chrome.tabs.query({ url: URL.oldVkUrl.value}, function(vkTabs) {
            chrome.tabs.query({ url: URL.newVkUrl.value}, function(newVkTabs) {
              if((vkTabs && vkTabs.length) ) {
                vkTabs.forEach(function(tab) {
                  if(tab.id == result.lastPlayedTabId) {
                    chrome.tabs.sendMessage(tab.id, { cmd: COMMAND.setToNext }, function(response) {
                      setAppIconState(STATE.paused.value);
                    });
                  }
                });
              }
            });
          });
        });
      } else {
        startNewVkTab();
      }
    });
  });
}

function startNewVkTab() {
  chrome.tabs.create({ url: SSL_VK_URL, active: true, index: 0 }, function(tab) {
    chrome.tabs.onUpdated.addListener(completeListener);
  });
}

function completeListener(tabId, info, tab) {
  if(info.status == "complete" && (tab.url.indexOf("vk.com") > -1 || tab.url.indexOf("new.vk.com") > -1)) {
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id }, function() {
      switchPlayingState();
    });
    chrome.tabs.onUpdated.removeListener(completeListener);
  }
}

function setAppIconState(state) {
  chrome.browserAction.setIcon({ path: "images/icons/" + state + "/48.png" });
}

function setNewStateToLastPlayedTab(newState) {
  chrome.storage.local.get("lastPlayedTabId", function(result) {
    chrome.tabs.query({ url: URL.oldVkUrl.value }, function(vkTabs) {
      chrome.tabs.query({ url: URL.newVkUrl.value }, function(newVkTabs) {
        if((vkTabs && vkTabs.length) ) {
          vkTabs.forEach(function(tab) {
            if(tab.id == result.lastPlayedTabId) {
              setTabToNewState(tab.id, newState);
            } else if(tab.audible) {
              setTabToNewState(tab.id, COMMAND.setToPause.value);
            }
          });
        } else if (newVkTabs && newVkTabs.length) {
          newVkTabs.forEach(function(tab) {
            if(tab.id == result.lastPlayedTabId){
              setTabToNewState(tab.id, newState);
            } else if(tab.audible){
              setTabToNewState(tab.id, COMMAND.setToPause.value);
            }
          });
        }
      });
    });
  });
}

function setTabToNewState(tabId, newState) {
  chrome.tabs.sendMessage(tabId, { cmd: newState }, function(response) {
    chrome.storage.local.set({ "lastPlayedTabId" : tabId }, function() {
      if (response) {
        setAppIconState(response.state);
      }
    });
  });
}

