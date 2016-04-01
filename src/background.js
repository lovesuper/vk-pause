chrome.browserAction.onClicked.addListener(function(tab) { switchPlayingState(); });

chrome.commands.onCommand.addListener(function(hotkey) { if(hotkey == "switchState") switchPlayingState(); });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.set({ 'lastPlayedTabId': sender.tab.id }, function() {
    chrome.storage.local.set({ 'isPlaying': request.state == STATES.playing }, function() {
      setAppIconState(request.state);
    });
  });
});

function switchPlayingState() {
  chrome.storage.local.get('isPlaying', function(result) {
    newState = Boolean(result.isPlaying) ? COMMANDS.setToStop : COMMANDS.setToPlay;
    chrome.storage.local.set({ 'isPlaying': !result.isPlaying }, function() {
      chrome.tabs.query({ url: "*://vk.com/*" }, function(vkTabs) {
        chrome.tabs.query({ url: "*://new.vk.com/*" }, function(newVkTabs) {
          if((vkTabs && vkTabs.length) || (newVkTabs && newVkTabs.length)) {
            setNewStateToLastPlayedTab(newState);
          } else {
            startNewVkTab();
          }
        });
      });
    });
  });
}

function startNewVkTab() {
  chrome.tabs.create({ url: "https://vk.com", active: true, index: 0 }, function(tab) {
    chrome.tabs.onUpdated.addListener(completeListener);
  });
}

function completeListener(tabId, info, tab) {
  if(info.status == "complete" && (tab.url.indexOf("vk.com") > -1 || tab.url.indexOf("new.vk.com") > -1)) {
    chrome.storage.local.set({ 'lastPlayedTabId': tab.id }, function() {
      switchPlayingState();
    });
    chrome.tabs.onUpdated.removeListener(completeListener);
  }
}

function setAppIconState(state) {
  chrome.browserAction.setIcon({ path: "images/icons/" + state.value + "/48.png" });
}

function setNewStateToLastPlayedTab(newState) {
  chrome.storage.local.get('lastPlayedTabId', function(result) {
    chrome.tabs.query({ url: "*://vk.com/*" }, function(vkTabs) {
      chrome.tabs.query({ url: "*://new.vk.com/*" }, function(newVkTabs) {
        if((vkTabs && vkTabs.length) ) {
          vkTabs.forEach(function(tab) {
            if(tab.id == result.lastPlayedTabId) setTabToNewState(tab.id, newState);
            else if(tab.audible) setTabToNewState(tab.id. COMMANDS.setToStop);
          });
        } else if (newVkTabs && newVkTabs.length) {
          newVkTabs.forEach(function(tab) {
            if(tab.id == result.lastPlayedTabId) setTabToNewState(tab.id, newState);
            else if(tab.audible) setTabToNewState(tab.id. COMMANDS.setToStop);
          });
        }
      });
    });
  });
}

function setTabToNewState(tabId, newState) {
  chrome.tabs.sendMessage(tabId, { cmd: newState }, function(response) {
    chrome.storage.local.set({ 'lastPlayedTabId': tabId }, function() {
      setAppIconState(response.newState);
    });
  });
}
