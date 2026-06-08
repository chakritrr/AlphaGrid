package domain

import "time"

type PortfolioPnL struct {
	ID     string    `json:"id"`
	UserID string    `json:"userId"`
	Date   time.Time `json:"-"`
	Value  float64   `json:"value"`
	PnL    float64   `json:"pnl"`
}

type PnLSeries struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
	PnL   float64 `json:"pnl"`
}

type DashboardStats struct {
	PortfolioValue float64 `json:"portfolioValue"`
	Change30d      float64 `json:"change30d"`
	TodayPnl       float64 `json:"todayPnl"`
	ActiveBots     int     `json:"activeBots"`
	MonthTrades    int     `json:"monthTrades"`
}

type PerformanceResponse struct {
	Range    string       `json:"range"`
	Metrics  PerfMetrics  `json:"metrics"`
	Cumulative []PnLSeries `json:"cumulative"`
	WinLoss  WinLossData  `json:"winLoss"`
	PerBot   []BotPnL     `json:"perBot"`
}

type PerfMetrics struct {
	TotalProfit    float64 `json:"totalProfit"`
	WinRate        float64 `json:"winRate"`
	TotalTrades    int     `json:"totalTrades"`
	BestDay        float64 `json:"bestDay"`
	AvgDailyProfit float64 `json:"avgDailyProfit"`
	ProfitFactor   float64 `json:"profitFactor"`
}

type WinLossData struct {
	Wins   int `json:"wins"`
	Losses int `json:"losses"`
}

type BotPnL struct {
	Name string  `json:"name"`
	PnL  float64 `json:"pnl"`
}

type SignupAnalytics struct {
	ID      int       `json:"id"`
	Date    time.Time `json:"-"`
	Day     string    `json:"day"`
	Signups int       `json:"signups"`
	Churn   int       `json:"churn"`
	Revenue float64   `json:"revenue"`
}

type AdminDashboard struct {
	RevenueToday float64 `json:"revenueToday"`
	RevenueMTD   float64 `json:"revenueMTD"`
	RevenueYTD   float64 `json:"revenueYTD"`
	ActiveSubs   int     `json:"activeSubs"`
	ActiveBots   int     `json:"activeBots"`
	TotalBots    int     `json:"totalBots"`
}

type RevenueSource struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}
