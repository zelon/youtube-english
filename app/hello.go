package youtube_english

import (
    "fmt"
    "net/http"
)

func init() {
    http.HandleFunc("/hello", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, world!")
}
