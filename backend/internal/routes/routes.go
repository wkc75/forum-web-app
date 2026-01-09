package routes

import (
	"database/sql"
	"net/http"
	"strings"

	"CVWO_Assignment_backend/internal/handlers"
	"CVWO_Assignment_backend/internal/middleware"
)

func RegisterRoutes(db *sql.DB) {
	commentHandler := &handlers.CommentHandler{DB: db}
	postHandler := &handlers.PostHandler{DB: db}
	topicHandler := &handlers.TopicHandler{DB: db}
	authHandler := &handlers.AuthHandler{DB: db}

	// ======================
	// Auth
	// ======================
	http.HandleFunc("/api/login", authHandler.Login)
	http.HandleFunc("/api/logout", authHandler.Logout)
	http.HandleFunc("/api/me", authHandler.Me)

	// ======================
	// Topics (list + create)
	// ======================
	http.HandleFunc("/api/topics", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			topicHandler.GetTopics(w, r)
		case http.MethodPost:
			middleware.RequireAuth(topicHandler.CreateTopic)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// ======================
	// Topic by ID (get + delete)
	// ======================
	http.HandleFunc("/api/topics/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			topicHandler.GetTopicByID(w, r)
		case http.MethodDelete:
			middleware.RequireAuth(topicHandler.DeleteTopic)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// ======================
	// Posts (list + create)
	// ======================
	http.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			postHandler.GetPosts(w, r)
		case http.MethodPost:
			middleware.RequireAuth(postHandler.CreatePost)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// ======================
	// Post by ID (get + delete + like)
	// ======================
	http.HandleFunc("/api/posts/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/like") {
			if r.Method == http.MethodPost {
				middleware.RequireAuth(postHandler.LikePost)(w, r)
				return
			}
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		switch r.Method {
		case http.MethodGet:
			postHandler.GetPostByID(w, r)
		case http.MethodDelete:
			middleware.RequireAuth(postHandler.DeletePost)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// ======================
	// Comments (list + create)
	// ======================
	http.HandleFunc("/api/comments", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			commentHandler.GetComments(w, r)
		case http.MethodPost:
			middleware.RequireAuth(commentHandler.CreateComment)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// ======================
	// Comment by ID (delete)
	// ======================
	http.HandleFunc("/api/comments/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			middleware.RequireAuth(commentHandler.DeleteComment)(w, r)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})
}
