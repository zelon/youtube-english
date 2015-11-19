chrome.browserAction.onClicked.addListener(function(tab) {
	var current_url = tab.url;
  var target_url = "http://youtube-english-1118.appspot.com/view.htm?q=" + current_url;
  chrome.tabs.update(tab.id, { url: target_url });
});
