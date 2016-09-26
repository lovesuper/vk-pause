var ix = 0;
var intervalID;

chrome.browserAction.onClicked.addListener(function(tab) { appIconClicked(); });

chrome.commands.onCommand.addListener(function(hotkey) {
  switch (hotkey) {
    case HOTKEY.main.value:
    case HOTKEY.localmain.value:
      appIconClicked();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.titleChanged) {
    ix = 0;
    window.clearInterval(intervalID);
    chrome.browserAction.setBadgeText({"text":""});
    chrome.browserAction.setTitle({ "title": request.titleChanged });
    var arr = request.titleChanged.split("");
    intervalID = window.setInterval(function() {
      var txtArr = arr.slice(ix, ix+3);
      if (txtArr.length != 0) {
        chrome.browserAction.setBadgeText({"text": txtArr.join("")});
        chrome.browserAction.setBadgeBackgroundColor({color: "blue"});
        ix += 1;
      } else { ix = 0; }
    }, 500);
  } else if (request.playButtonClicked) {
    chrome.storage.local.get("lastPlayedTabId", function(result) {
      if (result.lastPlayedTabId == sender.tab.id) {
        chrome.browserAction.setIcon({ path: "images/icons/" + request.state + "/48.png" });
      }
    });
  }
});

function appIconClicked() {
  var currentTimestamp = (new Date()).getTime();
  var query = {"lastTimeClicked": null, "intervalMills": DEFAULT_INTERVAL_MILLS};
  chrome.storage.local.get(query, function(result) {
    if (!result.intervalMills) {
      chrome.storage.local.set({ "intervalMills": result.intervalMills });
    }

    if (result.lastTimeClicked && currentTimestamp - result.lastTimeClicked < result.intervalMills) {
      performAction(COMMAND.setToNext);
    } else {
      performAction(COMMAND.setToOppositeState);
    }

    chrome.storage.local.set({ "lastTimeClicked": currentTimestamp });
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
          if (action.value == COMMAND.setToNext.value){
            chrome.tabs.sendMessage(tab.id, COMMAND.setToNext);
          } else {
            chrome.tabs.sendMessage(tab.id, COMMAND.setToOppositeState);
          }
          chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
        } else {
          chrome.tabs.sendMessage(tab.id, COMMAND.setToPause);
          chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
        }
      });
    });
  });
}

function newVkInstanceCreationCompleteListener(tabId, info, tab) {
  chrome.browserAction.setBadgeBackgroundColor({color: "CornflowerBlue"});
  if(info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
    chrome.tabs.onUpdated.removeListener(newVkInstanceCreationCompleteListener);
  }
}

chrome.tabs.onRemoved.addListener(function (tabid) {
  chrome.storage.local.get("lastPlayedTabId", function(result) {
    window.clearInterval(intervalID);
    ix = 0;
    chrome.browserAction.setBadgeText({"text":""});
    if (result.lastPlayedTabId) {
      chrome.tabs.query({ url: URL.vk.value}, function(tabs) {
        chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
        if (tabs.length != 0) {
          chrome.storage.local.set({ "lastPlayedTabId" : tabs[0].id });
        }
      });
    }
  });
});
