// content script

// functions
$(function () {
   // chrome.runtime.sendMessage({request: "reqStats"});
   console.log("got it!");
});

$(document).ready(function () {
   // chrome.runtime.sendMessage({request: "reqStats"});
   console.log("I am ready!");
});

// listeners

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.request === "resStats") {
      console.log("message recieved");
      setUpCharts();
      updateContent(request.videoStat, request.channelStat);
    }
  }
);

function updateContent(videoStat, channelStat) {
  if ($("#aktilion-extension").length === 0) {
    $.get(chrome.extension.getURL('src/content.tmpl'), function(html) {
      console.log("starting injecting view with stats");
      Mustache.parse(html);
      var html = Mustache.render(html, {
        prefix: chrome.extension.getURL('/'),
        videoViewCount: videoStat.viewCount,
        videoCommentCount: videoStat.commentCount,
        videoLikeCount: videoStat.likeCount,
        videoDislikeCount: videoStat.dislikeCount,
        videoLikePercentage: Math.ceil(videoStat.likeCount / ((parseInt(videoStat.likeCount) + parseInt(videoStat.dislikeCount)) / 100)) ,
        channelSubscriberCount: channelStat.subscriberCount,
        channelVideoCount: channelStat.videoCount,
        channelViewCount: channelStat.viewCount,
        videoInvolvement: 0,
        channelInvolvement: 0, // Вовлеченность в канал. Не хватает данных
        socialInvolvement: 0, // Вовлеченность в социальную активность. Не хватает данных
        retweetsCount: 0, // Кол-во ретвитов. Пока неизвестно где взять
        gPlusesCount: 0, // Кол-во плюсов в G+. Пока неизвестно где взять
        fbShares: 0, // Кол-во репостов в фейсбук. Пока неизвестно где взять
        vkReposts: 0 // Кол-во репостов во ВКонтакте. Пока неизвестно где взять
      });
      console.log("injecting VIEW!");
      $("#watch7-sidebar").prepend(html);
      var ctx = $("#myChart").get(0).getContext("2d");
      var data = [
        {
            value: videoStat.likeCount,
            color:"#33AA94",
            highlight: "#33AA94",
            label: "Лайки"
        },
        {
            value: videoStat.dislikeCount,
            color: "#fff",
            highlight: "#fff",
            label: "Дизлайки"
        },
      ]

      var options = {
        // //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        // //String - The colour of each segment stroke
        segmentStrokeColor : "#33AA94",
        // //Number - The width of each segment stroke
        segmentStrokeWidth : 1,
        // //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout : 70, // This is 0 for Pie charts

        // //Number - Amount of animation steps
        // animationSteps : 100,

        // //String - Animation easing effect
        // animationEasing : "easeOutBounce",

        // //Boolean - Whether we animate the rotation of the Doughnut
        // animateRotate : true,

        // //Boolean - Whether we animate scaling the Doughnut from the centre
        // animateScale : false,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

      }
      var myDoughnutChart = new Chart(ctx).Doughnut(data, options);
    });
    console.log("injecting done");
  }
}

function setUpCharts() {
  Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    // Possible effects are:
    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
    //  easeOutElastic, easeInCubic]
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 10,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: false,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
  }
}
