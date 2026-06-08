package response

type DashboardStats struct {
	PortfolioValue float64 `json:"portfolioValue"`
	Change30d      float64 `json:"change30d"`
	TodayPnl       float64 `json:"todayPnl"`
	ActiveBots     int     `json:"activeBots"`
	MonthTrades    int     `json:"monthTrades"`
}

type PnLSeries struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
	PnL   float64 `json:"pnl"`
}

type PnLResponse struct {
	Range  string     `json:"range"`
	Series []PnLSeries `json:"series"`
}

type SubscriptionResponse struct {
	Plan       string `json:"plan"`
	Status     string `json:"status"`
	RenewsAt   string `json:"renewsAt"`
	BotsUsed   int    `json:"botsUsed"`
	BotsLimit  int    `json:"botsLimit"`
	Usage      Usage  `json:"usage"`
}

type Usage struct {
	Exchanges UsageItem  `json:"exchanges"`
	Trades    UsageItem  `json:"trades"`
	APICalls  UsageItem  `json:"apiCalls"`
}

type UsageItem struct {
	Used  int  `json:"used"`
	Limit *int `json:"limit"`
}

type PerformanceResponse struct {
	Range    string       `json:"range"`
	Metrics  PerfMetrics  `json:"metrics"`
	Cumulative []PnLSeries `json:"cumulative"`
	WinLoss  WinLossData  `json:"winLoss"`
	PerBot   []BotPnLData `json:"perBot"`
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

type BotPnLData struct {
	Name string  `json:"name"`
	PnL  float64 `json:"pnl"`
}

type ExchangeResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Balance   float64 `json:"balance"`
	Status    string  `json:"status"`
	LastSync  string  `json:"lastSync"`
}
