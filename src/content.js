(function() {
  var playButton = document.querySelector(SELECTORS.playstop.value);
  var titleBar = document.querySelector(SELECTORS.title.value);

  if(playButton) {
    new MutationObserver(function(mutations, _) {
      if (mutations[0].target.className.includes(TRASH_MUTATOR_FLAG)) { return; }
      var className = mutations[0].target.className;
      var state = className.includes(PLAYING_FLAG) ?  STATE.paused.value : STATE.playing.value;
      chrome.runtime.sendMessage( { "state": state, "playButtonClicked": true} );
    }).observe(playButton, { subtree: true, attributes: true });
  }

  if(titleBar) {
    new MutationObserver(function(mutations, _) {
      chrome.runtime.sendMessage({
        "state": STATE.paused.value,
        "titleChanged": mutations[0].target.innerText
      });
    }).observe(titleBar, { subtree: true, attributes: true });
  }
})();

chrome.runtime.onMessage.addListener(function(request, _, __) {
  switch (request.value) {
    case COMMAND.setToPause.value:
      var playButton = document.querySelector(SELECTORS.play.value);
      if (playButton.classList.contains(PLAYING_FLAG)) { playButton.click(); }
      break;
    case COMMAND.setToPlay.value:
      var playButton = document.querySelector(SELECTORS.play.value);
      if (!playButton.classList.contains(PLAYING_FLAG)) { playButton.click(); }
      break;
    case COMMAND.setToOppositeState.value:
      document.querySelector(SELECTORS.play.value).click()
      break;
    case COMMAND.setToNext.value:
      document.querySelector(SELECTORS.next.value).click()
      break;
  }
});

