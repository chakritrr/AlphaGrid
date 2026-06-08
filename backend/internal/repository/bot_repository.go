package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type BotRepository interface {
	Create(bot *domain.Bot) error
	FindByID(id string) (*domain.Bot, error)
	FindByUserID(userID string) ([]domain.Bot, error)
	Update(bot *domain.Bot) error
	ToggleStatus(id string) (*domain.Bot, error)
	GetUserBotStats(userID string) (activeBots int, monthTrades int, err error)
	GetPerformance(userID, rangeType string) (*domain.PerformanceResponse, error)
	// Admin
	ListAll(filter domain.BotFilter) ([]domain.Bot, int, error)
}
