// background script

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("[VK-Pause] ext clicked!");
  chrome.tabs.query({url: "https://vk.com/*", lastFocusedWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {cmd: "stopIt!"}, function(response) {
      console.log(response.result);
      chrome.storage.local.get('isPlaying', function (result) {
        console.log(">>>>> " + result.isPlaying);
        if (result.isPlaying) {
          console.log('State: true');
          chrome.browserAction.setIcon({path: "images/icons/pause/32.png"});
        } else {
          console.log('State: false');
          chrome.browserAction.setIcon({path: "images/icons/play/32.png"});
        }
        chrome.storage.local.set({'isPlaying': !result.isPlaying}, function() {
          console.log('State saved!');
        });
      });
    });
  });
});
