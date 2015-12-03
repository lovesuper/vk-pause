$(document).ready(function () {
  console.log("<VK-Pause> Extension started on page")
  if($("#ac_play").length) {
    console.log("<VK-Pause> StartStop button was found")
    $("#ac_play").click(function() {
      console.log("<VK-Pause> StartStop button has been clicked")
      var playingState = getPlayingState();
      reportPlayingState(playingState);
    });
    var playingState = getPlayingState();
    console.log("<VK-Pause> StartStop state is '" + playingState.value + "'");
    reportPlayingState(playingState);
  } else {
    console.log("<VK-Pause> StartStop button was not found")
  }
});

function reportPlayingState(playingState) {
  console.log("<VK-Pause> Sending to Background script button state as '" + playingState.value + "'");
  chrome.runtime.sendMessage({state: playingState}, function(response) {
    console.log("<VK-Pause> Background script has answered with '" + response.result + "'");
  });
}

function getPlayingState() {
  var btnClass = $("#ac_play").attr("class");
  if(btnClass == "fl_l" || btnClass == "fl_l over") {
    return STATES.paused;
  } else if(btnClass == "fl_l playing" || btnClass == "fl_l over playing") {
    return STATES.playing;
  }

  return STATES.unknown;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("<VK-Pause> Background message has recieved")
  if (request.cmd == COMMANDS.switchState.value) {
    console.log("<VK-Pause> Clicking on playStop button")
    $("#ac_play").click();
    var state = getPlayingState();
    console.log("<VK-Pause> Sending back new state")
    sendResponse({newState: state});
  }
});
