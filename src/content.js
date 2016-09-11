// TODO: triple click -- prev
// TODO: loading mode

(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var playBtn = document.querySelector(SELECTORS.playstop.value);
  if(playBtn) {
    var observer = new MutationObserver(function(mutations, observer) {
      reportPlayingState(
        mutations[0].target.className.includes("top_audio_player_playing") ?
        STATE.paused :
        STATE.playing
      );
    }).observe(playBtn, { subtree: true, attributes: true });
  }
})();

function reportPlayingState(playingState) {
  chrome.runtime.sendMessage({ state: playingState.value });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  document.querySelector(SELECTORS[request.value].value).click();
});

