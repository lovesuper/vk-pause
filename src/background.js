var animationIndex = 0;
var intervalID;
var CHARS_COUNT_AT_ONE_TIME = 3;

chrome.browserAction.onClicked.addListener(function() {
  appIconClicked();
});

chrome.commands.onCommand.addListener(function(hotkey) {
  switch (hotkey) {
    case HOTKEY.main.value:
    case HOTKEY.localmain.value:
      appIconClicked();
  }
});

function resetAnimationIndex() {
  animationIndex = 0;
  window.clearInterval(intervalID);
  chrome.browserAction.setBadgeText({"text": "•"});
  chrome.browserAction.setTitle({ "title": DEFAULT_TITLE });
}

chrome.runtime.onMessage.addListener(function(request, sender, _) {
  if (request.titleChanged) {
    resetAnimationIndex();
    chrome.browserAction.setTitle({ "title": request.titleChanged });
    var splittedTitle = request.titleChanged.split("");
    intervalID = window.setInterval(function() {
      var splittedTitleSlice = splittedTitle.slice(animationIndex, animationIndex + CHARS_COUNT_AT_ONE_TIME);
      if (splittedTitleSlice.length != 0) {
        chrome.browserAction.setBadgeText({ "text": splittedTitleSlice.join("") });
        chrome.browserAction.setBadgeBackgroundColor({ color: "CornflowerBlue" });
        animationIndex++;
      } else {
        animationIndex = 0;
      }
    }, 300);
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
  chrome.tabs.query({ url: URL.vk.value }, function(tabs) {
    if (tabs.length == 0) {
      chrome.tabs.create({ url: SSL_VK_URL, active: true, index: 0 }, function() {
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

function newVkInstanceCreationCompleteListener(_, info, tab) {
  chrome.browserAction.setBadgeBackgroundColor({ color: "CornflowerBlue" });
  if(info.status == "complete" && tab.url.indexOf("vk.com") > -1) {
    chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
    chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
    chrome.tabs.onUpdated.removeListener(newVkInstanceCreationCompleteListener);
  }
}

chrome.tabs.onCreated.addListener(function(){
  chrome.browserAction.setTitle({ "title": DEFAULT_TITLE });
});

chrome.tabs.onUpdated.addListener(function (_, __, tab) {
  if (tab.url.indexOf("vk.com") > -1) {
    chrome.storage.local.get("lastPlayedTabId", function(result) {
      if (!result.lastPlayedTabId) {
        chrome.storage.local.set({ "lastPlayedTabId" : tab.id });
      }
    });
  }
});

chrome.tabs.onRemoved.addListener(function () {
  chrome.storage.local.get("lastPlayedTabId", function(result) {
    if (result.lastPlayedTabId) {
      chrome.tabs.query({ url: URL.vk.value }, function(tabs) {
        chrome.browserAction.setIcon({ path: "images/icons/playing/48.png" });
        if (tabs.length != 0) {
          chrome.storage.local.set({ "lastPlayedTabId" : tabs[0].id });
        } else {
          resetAnimationIndex();
          chrome.browserAction.setBadgeText({"text": ""});
          chrome.storage.local.set({ "lastPlayedTabId" : null });
        }
      });
    }
  });
});

