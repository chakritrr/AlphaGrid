package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type ExchangeRepository interface {
	Create(conn *domain.ExchangeConnection) error
	FindByUserID(userID string) ([]domain.ExchangeConnection, error)
	FindByID(id string) (*domain.ExchangeConnection, error)
	Delete(id string) error
}
