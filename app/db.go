package tube_english

import (
  "encoding/json"
  "fmt"
  "net/http"
  "appengine"
  "appengine/datastore"
  "strconv"
)

func init() {
    http.HandleFunc("/db/insert", insert_handler)
    http.HandleFunc("/db/select", select_handler)
}

func insert_handler(w http.ResponseWriter, r *http.Request) {
    context := appengine.NewContext(r)
    video_id := r.FormValue("video_id")
    word := r.FormValue("word")
    position_str := r.FormValue("position")
    context.Infof("video_id: " + word)
    context.Infof("word: " + word)
    context.Infof("position: " + position_str)

    position_int, err := strconv.Atoi(position_str)
    if err != nil || position_int < 0 {
      context.Errorf("minus position")
      return;
    }

    db_insert(context, video_id, word, position_int)
}

func select_handler(w http.ResponseWriter, r *http.Request) {
    context := appengine.NewContext(r)
    video_id := r.FormValue("video_id")
    context.Infof("select video_id:%s", video_id)
    query := datastore.NewQuery("SearchedWord").
                        Filter("VideoId =", video_id)

    var words []SearchedWord
    _, err := query.GetAll(context, &words)
    if err != nil {
      context.Errorf("Cannot get words: " + err.Error())
      return
    }
    context.Infof("len: %d", len(words))

    for _, value := range words {
      context.Infof("video_id:%s %d %s", value.VideoId, value.Position, value.Word)
    }

    context.Infof("here")

    jsoned, err := json.Marshal(words)
    if err != nil {
      context.Errorf("Cannot json, err:" + err.Error())
      return
    }
    fmt.Fprint(w, string(jsoned))
}

type SearchedWord struct {
  VideoId  string
  Word     string
  Position int
}

func db_insert(context appengine.Context, video_id string, word string, position int) {
  searched_word := SearchedWord {
    VideoId: video_id,
    Word: word,
    Position: position,
  }

  key, err := datastore.Put(context, datastore.NewIncompleteKey(context, "SearchedWord", nil), &searched_word)
  if err != nil {
    context.Errorf("datastore put error: " + err.Error())
    return
  }
  context.Infof("datastore put good job")
  context.Infof(key.AppID())
}
