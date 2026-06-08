package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type TradeRepository interface {
	Create(trade *domain.Trade) error
	FindByUserID(userID string, limit, offset int) ([]domain.Trade, int, error)
	FindByBotID(botID string) ([]domain.Trade, error)
}
