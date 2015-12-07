$(document).ready(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var target = document.querySelector('#head_play_btn');
  var observer = new MutationObserver(function(mutations, observer) {
    var className = mutations[0].target.className;
    if (className == "playing") {
      reportPlayingState(STATES.paused);
    } else if (className == "") {
      reportPlayingState(STATES.playing);
    }
  });
  observer.observe(target, {
    subtree: true,
    attributes: true
  });
});

function reportPlayingState(playingState) {
  chrome.runtime.sendMessage({
    state: playingState
  }, function(response) {});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd.value == COMMANDS.switchState.value) {
    $("#head_play_btn").click();
  }
});
