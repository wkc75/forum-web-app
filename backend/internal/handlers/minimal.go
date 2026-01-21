package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"
)

type MinimalHandler struct {
	DB *sql.DB
}

type healthCounts struct {
	Users    int `json:"users"`
	Topics   int `json:"topics"`
	Posts    int `json:"posts"`
	Comments int `json:"comments"`
}

type healthResponse struct {
	Message  string       `json:"message"`
	Database string       `json:"database"`
	Time     string       `json:"time"`
	Counts   healthCounts `json:"counts"`
}

func (h *MinimalHandler) Health(w http.ResponseWriter, r *http.Request) {
	var counts healthCounts
	err := h.DB.QueryRow(`
		SELECT
			(SELECT COUNT(*) FROM users),
			(SELECT COUNT(*) FROM topics),
			(SELECT COUNT(*) FROM posts),
			(SELECT COUNT(*) FROM comments)
	`).Scan(&counts.Users, &counts.Topics, &counts.Posts, &counts.Comments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := healthResponse{
		Message:  "Forum API running",
		Database: "ok",
		Time:     time.Now().Format(time.RFC3339),
		Counts:   counts,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type profileResponse struct {
	Username     string `json:"username"`
	PostCount    int    `json:"postCount"`
	CommentCount int    `json:"commentCount"`
}

func (h *MinimalHandler) Profile(w http.ResponseWriter, r *http.Request) {
	username := "demo_user"
	_, err := h.DB.Exec(
		"INSERT OR IGNORE INTO users (username) VALUES (?)",
		username,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var postCount int
	err = h.DB.QueryRow(
		"SELECT COUNT(*) FROM posts WHERE creator_username = ?",
		username,
	).Scan(&postCount)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var commentCount int
	err = h.DB.QueryRow(
		"SELECT COUNT(*) FROM comments WHERE creator_username = ?",
		username,
	).Scan(&commentCount)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := profileResponse{
		Username:     username,
		PostCount:    postCount,
		CommentCount: commentCount,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
