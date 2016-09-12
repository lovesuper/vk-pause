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
  chrome.storage.local.set({ "lastPlayedTabId": sender.tab.id });
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
        performAction("next");
      } else {
        performAction("playstop");
      }
      chrome.storage.local.set({ "lastTimeClicked": currentTimestamp });
    });
  });
}

function performAction(action) {
  chrome.tabs.query({ url: URL.vk.value}, function(tabs) {
    if (tabs.length == 0) {
      chrome.tabs.create({ url: SSL_VK_URL, active: true, index: 0 }, function(tab) {
        chrome.tabs.onUpdated.addListener(newVkInstanceCreationCompleteListener);
      });
      return;
    }

    chrome.storage.local.get("lastPlayedTabId", function(result) {
      tabs.forEach(function(tab) {
        if(tab.id == result.lastPlayedTabId) {
          if (action == "next"){
            chrome.tabs.sendMessage(tab.id, COMMAND.setToNext);
          } else {
            chrome.tabs.sendMessage(tab.id, COMMAND.setToPlay);
          }
          chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
        } else if(tab.audible) {
          chrome.tabs.sendMessage(tab.id, COMMAND.setToPause);
        }
      });
    });
  });
}

function newVkInstanceCreationCompleteListener(tabId, info, tab) {
  chrome.browserAction.setTitle({"title":"Oxxxymiron - Детектор Лжи"});
  chrome.browserAction.setBadgeText({"text":"∞"});
  chrome.browserAction.setBadgeBackgroundColor({color: "green"});

  if(info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id }, function() {
      console.log("on loading page START/STOP");
      performAction("playstop");
    });
    chrome.tabs.onUpdated.removeListener(newVkInstanceCreationCompleteListener);
  }
}
