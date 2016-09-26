(function() {
  var playButton = document.querySelector(".top_audio_player");
  var titleBar = document.querySelector(".top_audio_player_title_wrap");

  if(playButton) {
    new MutationObserver(function(mutations, observer) {
      if (mutations[0].target.className.includes("top_audio_player_title")) {
        console.log("skipping trash event");
        return;
      }
      console.log("needful event");
      var state = mutations[0].target.className.includes("top_audio_player_playing")
        ?  STATE.paused.value : STATE.playing.value;
      console.log("Event raised:", state);
      chrome.runtime.sendMessage( { "state": state, "playButtonClicked": true} );
    }).observe(playButton, { subtree: true, attributes: true });
  }

  if(titleBar) {
    new MutationObserver(function(mutations, observer) {
      var currentTitle = mutations[0].target.innerText;
      chrome.runtime.sendMessage( { "state": STATE.paused.value } );
      chrome.runtime.sendMessage( { "titleChanged": currentTitle } );
    }).observe(titleBar, { subtree: true, attributes: true });
  }
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.value == COMMAND.setToPause.value) {
    console.log("set to paused mode");
    var playButton = document.querySelector(".top_audio_player_play");
    var classList = playButton.classList;
    if (classList.contains("top_audio_player_playing")) {
      playButton.click();
    }
  } else if (request.value == COMMAND.setToPlay.value) {
    console.log("set to playing mode");
    var playButton = document.querySelector(".top_audio_player_play");
    var classList = playButton.classList;
    if (!classList.contains("top_audio_player_playing")) {
      playButton.click();
    }
  } else if (request.value == COMMAND.setToOppositeState.value) {
    console.log("switch playing state");
    document.querySelector(".top_audio_player_play").click()
  } else if (request.value == COMMAND.setToNext.value) {
    console.log("next song");
    document.querySelector(".top_audio_player_next").click()
  }

});

