package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/dto/response"
	"github.com/chakritrr/AlphaGrid/backend/internal/usecase"
)

type AdminHandler struct {
	adminUsecase *usecase.AdminUsecase
}

func NewAdminHandler(adminUsecase *usecase.AdminUsecase) *AdminHandler {
	return &AdminHandler{adminUsecase: adminUsecase}
}

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	dash, err := h.adminUsecase.GetDashboard()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, dash)
}

func (h *AdminHandler) GetSignups(c *gin.Context) {
	rangeType := c.DefaultQuery("range", "30d")
	series, err := h.adminUsecase.GetSignups(rangeType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	var result []response.SignupSeries
	for _, s := range series {
		result = append(result, response.SignupSeries{
			Day:     s.Day,
			Signups: s.Signups,
			Churn:   s.Churn,
			Revenue: s.Revenue,
		})
	}
	c.JSON(http.StatusOK, gin.H{"series": result})
}

func (h *AdminHandler) GetRevenueSplit(c *gin.Context) {
	sources, err := h.adminUsecase.GetRevenueSplit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"sources": sources})
}

func (h *AdminHandler) ListUsers(c *gin.Context) {
	filter := domain.UserFilter{
		Search: c.Query("search"),
		Plan:   c.Query("plan"),
		Status: c.Query("status"),
		Sort:   c.DefaultQuery("sort", "created_at"),
		Order:  c.DefaultQuery("order", "desc"),
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	filter.Page = page

	users, total, err := h.adminUsecase.ListUsers(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	var result []response.AdminUser
	for _, u := range users {
		result = append(result, response.AdminUser{
			ID:      u.ID,
			Name:    u.Name,
			Email:   u.Email,
			Plan:    u.Plan,
			Bots:    u.BotsUsed,
			Rev:     int(u.BotsUsed * 79),
			Status:  u.Status,
			Joined:  u.CreatedAt.Format("2006-01-02"),
			Country: u.Country,
		})
	}
	c.JSON(http.StatusOK, response.AdminUserList{
		Users: result,
		Total: total,
		Page:  page,
	})
}

func (h *AdminHandler) UpdateUserStatus(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": "Status is required"}})
		return
	}
	if err := h.adminUsecase.UpdateUserStatus(id, body.Status); err != nil {
		status := http.StatusInternalServerError
		c.JSON(status, gin.H{"error": gin.H{"code": "ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func (h *AdminHandler) ListBots(c *gin.Context) {
	filter := domain.BotFilter{
		Status:   c.Query("status"),
		Exchange: c.Query("exchange"),
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	filter.Page = page
	filter.PerPage = 36

	bots, total, err := h.adminUsecase.ListBots(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	var result []response.AdminBot
	for _, b := range bots {
		result = append(result, response.AdminBot{
			ID:       b.ID,
			User:     b.UserID,
			Exchange: b.Exchange,
			Strategy: b.Strategy,
			Pair:     b.Pair,
			Status:   b.Status,
			PnlToday: b.TodayPnl,
			Trades:   b.Trades,
			WinRate:  b.WinRate,
			Leverage: b.Leverage,
			UptimeH:  b.UptimeH,
			AUM:      b.AUM,
		})
	}
	c.JSON(http.StatusOK, response.AdminBotList{Bots: result, Total: total})
}

func (h *AdminHandler) GetMRRSeries(c *gin.Context) {
	series, err := h.adminUsecase.GetMRRSeries()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"series": series})
}

func (h *AdminHandler) GetPlanBreakdown(c *gin.Context) {
	plans, err := h.adminUsecase.GetPlanBreakdown()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"plans": plans})
}

func (h *AdminHandler) GetRenewals(c *gin.Context) {
	renewals, err := h.adminUsecase.GetRenewals()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"renewals": renewals})
}

func (h *AdminHandler) ListAlerts(c *gin.Context) {
	filter := domain.AlertFilter{
		Kind: c.Query("kind"),
	}
	if c.Query("ack") == "true" {
		t := true
		filter.Ack = &t
	} else if c.Query("ack") == "false" {
		f := false
		filter.Ack = &f
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	filter.Page = page
	filter.PerPage = 20

	alerts, total, err := h.adminUsecase.ListAlerts(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	var result []response.AlertItem
	for _, a := range alerts {
		result = append(result, response.AlertItem{
			ID:           a.ID,
			Severity:     a.Severity,
			Kind:         a.Kind,
			Title:        a.Title,
			Detail:       a.Detail,
			Time:         a.CreatedAt.Format("15:04"),
			Acknowledged: a.Acknowledged,
		})
	}
	c.JSON(http.StatusOK, response.AlertList{Alerts: result, Total: total})
}

func (h *AdminHandler) AcknowledgeAlert(c *gin.Context) {
	id := c.Param("id")
	if err := h.adminUsecase.AcknowledgeAlert(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "ERROR", "message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Alert acknowledged"})
}
