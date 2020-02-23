package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"cloud.google.com/go/datastore"
)

type Video struct {
	VideoId  string
	Duration int
	Detail   string `datastore:",noindex"`
}

func get_detail(video_id string) string {
	get_url := "https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=AIzaSyBOaBUHwNC6OXUFymBnpWjodVAc6SUMquY&part=snippet,statistics"

	response, err := http.Get(get_url)
	if err != nil {
		log.Fatalf("Cannot http.Get:%v", err)
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatalf("Cannot read body")
	}

	return string(body)
}

func handle_insert_video(w http.ResponseWriter, r *http.Request) {
	video_id := r.FormValue("video_id")
	duration_str := r.FormValue("duration")
	detail := get_detail(video_id)

	duration_int, err := strconv.Atoi(duration_str)
	if err != nil || duration_int < 0 {
		log.Printf("invalid duration")
		return
	}

	insert_video_db(video_id, duration_int, detail)
}

func insert_video_db(video_id string, duration int, detail string) {
	video := Video{
		VideoId:  video_id,
		Duration: duration,
		Detail:   detail,
	}
	ctx := context.Background()
	client, err := datastore.NewClient(ctx, "tube-english")
	if err != nil {
		log.Printf("Cannot create client")
		return
	}
	// https://cloud.google.com/datastore/docs/reference/libraries?hl=ko
	_, err = client.Put(ctx, datastore.IncompleteKey("Video", nil), &video)
	if err != nil {
		log.Printf("datastore put error:%v", err)
		return
	}
}

func handle_select_video(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client, err := datastore.NewClient(ctx, "tube-english")
	if err != nil {
		log.Printf("Failed to create client: %v", err)
		return
	}
	query := datastore.NewQuery("Video")

	var videos []Video
	_, err = client.GetAll(ctx, query, &videos)
	if err != nil {
		log.Printf("Cannot get videoes")
		return
	}

	jsoned, err := json.Marshal(videos)
	if err != nil {
		log.Printf("Cannot json, err:" + err.Error())
		return
	}
	fmt.Fprint(w, string(jsoned))
}
