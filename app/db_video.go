package youtube_english

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "net/http"
  "appengine"
  "appengine/datastore"
  "appengine/urlfetch"
  "strconv"
)

func init() {
    http.HandleFunc("/db/insert_video", handle_insert_video)
    http.HandleFunc("/db/select_video", handle_select_video)
}

type Video struct {
  VideoId   string
  Duration  int
  Detail string
}

func get_detail(video_id string, context appengine.Context) string {
  get_url := "https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=AIzaSyDhQf1AvLQKAhLIaK9bz5KEtmls3BXRdn0&part=snippet,statistics&fields=items/snippet/thumbnails,items/statistics"

  context.Infof("url: " + get_url)

  client := urlfetch.Client(context)
  response, err := client.Get(get_url)
  if err != nil {
    context.Errorf("Cannot http.Get: " + err.Error())
    return "a"
  }
  defer response.Body.Close()
  body, err := ioutil.ReadAll(response.Body)
  if err != nil {
    context.Errorf("Cannot read body")
    return "b"
  }

  return string(body)
}

func handle_insert_video(w http.ResponseWriter, r *http.Request) {
    context := appengine.NewContext(r)

    video_id := r.FormValue("video_id")
    duration_str := r.FormValue("duration")
    detail := get_detail(video_id, context)

    context.Infof("Inserting video...")
    context.Infof("video_id: " + video_id)
    context.Infof("duration: " + duration_str)
    context.Infof("detail: " + detail)

    duration_int, err := strconv.Atoi(duration_str)
    if err != nil || duration_int < 0 {
      context.Errorf("invalid duration")
      return;
    }

    insert_video_db(context, video_id, duration_int, detail)
}

func insert_video_db(context appengine.Context, video_id string, duration int, detail string) {
  video := Video {
    VideoId: video_id,
    Duration: duration,
    Detail: detail,
  }

  key, err := datastore.Put(context, datastore.NewIncompleteKey(context, "Video", nil), &video)
  if err != nil {
    context.Errorf("datastore put error: " + err.Error())
    return
  }
  context.Infof("datastore put good job")
  context.Infof(key.AppID())
}

func handle_select_video(w http.ResponseWriter, r *http.Request) {
    context := appengine.NewContext(r)
    query := datastore.NewQuery("Video")

    var videos []Video
    _, err := query.GetAll(context, &videos)
    if err != nil {
      context.Errorf("Cannot get videoes")
      return
    }
    context.Infof("count: %d", len(videos))

    for _, value := range videos {
      context.Infof("video_id:%s %d %s", value.VideoId, value.Duration, value.Detail)
    }

    jsoned, err := json.Marshal(videos)
    if err != nil {
      context.Errorf("Cannot json, err:" + err.Error())
      return
    }
    fmt.Fprint(w, string(jsoned))
}
