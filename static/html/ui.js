
function make_rate_buttons() {
  var rate_div = document.getElementById("rate");
	var rate_list = player.getAvailablePlaybackRates();
  var html = "속도 조절 :";

  if (rate_list.length == 0) {
    rate_div.innerHTML = html + " 불가능";
    return;
  }
  for (var i=0; i<rate_list.length; ++i) {
    var speed = rate_list[i];
    html += "&nbsp;<button onclick='set_rate(" + speed + ");'>" + speed + "</button>";
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
  if (current > range[1]) {
    player.seekTo(range[0]);
  }
}

function OnTimer() {
  var current = player.getCurrentTime();
  progress_bar_slider.slider('setValue', current);

  check_repeat();

  setTimeout(OnTimer, 500);
}

function onYoutubePlayingStarted() {
  set_progressbar_values_by_video();
  setTimeout(OnTimer, 500);
}
/*
 현재 재생 시간(초) : player.getCurrentTime():Number
 전체 재생 시간 : player.getDuration():Number 단, 재생이 시작된 직후부터 가능. 이전에는 0 이 반환됨
 특정 시간부터 재생(초) : player.seekTo(seconds:Number)
*/
