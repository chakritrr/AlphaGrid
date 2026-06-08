package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
)

type DashboardUsecase struct {
	botRepo       repository.BotRepository
	tradeRepo     repository.TradeRepository
	analyticsRepo repository.AnalyticsRepository
}

func NewDashboardUsecase(
	botRepo repository.BotRepository,
	tradeRepo repository.TradeRepository,
	analyticsRepo repository.AnalyticsRepository,
) *DashboardUsecase {
	return &DashboardUsecase{
		botRepo:       botRepo,
		tradeRepo:     tradeRepo,
		analyticsRepo: analyticsRepo,
	}
}

func (uc *DashboardUsecase) GetStats(userID string) (*domain.DashboardStats, error) {
	activeBots, monthTrades, err := uc.botRepo.GetUserBotStats(userID)
	if err != nil {
		return nil, err
	}

	// Return real data only. No synthetic mock data.
	return &domain.DashboardStats{
		PortfolioValue: 0,
		Change30d:      0,
		TodayPnl:       0,
		ActiveBots:     activeBots,
		MonthTrades:    monthTrades,
	}, nil
}

func (uc *DashboardUsecase) GetPnL(userID string, rangeType string) (*domain.PnLSeries, []domain.PnLSeries, error) {
	// Return empty series. No synthetic data.
	return &domain.PnLSeries{}, []domain.PnLSeries{}, nil
}

func (uc *DashboardUsecase) GetBots(userID string) ([]domain.Bot, error) {
	return uc.botRepo.FindByUserID(userID)
}

func (uc *DashboardUsecase) CreateBot(userID string, req *domain.BotCreateRequest) (*domain.Bot, error) {
	bot := &domain.Bot{
		UserID:    userID,
		Name:      req.Strategy + " Bot",
		Strategy:  req.Strategy,
		Exchange:  req.Exchange,
		Pair:      req.Pair,
		Status:    "running",
		Invested:  req.Investment,
		RiskLevel: map[int]string{0: "low", 1: "low", 2: "medium", 3: "medium", 4: "high", 5: "high"}[req.Risk/20],
		Leverage:  1,
		AUM:       req.Investment,
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
