// TODO: sync vs local storage
var intervals = [];

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
  if (request.title) {
    chrome.browserAction.setTitle({ "title": request.title });
  } else {
    chrome.storage.local.set({ "lastPlayedTabId": sender.tab.id });
    chrome.browserAction.setIcon({ path: "images/icons/" + request.state + "/48.png" });
  }
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
  chrome.browserAction.setBadgeText({"text":""});
  var intervalID = window.setInterval(function() {
      var states = ["&--", "-#&", "#*#", "#-&", "#-#"]
      var colors = ["blue", "green", "gray", "green", "blue"]
      ix = Math.floor((Math.random() * 5) + 1);
      chrome.browserAction.setBadgeText({"text": states[ix - 1]});
      chrome.browserAction.setBadgeBackgroundColor({color: colors[ix - 1]});
  }, 200);
  intervals.push(intervalID);

  chrome.browserAction.setBadgeBackgroundColor({color: "CornflowerBlue"});
  if(info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id }, function() {
      performAction("playstop");
    });

    intervals.forEach(function(item){ window.clearInterval(item); })
    intervals = [];

    chrome.tabs.onUpdated.removeListener(newVkInstanceCreationCompleteListener);
  }
}

