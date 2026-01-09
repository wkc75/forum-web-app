package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"CVWO_Assignment_backend/internal/middleware"
	"CVWO_Assignment_backend/internal/models"
)

type TopicHandler struct {
	DB *sql.DB
}

func (h *TopicHandler) GetTopics(w http.ResponseWriter, r *http.Request) {
	search := strings.TrimSpace(r.URL.Query().Get("q"))

	query := `
		SELECT id, name, creator_username, created_at
		FROM topics
	`
	args := []interface{}{}
	if search != "" {
		query += " WHERE name LIKE ?"
		args = append(args, "%"+search+"%")
	}
	query += " ORDER BY created_at DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	topics := []models.Topic{}

	for rows.Next() {
		var t models.Topic
		err := rows.Scan(&t.ID, &t.Name, &t.CreatorUsername, &t.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		topics = append(topics, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topics)
}

func (h *TopicHandler) CreateTopic(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Name string `json:"name"`
	}

	var body request
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if body.Name == "" {
		http.Error(w, "Topic name required", http.StatusBadRequest)
		return
	}

	creator := middleware.GetUserFromContext(r)

	// ensure user exists
	_, err := h.DB.Exec(
		"INSERT OR IGNORE INTO users (username) VALUES (?)",
		creator,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = h.DB.Exec(
		`INSERT INTO topics (name, creator_username, created_at)
		 VALUES (?, ?, datetime('now'))`,
		body.Name,
		creator,
	)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed: topics.name") {
			http.Error(w, "Topic already exists", http.StatusBadRequest)
			return
		}
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *TopicHandler) GetTopicByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/api/topics/"):]

	row := h.DB.QueryRow(`
		SELECT id, name, creator_username, created_at
		FROM topics
		WHERE id = ?
	`, id)

	var t models.Topic
	err := row.Scan(&t.ID, &t.Name, &t.CreatorUsername, &t.CreatedAt)
	if err == sql.ErrNoRows {
		http.Error(w, "Topic not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}

func (h *TopicHandler) DeleteTopic(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/topics/")
	idStr = strings.TrimSuffix(idStr, "/")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid topic ID", http.StatusBadRequest)
		return
	}

	user := middleware.GetUserFromContext(r)

	var owner string
	err = h.DB.QueryRow(
		`SELECT creator_username FROM topics WHERE id = ?`,
		id,
	).Scan(&owner)

	if err == sql.ErrNoRows {
		http.Error(w, "Topic not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if owner != user {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	_, err = h.DB.Exec(`DELETE FROM topics WHERE id = ?`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
