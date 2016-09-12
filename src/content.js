(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var playBtn = document.querySelector(SELECTORS.playstop.value);
  if(playBtn) {
    new MutationObserver(function(mutations, observer) {
      state = mutations[0].target.className.includes("top_audio_player_playing") ?  STATE.paused.value : STATE.playing.value;
      chrome.runtime.sendMessage( { "state": state } );
    }).observe(playBtn, { subtree: true, attributes: true });
  }

  var titleBar = document.querySelector(".top_audio_player_title_wrap");
  if(titleBar) {
    new MutationObserver(function(mutations, observer) {
      var currentTitle = mutations[0].target.innerText;
      chrome.runtime.sendMessage( { "title": currentTitle } );
    }).observe(titleBar, { subtree: true, attributes: true });
  }

})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  document.querySelector(SELECTORS[request.value].value).click();
});
