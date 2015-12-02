// content script

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd == "changeMode") {
     $("#gp_play").click();
    sendResponse({result: "clicked"});
  }
});
