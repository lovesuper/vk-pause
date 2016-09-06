$(document).ready(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var target = document.querySelector('#head_play_btn');
  var newTarget = document.querySelector('.top_audio_player');
  if (target) {
    var observer = new MutationObserver(function(mutations, observer) {
      var className = mutations[0].target.className;
      if(className == "playing") {
        reportPlayingState(STATES.paused);
      }
      else if (className == "") {
        reportPlayingState(STATES.playing);
      }
    });
    observer.observe(target, { subtree: true, attributes: true });
  } else if(newTarget) {
    var observer = new MutationObserver(function(mutations, observer) {
      var className = mutations[0].target.className;
      if(className == "top_audio_player top_audio_player_enabled") {
        reportPlayingState(STATES.playing);
      }
      else if (className == "top_audio_player top_audio_player_enabled top_audio_player_playing") {
        reportPlayingState(STATES.paused);
      }
    });
    observer.observe(newTarget, { subtree: true, attributes: true });
  }
});

function reportPlayingState(playingState) {
  chrome.runtime.sendMessage({ state: playingState }, function(response) {});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd.value == COMMANDS.setToPlay.value) {
    var className = $("#head_play_btn").attr("class");
    var newClassName = $(".top_audio_player_play");
    if(className != "playing"){
      $("#head_play_btn").click();
    } else if (newClassName) {
    $(".top_audio_player_playing").click();
    }
    sendResponse({"state":STATES.playing});
  } else if (request.cmd.value == COMMANDS.setToStop.value) {
    $("#head_play_btn").click();
    $(".top_audio_player_play").click();
    sendResponse({"state":STATES.paused});
  } else if (request.cmd.value == COMMANDS.setToNext.value) {
    $(".top_audio_player_next").click()
    console.log("next song DONE")
    sendResponse({"state":STATES.playing});
  }
});
