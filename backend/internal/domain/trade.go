package domain

import "time"

type Trade struct {
	ID        string    `json:"id"`
	BotID     string    `json:"botId"`
	UserID    string    `json:"userId"`
	BotName   string    `json:"bot,omitempty"`
	Pair      string    `json:"pair"`
	Side      string    `json:"side"`   // "long" | "short"
	Entry     float64   `json:"entry"`
	Exit      float64   `json:"exit"`
	Quantity  float64   `json:"quantity"`
	PnL       float64   `json:"pnl"`
	Duration  string    `json:"duration,omitempty"`
	Status    string    `json:"status"` // "open" | "win" | "loss"
	CreatedAt time.Time `json:"date"`
}

type TradeFilter struct {
	BotID   string
	UserID  string
	Limit   int
	Offset  int
}
