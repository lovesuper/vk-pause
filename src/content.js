// TODO: write design checker
$(document).ready(function() {
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var oldVkPlayBtn = document.querySelector(OLD_VK_SEL.playstop.value);
  var newVkPlayBtn = document.querySelector(NEW_VK_SEL.playstop.value);

  if (oldVkPlayBtn) {
    var observer = new MutationObserver(function(mutations, observer) {
      var className = mutations[0].target.className;
      if(className == OLD_VK_SEL.playingFlag.value) {
        reportPlayingState(STATE.paused);
      }
      else if (className == OLD_VK_SEL.pausedFlag.value) {
        reportPlayingState(STATE.playing);
      }
    });
    observer.observe(oldVkPlayBtn, { subtree: true, attributes: true });
    return;
  }

  if(newVkPlayBtn) {
    var observer = new MutationObserver(function(mutations, observer) {
      var className = mutations[0].target.className;
      if(className == NEW_VK_SEL.playingFlag.value) {
        reportPlayingState(STATE.playing);
      }
      else if (className == NEW_VK_SEL.pausedFlag.value) {
        reportPlayingState(STATE.paused);
      }
    });
    observer.observe(newVkPlayBtn, { subtree: true, attributes: true });
  }

});

function reportPlayingState(playingState) {
  chrome.runtime.sendMessage({ state: playingState.value }, function(response) {});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd == COMMAND.setToPlay.value) {
    var className = $(OLD_VK_SEL.playstop.value).attr("class");
    var newClassName = $(NEW_VK_SEL.play.value);
    if(className != OLD_VK_SEL.playingFlag.value){
      $(OLD_VK_SEL.playBtn.value).click();
    } else if (newClassName) {
      $(NEW_VK_SEL.playBtn.value).click();
    }

    sendResponse({ "state" : STATE.paused.value});
    return;
  }

  if (request.cmd == COMMAND.setToPause.value) {
    $(NEW_VK_SEL.play.value).click();
    sendResponse({ "state" : STATE.playing.value});
    return;
  }

  if (request.cmd == COMMAND.setToNext.value) {
    $(NEW_VK_SEL.next.value).click()
    sendResponse({ "state" : STATE.playing.value});
    return;
  }
});

