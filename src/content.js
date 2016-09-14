(function() {
  var playButton = document.querySelector(SELECTORS.playstop.value);
  var titleBar = document.querySelector(".top_audio_player_title_wrap");

  if(playButton) {
    new MutationObserver(function(mutations, observer) {
        var state = mutations[0].target.className.includes("top_audio_player_playing") ?  STATE.paused.value : STATE.playing.value;
        chrome.runtime.sendMessage( { "state": state } );
    }).observe(playButton, { subtree: true, attributes: true });
  }

  if(titleBar) {
    new MutationObserver(function(mutations, observer) {
      var currentTitle = mutations[0].target.innerText;
      chrome.runtime.sendMessage( { "state": "paused" } );
      chrome.runtime.sendMessage( { "title": currentTitle } );
    }).observe(titleBar, { subtree: true, attributes: true });
  }
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.value == COMMAND.setToPause.value) {
    var playButton = document.querySelector(SELECTORS["playstop"].value);
    var classList = playButton.classList;
    if (classList.contains("top_audio_player_playing")) {
      playButton.click();
    }
  } else {
    var topPlayButton = document.querySelector(SELECTORS[request.value].value)
    var bottomPlayButton = document.querySelector(".audio_page_player_ctrl")
    if (bottomPlayButton) {
      bottomPlayButton.click();
    } else if (topPlayButton) {
      topPlayButton.click();
    }
  }
});
