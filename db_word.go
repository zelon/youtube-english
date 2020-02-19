package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"cloud.google.com/go/datastore"
)

func RegisterInsertWordHandler() {
	http.HandleFunc("/db/insert_word", insert_handler)
}

func RegisterSelectWordHandler() {
	http.HandleFunc("/db/select_word", select_handler)
}

func insert_handler(w http.ResponseWriter, r *http.Request) {
	video_id := r.FormValue("video_id")
	word := r.FormValue("word")
	position_str := r.FormValue("position")

	position_int, err := strconv.Atoi(position_str)
	if err != nil || position_int < 0 {
		log.Fatalf("minus position")
	}

	db_insert(video_id, word, position_int)
}

func select_handler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	client, err := datastore.NewClient(ctx, "tube-english")
	video_id := r.FormValue("video_id")
	query := datastore.NewQuery("SearchedWord").
		Filter("VideoId =", video_id)

	var words []SearchedWord
	_, err = client.GetAll(ctx, query, &words)
	if err != nil {
		log.Fatalf("Cannot get words: %v", err)
		return
	}
	jsoned, err := json.Marshal(words)
	if err != nil {
		log.Fatalf("Cannot json, err:%v", err)
		return
	}
	fmt.Fprint(w, string(jsoned))
}

type SearchedWord struct {
	VideoId  string
	Word     string
	Position int
}

func db_insert(video_id string, word string, position int) {
	searched_word := SearchedWord{
		VideoId:  video_id,
		Word:     word,
		Position: position,
	}
	ctx := context.Background()
	client, err := datastore.NewClient(ctx, "tube-english")
	if err != nil {
		log.Fatal("Cannot create client")
	}
	_, err = client.Put(ctx, datastore.IncompleteKey("SearchedWord", nil), &searched_word)
	if err != nil {
		log.Fatalf("datastore put error: %v", err)
	}
}
