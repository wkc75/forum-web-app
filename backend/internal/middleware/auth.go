package middleware

import (
	"context"
	"net/http"
)

type contextKey string

const userKey contextKey = "user"

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_user")
		if err != nil || cookie.Value == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userKey, cookie.Value)
		next(w, r.WithContext(ctx))
	}
}

func GetUserFromContext(r *http.Request) string {
	user, _ := r.Context().Value(userKey).(string)
	return user
}
