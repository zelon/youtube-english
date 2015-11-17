
var dictionary_data = {
  "google": {
    search_button_name:"Google Dictionary",
    input_value:"google",
    search_url: "https://translate.google.com/#en/ko/"
  },
  "daum": {
    search_button_name:"Daum Dictionary",
    input_value:"daum",
    search_url: "http://small.dic.daum.net/search.do?q="
  },
  "naver": {
    search_button_name:"Naver Dictionary",
    input_value:"naver",
    search_url: "http://endic.naver.com/popManager.nhn?sLn=kr&m=search&searchOption=&query="
  }
};

function SetDictionary(dictionary_name) {
  var form_data = document.getElementById("dictionary_type");
  form_data.value = dictionary_data[dictionary_name].input_value;

  var search_button = document.getElementById("dictionary_search_button");
  search_button.textContent = dictionary_data[dictionary_name].search_button_name;
}

function SearchDictionary() {
  var word = document.getElementById("search_word").value;
  var current_playing_seconds = Math.floor(player.getCurrentTime());

  $.ajax({
    method: "POST",
    url: "/db/insert",
    data: { video_id:GetCurrentVideoId(), word:word, position:current_playing_seconds}
  });

  SearchFromIFrame(word)
}

function MakeSearchUrl(word) {
  var form_data = document.getElementById("dictionary_type");
  return dictionary_data[form_data.value].search_url + word;
}

function SearchFromIFrame(word) {
  var url = MakeSearchUrl(word);
  document.getElementById("embed_dictionary").src = url;
}

function SearchFromCloud(word) {
  SearchFromIFrame(word);
}

function MakeLinkFromWord(word) {
  var html = "<a href='javascript:SearchFromCloud(\"" + word + "\")'>" + word + "</a>";
  return html;
}

function RequestSearchedWord() {
  $.ajax({
    method: "POST",
    url: "/db/select",
    data: { video_id:GetCurrentVideoId()}
  }).done(function(msg) {
    var jsoned = JSON.parse(msg);

    var words = "";
    for (var i=0; i<jsoned.length; ++i) {
      words = words + " " + MakeLinkFromWord(jsoned[i].Word);
    }
    document.getElementById("word_cloud").innerHTML = words;
  });
}
