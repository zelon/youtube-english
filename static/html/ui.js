
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

function set_rate(speed) {
  player.setPlaybackRate(speed);
}
function onUrl() {
	var url = document.getElementById("url").value;
	player.loadVideoByUrl("http://www.youtube.com/v/xruZHVN8OZ8?version=3");
}
