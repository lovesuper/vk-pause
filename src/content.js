$(document).ready(function () {
  console.log("<VK-Pause> Extension started on page")
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var target = document.querySelector('#head_play_btn');
  var observer = new MutationObserver(function(mutations, observer) {
    var className = mutations[0].target.className;
    switch (className) {
      case "playing":
        reportPlayingState(STATES.playing);
      case "":
        reportPlayingState(STATES.paused);
      // case "playing over down":
      // case "playing over":
    }
  });
  observer.observe(target, {subtree: true, attributes: true });
});

function reportPlayingState(playingState) {
  console.log("<VK-Pause> Sending to Background script button state as '" + playingState.value + "'");
  chrome.runtime.sendMessage({state: playingState}, function(response) {
    console.log("<VK-Pause> Background script has answered with '" + response.result + "'");
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("<VK-Pause> Background message has recieved")
  if (request.cmd.value == COMMANDS.switchState.value) {
    console.log("<VK-Pause> Clicking on playStop button")
    $("#head_play_btn").click();
    console.log("<VK-Pause> Sending back OK")
    sendResponse({ result: "ok" });
  }
});
