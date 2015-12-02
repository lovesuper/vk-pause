// content script

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("VK-Pause requested")
    if (request.cmd == "stopIt!")
       $("#gp_play").click();
      sendResponse({result: "ok. clicked"});
  });
