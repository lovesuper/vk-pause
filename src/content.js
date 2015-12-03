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
  var btnClass = $("#head_play_btn").attr("class");
  if(btnClass == "" || btnClass == "over") {
    return STATES.paused;
  } else if(btnClass == "playing" || btnClass == "playing over") {
    return STATES.playing;
  }

  return STATES.unknown;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("<VK-Pause> Background message has recieved")
  if (request.cmd.value == COMMANDS.switchState.value) {
    console.log("<VK-Pause> Clicking on playStop button")
    $("#head_play_btn").click();
    var state = getPlayingState();
    console.log("<VK-Pause> Sending back new state")
    sendResponse({newState: state});
  }
});
