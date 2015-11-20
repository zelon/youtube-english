
function InitializeFrontPage() {
  $.ajax({
    url: "/db/select_video"
  }).done(function(msg) {
    var jsoned = JSON.parse(msg);
    var videos = "";
    for (var i=0; i<jsoned.length; ++i) {
      if (i == 4) {
        break;
      }
      videos = videos + " " + MakeLink(jsoned[i]);

    }
    document.getElementById("watched_videos").innerHTML = videos;
  });
}

function InsertVideo() {
  var duration_seconds = Math.floor(player.getDuration());

  $.ajax({
    method: "POST",
    url: "/db/insert_video",
    data: { video_id:GetCurrentVideoId(), duration:duration_seconds}

  });
}

function MakeSecondsEasyToRead(seconds) {
  var output = "";
  var kHour = 60 * 60;
  var kMinute = 60;
  if (seconds > hour) {
    var hour = Math.floor(seconds / kHour);
    output = output + hour + "시간 ";
    seconds -= hour * kHour;
  }
  if (seconds > kMinute) {
    var minutes = Math.floor(seconds / kMinute);
    output = output + minutes + "분 ";
    seconds -= minutes * kMinute;
  }
  if (seconds > 0) {
    output = output + seconds + "초";
  }
  return output;
}

function MakeLink(video) {
  var detail = JSON.parse(video.Detail)
  var img = detail.items[0].snippet.thumbnails.high.url;
  var play_url = "view.htm?q=v=" + video.VideoId;
  var html_template = '<div class="col-sm-3 col-md-3"> \
    <div class="thumbnail"> \
      <a href="' + play_url + '"><img src="' + img + '" alt="..."></a> \
      <div class="caption center"> \
        <h3>Thumbnail label</h3> \
        <p>재생 시간: ' + MakeSecondsEasyToRead(video.Duration) + '</p> \
        <p><a href="' + play_url + '" class="btn btn-primary" role="button">Play</a></p> \
      </div> \
    </div> \
  </div> \
';
  var output = "<a href='" + play_url + "'><img src='" + img + "'/></a>";
  return html_template;
}
