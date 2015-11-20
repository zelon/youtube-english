chrome.browserAction.onClicked.addListener(function(tab) {
	var current_url = tab.url;
  var target_url = "http://tube-english.appspot.com/view.htm?q=" + current_url;
  chrome.tabs.update(tab.id, { url: target_url });
});
