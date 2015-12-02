// background script

// functions

function getVideoStat() {
  var APIKey = ""
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    gapi.client.load('youtube', 'v3', function() {
      gapi.client.setApiKey(APIKey);
      var videoId = tabs[0].url.split('=')[1];
      var videoRequest = gapi.client.youtube.videos.list({id: [videoId], part: 'id,statistics,snippet'});
      videoRequest.execute(function(response) {
        if('error' in response) {
          console.log(response.error.message);
        } else {
          var videoStat = response.items[0];
          chrome.storage.sync.set({videoStat: videoStat, dateTime: new Date()}, function(){});
          console.log("video stats recieved for " + videoId);
          getChannelStat(videoStat, tabs[0], APIKey)
        }
      });
    });
  });
}

function getChannelStat(videoStat, activeTab, APIKey) {
  gapi.client.load('youtube', 'v3', function() {
    var channelRequest = gapi.client.youtube.channels.list({id: [videoStat.snippet.channelId], part: 'id,statistics'});
    channelRequest.execute(function(response) {
      if ('error' in response) {
        console.log(response.error.message);
      } else {
        var channelStat = response.items[0];
        console.log("channel stats recieved for " + videoStat.snippet.channelId);
        chrome.storage.sync.set({channelStat: channelStat, dateTime: new Date()}, function() {});
        // send stats to content.js
        chrome.tabs.sendMessage(
          activeTab.id,
          {
           request: "resStats",
           videoStat: videoStat.statistics,
           channelStat: channelStat.statistics
          }
        );
        console.log("message sended back to content.js")
      }
    });
  });
}

// listeners

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // console.log("trying to inject view" + tab.url);
  // if(changeInfo && changeInfo.status == "complete"){
    console.log("injecting view!" + tab.url);
    getVideoStat();
  // }
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if(request.request == "reqStats") {
//     console.log("message recieved");
//     getVideoStat();
//   }
// });
