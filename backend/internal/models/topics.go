package models

type Topic struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	CreatorUsername string `json:"creatorUsername"`
	CreatedAt       string `json:"createdAt"`
}
