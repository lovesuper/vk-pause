(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var playBtn = document.querySelector(SELECTORS.playstop.value);
  if(playBtn) {
    new MutationObserver(function(mutations, observer) {
      state = mutations[0].target.className.includes("top_audio_player_playing") ?  STATE.paused.value : STATE.playing.value;
      console.log("MUTATOR WAS HERE", state);
      chrome.runtime.sendMessage( { "state": state } );
    }).observe(playBtn, { subtree: true, attributes: true });
  }

  var loadingBar = document.querySelector(SELECTORS.loadingBar.value);
  var playingStyle = "opacity: 0; display: none;";
  if(loadingBar) {
    new MutationObserver(function(mutations, observer) {
      console.log("PLAYING MUTATION");
      chrome.runtime.sendMessage( { "loading": true } );
    }).observe(playBtn, { subtree: true, attributes: true });
  }

})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("COMMAND WAS HERE");
  document.querySelector(SELECTORS[request.value].value).click();
});
