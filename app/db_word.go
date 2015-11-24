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
    http.HandleFunc("/db/insert_word", insert_handler)
    http.HandleFunc("/db/select_word", select_handler)
}

func insert_handler(w http.ResponseWriter, r *http.Request) {
    context := appengine.NewContext(r)
    video_id := r.FormValue("video_id")
    word := r.FormValue("word")
    position_str := r.FormValue("position")

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
    query := datastore.NewQuery("SearchedWord").
                        Filter("VideoId =", video_id)

    var words []SearchedWord
    _, err := query.GetAll(context, &words)
    if err != nil {
      context.Errorf("Cannot get words: " + err.Error())
      return
    }
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

  _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "SearchedWord", nil), &searched_word)
  if err != nil {
    context.Errorf("datastore put error: " + err.Error())
    return
  }
}
