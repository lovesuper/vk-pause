// var STATES = {
//   playing: {value: 0},
//   paused: {value: 1}
// }

chrome.browserAction.onClicked.addListener(function(tab) {
  switchState();
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "switchState") {
    switchState()
  }
});

function switchIconState() {
  chrome.storage.local.get('isPlaying', function (result) {
    chrome.browserAction.setIcon(
      { path: result.isPlaying ? "images/icons/pause/32.png" : "images/icons/play/32.png" }
    );
    // setPlayingState(result.isPlaying ? STATES.playing : STATES.paused)
    chrome.storage.local.set({'isPlaying': !result.isPlaying}, function() {});
  });
}

function switchState() {
  chrome.tabs.query({url: "*://vk.com/*", lastFocusedWindow: true }, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, {cmd: "changeMode"}, function(response) {
        switchIconState();
      });
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.stateSwitched == "yes") {
    sendResponse({result: "done!"});
    switchIconState();
  }
});

// setPlayingState(state) {
//   switch (state) {
//     case STATES.playing:
//       chrome.browserAction.setIcon({ path:"images/icons/pause/32.png"})
//       break;
//     case STATES.paused:
//       chrome.browserAction.setIcon({ path:"images/icons/play/32.png"})
//       break;
//   }
// }
