var reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=");

function loadVideo(iframe) {
  $.getJSON(reqURL + iframe.getAttribute('cid'),
    function(data) {
      var link = data.items[0].link;
      id = link.substr(link.indexOf("=") + 1);
      iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + id + "?modestbranding=1&widget_referrer");
    }
  );
}

var iframes = document.getElementsByClassName('latestVideoEmbed');
for (var i = 0, len = iframes.length; i < len; i++) {
  loadVideo(iframes[i]);
}
