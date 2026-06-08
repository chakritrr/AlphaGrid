package domain

import "time"

type ExchangeConnection struct {
	ID                    string    `json:"id"`
	UserID                string    `json:"userId"`
	ExchangeName          string    `json:"name"`
	APIKeyEncrypted       string    `json:"-"`
	SecretKeyEncrypted    string    `json:"-"`
	Permissions           string    `json:"permissions"` // JSON string
	Status                string    `json:"status"`
	Balance               float64   `json:"balance"`
	LastSyncAt            *time.Time `json:"lastSync,omitempty"`
	CreatedAt             time.Time  `json:"createdAt"`
}

type ExchangeConnectRequest struct {
	Exchange    string `json:"exchange" binding:"required"`
	APIKey      string `json:"apiKey" binding:"required"`
	SecretKey   string `json:"secretKey" binding:"required"`
	Permissions struct {
		Read      bool `json:"read"`
		Trade     bool `json:"trade"`
		Withdraw  bool `json:"withdraw"`
	} `json:"permissions"`
}

type ExchangeBrief struct {
	Name   string `json:"name"`
	Accent string `json:"accent"`
}
