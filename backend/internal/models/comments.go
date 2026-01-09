package models

type Comment struct {
	ID              int    `json:"id"`
	Content         string `json:"content"`
	PostID          int    `json:"postId"`
	PostTitle       string `json:"postTitle"`
	CreatorUsername string `json:"creatorUsername"`
	CreatedAt       string `json:"createdAt"`
}
