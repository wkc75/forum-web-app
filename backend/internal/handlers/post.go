package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"CVWO_Assignment_backend/internal/middleware"
	"CVWO_Assignment_backend/internal/models"
)

type PostHandler struct {
	DB *sql.DB
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Title   string `json:"title"`
		Content string `json:"content"`
		TopicID int    `json:"topicId"`
	}

	var body request
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if body.Title == "" || body.Content == "" || body.TopicID == 0 {
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

	result, err := h.DB.Exec(
		`INSERT INTO posts (title, content, topic_id, creator_username, created_at)
		 VALUES (?, ?, ?, ?, datetime('now'))`,
		body.Title,
		body.Content,
		body.TopicID,
		user,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	topicID := r.URL.Query().Get("topicId")
	search := strings.TrimSpace(r.URL.Query().Get("q"))
	sort := r.URL.Query().Get("sort")

	query := `
		SELECT posts.id, posts.title, posts.content, posts.topic_id, topics.name,
		       posts.creator_username, posts.created_at, posts.likes_count
		FROM posts
		JOIN topics ON posts.topic_id = topics.id
	`
	conditions := []string{}
	args := []interface{}{}

	if topicID != "" {
		conditions = append(conditions, "posts.topic_id = ?")
		args = append(args, topicID)
	}

	if search != "" {
		conditions = append(conditions, "(posts.title LIKE ? OR posts.content LIKE ?)")
		like := "%" + search + "%"
		args = append(args, like, like)
	}

	if len(conditions) > 0 {
		query += " WHERE " + strings.Join(conditions, " AND ")
	}

	switch sort {
	case "popular":
		query += " ORDER BY posts.likes_count DESC, posts.created_at DESC"
	default:
		query += " ORDER BY posts.created_at DESC"
	}

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	posts := []models.Post{}

	for rows.Next() {
		var p models.Post
		err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Content,
			&p.TopicID,
			&p.TopicName,
			&p.CreatorUsername,
			&p.CreatedAt,
			&p.LikesCount,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func (h *PostHandler) LikePost(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path // /api/posts/1/like
	parts := strings.Split(path, "/")

	if len(parts) != 5 || parts[4] != "like" {
		http.NotFound(w, r)
		return
	}

	postID := parts[3]

	_, err := h.DB.Exec(
		`UPDATE posts
		 SET likes_count = likes_count + 1
		 WHERE id = ?`,
		postID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/posts/")
	id = strings.TrimSuffix(id, "/")

	user := middleware.GetUserFromContext(r)

	var owner string
	err := h.DB.QueryRow(
		`SELECT creator_username FROM posts WHERE id = ?`,
		id,
	).Scan(&owner)

	if err == sql.ErrNoRows {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	if owner != user {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = h.DB.Exec(`DELETE FROM posts WHERE id = ?`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *PostHandler) GetPostByID(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/posts/")
	id = strings.TrimSuffix(id, "/")

	var post models.Post
	err := h.DB.QueryRow(`
		SELECT posts.id, posts.title, posts.content, posts.topic_id, topics.name,
		       posts.creator_username, posts.created_at, posts.likes_count
		FROM posts
		JOIN topics ON posts.topic_id = topics.id
		WHERE posts.id = ?
	`, id).Scan(
		&post.ID,
		&post.Title,
		&post.Content,
		&post.TopicID,
		&post.TopicName,
		&post.CreatorUsername,
		&post.CreatedAt,
		&post.LikesCount,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}
