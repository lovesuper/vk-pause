var intervals = [];

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
    console.log("title changed");
    chrome.browserAction.setTitle({ "title": request.titleChanged });
  } else if (request.playButtonClicked) {
    console.log("playpause event:", request.state);
    chrome.browserAction.setIcon({ path: "images/icons/" + request.state + "/48.png" });
    //chrome.storage.local.set({ "lastPlayedTabId" : sender.tab.id });
  }
});

function appIconClicked() {
  console.log("App icon clicked");
  var currentTimestamp = (new Date()).getTime();
  var query = {"lastTimeClicked": null, "intervalMills": DEFAULT_INTERVAL_MILLS};
  chrome.storage.local.get(query, function(result) {
    if (!result.intervalMills) {
      chrome.storage.local.set({ "intervalMills": result.intervalMills });
    }

    if (result.lastTimeClicked && currentTimestamp - result.lastTimeClicked < result.intervalMills) {
      console.log("go next");
      performAction(COMMAND.setToNext);
    } else {
      console.log("go to opposite state");
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
          console.log("working with playing tab", tab.id);
          console.log("performing action", action.value, "at", tab.id)
          if (action.value == COMMAND.setToNext.value){
            console.log("action: next");
            chrome.tabs.sendMessage(tab.id, COMMAND.setToNext);
          } else {
            console.log("action: opposite state");
            chrome.tabs.sendMessage(tab.id, COMMAND.setToOppositeState);
          }
          chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
        } else {
          console.log("sure what this tab is silent", tab.id);
          chrome.tabs.sendMessage(tab.id, COMMAND.setToPause);
          chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
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
    chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
    intervals.forEach(function(item){ window.clearInterval(item); })
    intervals = [];

    chrome.tabs.onUpdated.removeListener(newVkInstanceCreationCompleteListener);
  }
}

chrome.tabs.onRemoved.addListener(function (tabid) {
  chrome.storage.local.get("lastPlayedTabId", function(result) {
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
