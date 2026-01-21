package routes

import (
	"database/sql"
	"net/http"

	"CVWO_Assignment_backend/internal/handlers"
)

func RegisterRoutes(db *sql.DB) {
	minimalHandler := &handlers.MinimalHandler{DB: db}

	// ======================
	// Minimal tutorial API
	// ======================
	http.HandleFunc("/api/minimal/health", minimalHandler.Health)
	http.HandleFunc("/api/minimal/profile", minimalHandler.Profile)
}
