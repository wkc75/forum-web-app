package routes

import (
	"database/sql"
	"net/http"

	"CVWO_Assignment_backend/internal/handlers"
)

func RegisterRoutes(db *sql.DB) {
	commentHandler := &handlers.CommentHandler{DB: db}
	postHandler := &handlers.PostHandler{DB: db}
	topicHandler := &handlers.TopicHandler{DB: db}
	authHandler := &handlers.AuthHandler{DB: db}
	meHandler := &handlers.MeHandler{DB: db}
	minimalHandler := &handlers.MinimalHandler{DB: db}

	// ======================
	// Minimal tutorial API
	// ======================
	http.HandleFunc("/api/minimal/health", minimalHandler.Health)
	http.HandleFunc("/api/minimal/profile", minimalHandler.Profile)

	// ======================
	// Minimal tutorial API
	// ======================
	http.HandleFunc("/api/minimal/health", minimalHandler.Health)
	http.HandleFunc("/api/minimal/profile", minimalHandler.Profile)
}
