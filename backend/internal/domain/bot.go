package domain

import "time"

type Bot struct {
	ID         string    `json:"id"`
	UserID     string    `json:"userId"`
	Name       string    `json:"name"`
	Strategy   string    `json:"strategy"`
	Exchange   string    `json:"exchange"`
	Pair       string    `json:"pair"`
	Status     string    `json:"status"` // "running" | "paused" | "error" | "idle" | "warning"
	TodayPnl   float64   `json:"todayPnl"`
	TotalPnl   float64   `json:"totalPnl"`
	WinRate    float64   `json:"winRate"`
	Trades     int       `json:"trades"`
	Invested   float64   `json:"invested"`
	RiskLevel  string    `json:"risk"`     // "low" | "medium" | "high"
	Leverage   int       `json:"leverage"`
	AUM        float64   `json:"aum"`
	UptimeH    int       `json:"uptimeH"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

// BotCreateRequest represents the fields needed to create a bot.
type BotCreateRequest struct {
	Strategy   string  `json:"strategy" binding:"required"`
	Exchange   string  `json:"exchange" binding:"required"`
	Pair       string  `json:"pair" binding:"required"`
	Investment float64 `json:"investment" binding:"required"`
	Risk       int     `json:"risk"`
	TakeProfit float64 `json:"takeProfit"`
	StopLoss   float64 `json:"stopLoss"`
}

// BotFilter for listing bots with optional filters.
type BotFilter struct {
	Status   string
	Exchange string
	Page     int
	PerPage  int
}
