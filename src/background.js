// background script

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("[VK-Pause] ext clicked!");
  chrome.tabs.query({url: "https://vk.com/*", lastFocusedWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {cmd: "changeMode"}, function(response) {
      console.log(response.result);
      chrome.storage.local.get('isPlaying', function (result) {
        chrome.browserAction.setIcon({path: result.isPlaying ? "images/icons/pause/32.png" : "images/icons/play/32.png"});
        chrome.storage.local.set({'isPlaying': !result.isPlaying}, function() {});
      });
    });
  });
});
