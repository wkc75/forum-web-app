package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"CVWO_Assignment_backend/internal/middleware"
	"CVWO_Assignment_backend/internal/models"
)

type CommentHandler struct {
	DB *sql.DB
}

func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Content string `json:"content"`
		PostID  int    `json:"postId"`
	}

	var body request
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if body.Content == "" || body.PostID == 0 {
		http.Error(w, "Missing fields", http.StatusBadRequest)
		return
	}

	user := middleware.GetUserFromContext(r)

	_, err := h.DB.Exec(
		"INSERT OR IGNORE INTO users (username) VALUES (?)",
		user,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = h.DB.Exec(
		`INSERT INTO comments (content, post_id, creator_username, created_at)
		 VALUES (?, ?, ?, datetime('now'))`,
		body.Content,
		body.PostID,
		user,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *CommentHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postId")
	if strings.TrimSpace(postID) == "" {
		http.Error(w, "postId is required", http.StatusBadRequest)
		return
	}

	rows, err := h.DB.Query(`
		SELECT comments.id, comments.content, comments.post_id, posts.title,
		       comments.creator_username, comments.created_at
		FROM comments
		JOIN posts ON comments.post_id = posts.id
		WHERE comments.post_id = ?
		ORDER BY comments.created_at ASC
	`, postID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	comments := []models.Comment{}

	for rows.Next() {
		var c models.Comment
		err := rows.Scan(
			&c.ID,
			&c.Content,
			&c.PostID,
			&c.PostTitle,
			&c.CreatorUsername,
			&c.CreatedAt,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		comments = append(comments, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}

func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/comments/")
	user := middleware.GetUserFromContext(r)

	var owner string
	err := h.DB.QueryRow(
		`SELECT creator_username FROM comments WHERE id = ?`,
		id,
	).Scan(&owner)

	if err != nil {
		http.Error(w, "Comment not found", http.StatusNotFound)
		return
	}

	if owner != user {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = h.DB.Exec(`DELETE FROM comments WHERE id = ?`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
