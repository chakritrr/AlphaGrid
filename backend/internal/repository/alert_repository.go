package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type AlertRepository interface {
	Create(alert *domain.Alert) error
	FindByFilter(filter domain.AlertFilter) ([]domain.Alert, int, error)
	FindByID(id string) (*domain.Alert, error)
	Acknowledge(id string) error
	GetUnacknowledgedCount() (int, error)
}
