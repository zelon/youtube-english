
function InitializeFrontPage() {
  $.ajax({
    url: "/db/select_video"
  }).done(function(msg) {
    var jsoned = JSON.parse(msg);
    var videos = "";
    for (var i=0; i<jsoned.length; ++i) {
      if (i == 3) {
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
  return seconds;
}

function MakeLink(video) {
  var detail = JSON.parse(video.Detail)
  var img = detail.items[0].snippet.thumbnails.high.url;
  var play_url = "view.htm?q=v=" + video.VideoId;
  var html_template = '<div class="col-sm-6 col-md-4"> \
    <div class="thumbnail"> \
      <img src="' + img + '" alt="..."> \
      <div class="caption"> \
        <h3>Thumbnail label</h3> \
        <p>재생 시간: ' + MakeSecondsEasyToRead(video.Duration) + ' 초</p> \
        <p><a href="' + play_url + '" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p> \
      </div> \
    </div> \
  </div> \
';
  var output = "<a href='" + play_url + "'><img src='" + img + "'/></a>";
  return html_template;
}
