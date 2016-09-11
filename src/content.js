(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var playBtn = document.querySelector(SELECTORS.playstop.value);
  if(playBtn) {
    new MutationObserver(function(mutations, observer) {
      chrome.runtime.sendMessage(
        { state: mutations[0].target.className.includes("top_audio_player_playing") ?  STATE.paused.value : STATE.playing.value }
      );
    }).observe(playBtn, { subtree: true, attributes: true });
  }
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  document.querySelector(SELECTORS[request.value].value).click();
});
