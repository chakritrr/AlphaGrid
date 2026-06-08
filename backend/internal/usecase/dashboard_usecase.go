package usecase

import (
	"math"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
)

type DashboardUsecase struct {
	botRepo  repository.BotRepository
	tradeRepo repository.TradeRepository
	analyticsRepo repository.AnalyticsRepository
}

func NewDashboardUsecase(
	botRepo repository.BotRepository,
	tradeRepo repository.TradeRepository,
	analyticsRepo repository.AnalyticsRepository,
) *DashboardUsecase {
	return &DashboardUsecase{
		botRepo:  botRepo,
		tradeRepo: tradeRepo,
		analyticsRepo: analyticsRepo,
	}
}

func (uc *DashboardUsecase) GetStats(userID string) (*domain.DashboardStats, error) {
	activeBots, monthTrades, err := uc.botRepo.GetUserBotStats(userID)
	if err != nil {
		return nil, err
	}

	// Generate mock portfolio value (same seeding pattern as frontend)
	val := 24800.0
	for i := 29; i >= 0; i-- {
		drift := math.Sin(float64(i)/3)*220 + (float64(i%7) * 50)
		val += drift
	}
	start := 24800.0
	for i := 29; i >= 0; i-- {
		drift := math.Sin(float64(i)/3)*220 + (float64(i%7) * 50)
		val += drift
		_ = start
	}
	change := ((val - start) / start) * 100
	todayPnl := math.Sin(29.0/3)*220 + float64(29%7)*50

	return &domain.DashboardStats{
		PortfolioValue: math.Round(val),
		Change30d:      math.Round(change*100) / 100,
		TodayPnl:       math.Round(todayPnl*100) / 100,
		ActiveBots:     activeBots,
		MonthTrades:    monthTrades,
	}, nil
}

func (uc *DashboardUsecase) GetPnL(userID string, rangeType string) (*domain.PnLSeries, []domain.PnLSeries, error) {
	days := 30
	switch rangeType {
	case "7d", "7D":
		days = 7
	case "90d", "90D":
		days = 90
	case "1y", "1Y":
		days = 365
	}

	var portfolioValue float64
	var series []domain.PnLSeries
	val := 24800.0
	for i := days - 1; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		drift := math.Sin(float64(i)/3)*220 + (float64(i%7) * 50)
		val += drift
		series = append(series, domain.PnLSeries{
			Date:  d.Format("Jan 2"),
			Value: math.Round(val),
			PnL:   math.Round(drift),
		})
	}
	portfolioValue = val

	result := &domain.PnLSeries{
		Date:  rangeType,
		Value: portfolioValue,
	}
	return result, series, nil
}

func (uc *DashboardUsecase) GetBots(userID string) ([]domain.Bot, error) {
	return uc.botRepo.FindByUserID(userID)
}

func (uc *DashboardUsecase) CreateBot(userID string, req *domain.BotCreateRequest) (*domain.Bot, error) {
	bot := &domain.Bot{
		UserID:   userID,
		Name:     req.Strategy + " Bot",
		Strategy: req.Strategy,
		Exchange: req.Exchange,
		Pair:     req.Pair,
		Status:   "running",
		Invested: req.Investment,
		RiskLevel: map[int]string{
			0: "low", 1: "low", 2: "medium", 3: "medium", 4: "high", 5: "high",
		}[req.Risk/20],
		Leverage: 1,
		AUM:      req.Investment,
	}
	if bot.RiskLevel == "" {
		bot.RiskLevel = "medium"
	}

	if err := uc.botRepo.Create(bot); err != nil {
		return nil, err
	}
	return bot, nil
}

func (uc *DashboardUsecase) ToggleBot(id string) (*domain.Bot, error) {
	return uc.botRepo.ToggleStatus(id)
}

func (uc *DashboardUsecase) GetTrades(userID string, limit, offset int) ([]domain.Trade, int, error) {
	return uc.tradeRepo.FindByUserID(userID, limit, offset)
}

func (uc *DashboardUsecase) GetPerformance(userID, rangeType string) (*domain.PerformanceResponse, error) {
	return uc.botRepo.GetPerformance(userID, rangeType)
}
