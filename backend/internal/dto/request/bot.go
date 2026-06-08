package request

type CreateBot struct {
	Strategy   string  `json:"strategy" binding:"required"`
	Exchange   string  `json:"exchange" binding:"required"`
	Pair       string  `json:"pair" binding:"required"`
	Investment float64 `json:"investment" binding:"required,min=100"`
	Risk       int     `json:"risk"`
	TakeProfit float64 `json:"takeProfit"`
	StopLoss   float64 `json:"stopLoss"`
}

type ConnectExchange struct {
	Exchange    string      `json:"exchange" binding:"required"`
	APIKey      string      `json:"apiKey" binding:"required"`
	SecretKey   string      `json:"secretKey" binding:"required"`
	Permissions Permissions `json:"permissions"`
}

type Permissions struct {
	Read     bool `json:"read"`
	Trade    bool `json:"trade"`
	Withdraw bool `json:"withdraw"`
}

type Pagination struct {
	Limit  int `form:"limit"`
	Offset int `form:"offset"`
	Page   int `form:"page"`
}

type UserFilter struct {
	Search string `form:"search"`
	Plan   string `form:"plan"`
	Status string `form:"status"`
	Sort   string `form:"sort"`
	Order  string `form:"order"`
	Page   int    `form:"page"`
}
