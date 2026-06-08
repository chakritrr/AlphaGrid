package domain

import "time"

type Plan struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Price          float64  `json:"price"`
	BotsLimit      int      `json:"botsLimit"`
	ExchangesLimit int      `json:"exchangesLimit"`
	Features       []string `json:"features"`
	Color          string   `json:"color,omitempty"`
}

type Subscription struct {
	ID                 string     `json:"id"`
	UserID             string     `json:"userId"`
	PlanID             string     `json:"planId"`
	Status             string     `json:"status"` // "active" | "past_due" | "canceled"
	CurrentPeriodStart time.Time  `json:"currentPeriodStart"`
	CurrentPeriodEnd   time.Time  `json:"currentPeriodEnd"`
	CanceledAt         *time.Time `json:"canceledAt,omitempty"`
	CreatedAt          time.Time  `json:"createdAt"`
}

type Payment struct {
	ID       string    `json:"id"`
	UserID   string    `json:"userId"`
	PlanID   string    `json:"planId"`
	Amount   float64   `json:"amount"`
	Status   string    `json:"status"`
	PaidAt   time.Time `json:"paidAt"`
}

type Renewal struct {
	User   string  `json:"user"`
	Plan   string  `json:"plan"`
	Amount float64 `json:"amount"`
	Days   int     `json:"days"`
	Method string  `json:"method"`
}

type UsageInfo struct {
	BotsUsed    int    `json:"botsUsed"`
	BotsLimit   int    `json:"botsLimit"`
	Exchanges   UsageItem `json:"exchanges"`
	Trades      UsageItem `json:"trades"`
	APICalls    UsageItem `json:"apiCalls"`
}

type UsageItem struct {
	Used  int  `json:"used"`
	Limit *int `json:"limit"`
}

type PlanBreakdown struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
	Price int    `json:"price"`
	Color string `json:"color"`
}

type MRRSeries struct {
	Month string  `json:"month"`
	MRR   float64 `json:"mrr"`
	NRR   float64 `json:"nrr"`
}
