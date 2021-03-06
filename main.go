package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"text/template"
)

func main() {
	router := http.NewServeMux()

	router.HandleFunc("/", handleIndexHtm)
	router.HandleFunc("/view.htm", handleViewHtm)

	router.HandleFunc("/db/insert_video", handle_insert_video)
	router.HandleFunc("/db/select_video", handle_select_video)
	router.HandleFunc("/db/insert_word", insert_handler)
	router.HandleFunc("/db/select_word", select_handler)

	// Serve static files out of the public directory.
	// By configuring a static handler in app.yaml, App Engine serves all the
	// static content itself. As a result, the following two lines are in
	// effect for development only.
	router.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("static"))))

	http.Handle("/", router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}

func xmlHandler(writer http.ResponseWriter, request *http.Request) {
	log.Printf("requested uri:" + request.RequestURI)
	fmt.Fprint(writer, "Hello, World!")
}

func responseHtm(writer http.ResponseWriter, localPath string) {
	t, err := template.ParseFiles(localPath)
	if err != nil {
		panic(err)
	}

	writer.Header().Add("Content-Type", "text/html")

	t.Execute(writer, nil)
}

func handleIndexHtm(writer http.ResponseWriter, request *http.Request) {
	log.Printf("handleIndexHtm: %s", request.RequestURI)
	responseHtm(writer, "static/htm/index.htm")
}

func handleViewHtm(writer http.ResponseWriter, request *http.Request) {
	log.Printf("handleViewHtm: %s", request.RequestURI)
	responseHtm(writer, "static/htm/view.htm")
}
