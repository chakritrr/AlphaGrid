package response

type AdminDashboard struct {
	RevenueToday float64 `json:"revenueToday"`
	RevenueMTD   float64 `json:"revenueMTD"`
	RevenueYTD   float64 `json:"revenueYTD"`
	ActiveSubs   int     `json:"activeSubs"`
	ActiveBots   int     `json:"activeBots"`
	TotalBots    int     `json:"totalBots"`
}

type SignupSeries struct {
	Day     string  `json:"day"`
	Signups int     `json:"signups"`
	Churn   int     `json:"churn"`
	Revenue float64 `json:"revenue"`
}

type RevenueSource struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
}

type AdminUser struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Plan     string `json:"plan"`
	Bots     int    `json:"bots"`
	Rev      int    `json:"rev"`
	Status   string `json:"status"`
	Pnl30    float64 `json:"pnl30"`
	Joined   string `json:"joined"`
	Country  string `json:"country"`
}

type AdminUserList struct {
	Users []AdminUser `json:"users"`
	Total int         `json:"total"`
	Page  int         `json:"page"`
}

type AdminBot struct {
	ID       string  `json:"id"`
	User     string  `json:"user"`
	Exchange string  `json:"exchange"`
	Strategy string  `json:"strategy"`
	Pair     string  `json:"pair"`
	Status   string  `json:"status"`
	PnlToday float64 `json:"pnlToday"`
	Trades   int     `json:"trades"`
	WinRate  float64 `json:"winRate"`
	Leverage int     `json:"leverage"`
	UptimeH  int     `json:"uptimeH"`
	AUM      float64 `json:"aum"`
}

type AdminBotList struct {
	Bots  []AdminBot `json:"bots"`
	Total int        `json:"total"`
}

type MRRSeries struct {
	Month string  `json:"month"`
	MRR   float64 `json:"mrr"`
	NRR   float64 `json:"nrr"`
}

type PlanBreakdown struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
	Price int    `json:"price"`
	Color string `json:"color"`
}

type RenewalItem struct {
	User   string  `json:"user"`
	Plan   string  `json:"plan"`
	Amount float64 `json:"amount"`
	Days   int     `json:"days"`
	Method string  `json:"method"`
}

type AlertItem struct {
	ID           string `json:"id"`
	Severity     string `json:"severity"`
	Kind         string `json:"kind"`
	Title        string `json:"title"`
	Detail       string `json:"detail"`
	Time         string `json:"time"`
	Acknowledged bool   `json:"acknowledged"`
}

type AlertList struct {
	Alerts []AlertItem `json:"alerts"`
	Total  int         `json:"total"`
}
