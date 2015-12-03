chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd == "changeMode") {
    $("#gp_play").click();
    sendResponse({result: "ok"});
  }
});

$(document).ready(function () {
  $("#ac_play").click(function() {
    console.log("play/stop clicked");
    chrome.runtime.sendMessage({stateSwitched: "yes"}, function(response) {
      console.log(response.result);
    });
  });
});
