package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type AnalyticsRepository interface {
	GetPortfolioPnL(userID string, days int) ([]domain.PnLSeries, error)
	GetSignups(rangeType string) ([]domain.SignupAnalytics, error)
	GetRevenueSplit() ([]domain.RevenueSource, error)
	GetAdminDashboard() (*domain.AdminDashboard, error)
}
