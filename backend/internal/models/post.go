package models

type Post struct {
	ID              int    `json:"id"`
	Title           string `json:"title"`
	Content         string `json:"content"`
	TopicID         int    `json:"topicId"`
	CreatorUsername string `json:"creatorUsername"`
	CreatedAt       string `json:"createdAt"`
	LikesCount      int    `json:"likesCount"`
}
