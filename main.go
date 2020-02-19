package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", xmlHandler)

	RegisterInsertVideoHandler()
	RegisterSelectVideoHandler()

	RegisterInsertWordHandler()
	RegisterSelectWordHandler()

	// Serve static files out of the public directory.
	// By configuring a static handler in app.yaml, App Engine serves all the
	// static content itself. As a result, the following two lines are in
	// effect for development only.
	static_dir := http.StripPrefix("/static", http.FileServer(http.Dir("static")))
	http.Handle("/static/", static_dir)

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
