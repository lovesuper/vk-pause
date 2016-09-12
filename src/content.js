(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  debugger;
  var playBtn = document.querySelector(SELECTORS.playstop.value);
  if(playBtn) {
    new MutationObserver(function(mutations, observer) {
      state = mutations[0].target.className.includes("top_audio_player_playing") ?  STATE.paused.value : STATE.playing.value;
      chrome.runtime.sendMessage( { "state": state } );
    }).observe(playBtn, { subtree: true, attributes: true });
  }

  var loadingBar = document.querySelector(".audio_page_player_duration");
  if(loadingBar) {
    new MutationObserver(function(mutations, observer) {
      console.log("PLAYING MUTATION");
//      chrome.runtime.sendMessage( { "loading": true } );
    }).observe(loadingBar, { subtree: true, attributes: true });
  }

})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  document.querySelector(SELECTORS[request.value].value).click();
});
