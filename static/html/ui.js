
function GetVideoIdFromUrl(url) {
  // url = https://www.youtube.com/watch?v=RPISHaOIg6M
  var find_index = url.indexOf("v=");
  if (find_index < 0) {
    return "";
  }
  return url.substr(find_index + 2, 11);
}

function GetQueryStringFromAddressBar() {
  var current_url = unescape(window.location.href);
  var after_q_index = current_url.indexOf("?q=");
  if (after_q_index < 0) {
    return "";
  }
  return current_url.substr(after_q_index + 3);
}

function GetCurrentVideoId() {
  return GetVideoIdFromUrl(player.getVideoUrl());
}

function make_rate_buttons() {
  var rate_div = document.getElementById("rate");
	var rate_list = player.getAvailablePlaybackRates();
  var html = "";

  if (rate_list.length == 0) {
    rate_div.innerHTML = "Disabled";
    return;
  }
  for (var i=0; i<rate_list.length; ++i) {
    var speed = rate_list[i];
    html += "<button onclick='set_rate(" + speed + ");'>" + speed + "x</button>";
  }
  rate_div.innerHTML = html;
}

function stopVideo() {
  player.stopVideo();
}

function set_rate(speed) {
  player.setPlaybackRate(speed);
}

function onUrl() {
	var url = document.getElementById("url").value;
	player.loadVideoByUrl("http://www.youtube.com/v/xruZHVN8OZ8?version=3");
}

function set_progressbar_values_by_video() {
  var total_seconds = Math.floor(player.getDuration());
  var current_max_seconds = progress_bar_slider.slider('getAttribute', 'max');
  if (total_seconds == current_max_seconds) {
    return;
  }
  progress_bar_slider.slider('setAttribute', 'max', total_seconds);
  repeat_bar_slider.slider('setAttribute', 'max', total_seconds);
  repeat_bar_slider.slider('setValue', [0,total_seconds]);
}

function check_repeat() {
  var current = player.getCurrentTime();
  var range = repeat_bar_slider.slider('getValue');

  // repeat bar 오른쪽을 지나갔으면, 왼쪽 bar 로 보낸다
  if (current >= range[1]) {
    player.seekTo(range[0]);
  }
}

function OnTimer() {
  setTimeout(OnTimer, 500);

  if (!player) {
    return;
  }
  if (!player.getCurrentTime) {
    return;
  }
  var current = player.getCurrentTime();
  progress_bar_slider.slider('setValue', current);

  check_repeat();
}

function onYoutubePlayingStarted() {
  set_progressbar_values_by_video();
}

function TurnOnCaption() {
  player.loadModule("captions");
  player.setOption("captions", "track", {"languageCode":"en"});
}

function TurnOffCaption() {
  player.unloadModule("captions");
}

function BackSeconds(seconds) {
  var current = player.getCurrentTime();
  var new_position = current - seconds;

  if (new_position < 0) {
    new_position = 0;
  }
  player.seekTo(new_position);
}

function ResizePlayer() {
  if (!player) {
    return;
  }
  if (player) {
    var outer_width = document.getElementById("player_outer").offsetWidth;

    var new_width = Math.floor(outer_width);
    var new_height = Math.floor(390 * new_width / 640);
    player.setSize(new_width, new_height);
  }
}
/*
 현재 재생 시간(초) : player.getCurrentTime():Number
 전체 재생 시간 : player.getDuration():Number 단, 재생이 시작된 직후부터 가능. 이전에는 0 이 반환됨
 특정 시간부터 재생(초) : player.seekTo(seconds:Number)
*/
