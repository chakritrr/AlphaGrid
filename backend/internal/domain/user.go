package domain

import "time"

type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`    // "user" | "admin"
	Plan         string    `json:"plan"`    // "starter" | "pro" | "elite"
	Status       string    `json:"status"`  // "active" | "trial" | "past_due" | "suspended"
	BotsUsed     int       `json:"botsUsed"`
	BotsLimit    int       `json:"botsLimit"`
	AvatarURL    string    `json:"avatarURL,omitempty"`
	Country      string    `json:"country,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type UserFilter struct {
	Search string
	Plan   string
	Status string
	Sort   string
	Order  string
	Page   int
}
