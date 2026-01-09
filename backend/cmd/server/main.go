package main

import (
	"fmt"
	"log"
	"net/http"

	"CVWO_Assignment_backend/internal/db"
	"CVWO_Assignment_backend/internal/middleware"
	"CVWO_Assignment_backend/internal/routes"
)

func main() {
	database, err := db.InitDB("forum.db")
	if err != nil {
		log.Fatal(err)
	}

	routes.RegisterRoutes(database)

	fmt.Println("Database connected successfully.")
	fmt.Println("listening on port 8000 at http://localhost:8000")

	handler := middleware.EnableCORS(http.DefaultServeMux)
	http.ListenAndServe(":8000", handler)

}
