package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/dto/response"
	"github.com/chakritrr/AlphaGrid/backend/internal/usecase"
)

type DashboardHandler struct {
	dashboardUsecase *usecase.DashboardUsecase
	exchangeUsecase  *usecase.ExchangeUsecase
	subscriptionUsecase *usecase.SubscriptionUsecase
}

func NewDashboardHandler(
	du *usecase.DashboardUsecase,
	eu *usecase.ExchangeUsecase,
	su *usecase.SubscriptionUsecase,
) *DashboardHandler {
	return &DashboardHandler{
		dashboardUsecase: du,
		exchangeUsecase:  eu,
		subscriptionUsecase: su,
	}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	userID := c.GetString("userId")
	stats, err := h.dashboardUsecase.GetStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch stats"}})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *DashboardHandler) GetPnL(c *gin.Context) {
	userID := c.GetString("userId")
	rangeType := c.DefaultQuery("range", "30d")
	_, domainSeries, err := h.dashboardUsecase.GetPnL(userID, rangeType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch P&L"}})
		return
	}
	var respSeries []response.PnLSeries
	for _, s := range domainSeries {
		respSeries = append(respSeries, response.PnLSeries{
			Date:  s.Date,
			Value: s.Value,
			PnL:   s.PnL,
		})
	}
	c.JSON(http.StatusOK, response.PnLResponse{
		Range:  rangeType,
		Series: respSeries,
	})
}

func (h *DashboardHandler) GetBots(c *gin.Context) {
	userID := c.GetString("userId")
	bots, err := h.dashboardUsecase.GetBots(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch bots"}})
		return
	}
	if bots == nil {
		bots = []domain.Bot{}
	}
	c.JSON(http.StatusOK, gin.H{"bots": bots})
}

func (h *DashboardHandler) CreateBot(c *gin.Context) {
	userID := c.GetString("userId")
	var req domain.BotCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}
	bot, err := h.dashboardUsecase.CreateBot(userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to create bot"}})
		return
	}
	c.JSON(http.StatusCreated, bot)
}

func (h *DashboardHandler) ToggleBot(c *gin.Context) {
	id := c.Param("id")
	bot, err := h.dashboardUsecase.ToggleBot(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to toggle bot"}})
		return
	}
	if bot == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "Bot not found"}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": bot.ID, "status": bot.Status})
}

func (h *DashboardHandler) GetTrades(c *gin.Context) {
	limit := 10
	offset := 0
	c.JSON(http.StatusOK, gin.H{
		"trades": []domain.Trade{},
		"total": 0,
		"limit": limit,
		"offset": offset,
	})
}

func (h *DashboardHandler) GetExchanges(c *gin.Context) {
	userID := c.GetString("userId")
	conns, err := h.exchangeUsecase.GetExchanges(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch exchanges"}})
		return
	}
	var result []response.ExchangeResponse
	for _, c := range conns {
		lastSync := ""
		if c.LastSyncAt != nil {
			lastSync = c.LastSyncAt.Format("15:04")
		}
		result = append(result, response.ExchangeResponse{
			ID:       c.ID,
			Name:     c.ExchangeName,
			Balance:  c.Balance,
			Status:   c.Status,
			LastSync: lastSync,
		})
	}
	c.JSON(http.StatusOK, gin.H{"exchanges": result})
}

func (h *DashboardHandler) ConnectExchange(c *gin.Context) {
	userID := c.GetString("userId")
	var req domain.ExchangeConnectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}
	conn, err := h.exchangeUsecase.Connect(userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to connect exchange"}})
		return
	}
	c.JSON(http.StatusCreated, conn)
}

func (h *DashboardHandler) GetPerformance(c *gin.Context) {
	userID := c.GetString("userId")
	rangeType := c.DefaultQuery("range", "30d")
	perf, err := h.dashboardUsecase.GetPerformance(userID, rangeType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch performance"}})
		return
	}
	c.JSON(http.StatusOK, perf)
}

func (h *DashboardHandler) GetSubscription(c *gin.Context) {
	userID := c.GetString("userId")
	sub, err := h.subscriptionUsecase.GetCurrent(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "No subscription found"}})
		return
	}
	c.JSON(http.StatusOK, response.SubscriptionResponse{
		Plan:      sub.PlanID,
		Status:    sub.Status,
		RenewsAt:  sub.CurrentPeriodEnd.Format("2006-01-02"),
		BotsUsed:  5,
		BotsLimit: 10,
	})
}

func (h *DashboardHandler) GetPlans(c *gin.Context) {
	plans, err := h.subscriptionUsecase.GetPlans()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch plans"}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"plans": plans})
}

func (h *DashboardHandler) GetPayments(c *gin.Context) {
	userID := c.GetString("userId")
	payments, err := h.subscriptionUsecase.GetPayments(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to fetch payments"}})
		return
	}
	if payments == nil {
		payments = []domain.Payment{}
	}
	c.JSON(http.StatusOK, gin.H{"payments": payments})
}
