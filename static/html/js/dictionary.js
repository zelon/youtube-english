
var dictionary_data = {
  "daum": {
    search_button_name:"Daum Dictionary",
    input_value:"daum",
    search_url: "http://small.dic.daum.net/search.do?q="
  },
  "longman": {
    search_button_name:"Longman Dictionary",
    input_value:"longman",
    search_url: "http://www.ldoceonline.com/search/?q="
  }
};

function InitializeDictionaryButtons() {
  jQuery("#dic_daum").click(function(e){
    SetDictionary("daum");
    e.preventDefault();
  });
  jQuery("#dic_longman").click(function(e){
    SetDictionary("longman");
    e.preventDefault();
  });
  SetDictionary("daum");
}

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

function RequestSearchedWord() {
  $.ajax({
    method: "POST",
    url: "/db/select",
    data: { video_id:GetCurrentVideoId()}
  }).done(function(msg) {
    var jsoned = JSON.parse(msg);

    if (!jsoned) {
      return;
    }

    InitializeWordCloud(jsoned);
  });
}

function InitializeWordCloud(jsoned) {
  var word_array = [];

  for (var i=0; i<jsoned.length; ++i) {
    var word = jsoned[i].Word;
    var found = false;
    for (var j=0; j<word_array.length; ++j) {
      if (word_array[j].text == word) {
        word_array[j].weight = word_array[j].weight + 1;
        found = true;
        break;
      }
    }
    if (found == false) {
      word_array.push({text: jsoned[i].Word, weight: 1, link: { href:'javascript:SearchFromCloud("' + jsoned[i].Word + '");' }});
    }
  }
  $("#word_cloud").jQCloud(word_array);
}
