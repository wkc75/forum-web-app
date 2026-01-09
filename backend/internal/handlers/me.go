package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"CVWO_Assignment_backend/internal/middleware"
	"CVWO_Assignment_backend/internal/models"
)

type MeHandler struct {
	DB *sql.DB
}

func (h *MeHandler) GetMyPosts(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r)

	rows, err := h.DB.Query(`
		SELECT posts.id, posts.title, posts.content, posts.topic_id, topics.name,
		       posts.creator_username, posts.created_at, posts.likes_count
		FROM posts
		JOIN topics ON posts.topic_id = topics.id
		WHERE posts.creator_username = ?
		ORDER BY posts.created_at DESC
	`, user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var p models.Post
		if err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Content,
			&p.TopicID,
			&p.TopicName,
			&p.CreatorUsername,
			&p.CreatedAt,
			&p.LikesCount,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func (h *MeHandler) GetMyComments(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetUserFromContext(r)

	rows, err := h.DB.Query(`
		SELECT comments.id, comments.content, comments.post_id, posts.title,
		       comments.creator_username, comments.created_at
		FROM comments
		JOIN posts ON comments.post_id = posts.id
		WHERE comments.creator_username = ?
		ORDER BY comments.created_at DESC
	`, user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	comments := []models.Comment{}
	for rows.Next() {
		var c models.Comment
		if err := rows.Scan(
			&c.ID,
			&c.Content,
			&c.PostID,
			&c.PostTitle,
			&c.CreatorUsername,
			&c.CreatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		comments = append(comments, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
