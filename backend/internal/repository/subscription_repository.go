package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type SubscriptionRepository interface {
	FindByUserID(userID string) (*domain.Subscription, error)
	Create(sub *domain.Subscription) error
	Update(sub *domain.Subscription) error
	GetPlans() ([]domain.Plan, error)
	GetPayments(userID string) ([]domain.Payment, error)
	// Admin
	GetMRRSeries() ([]domain.MRRSeries, error)
	GetPlanBreakdown() ([]domain.PlanBreakdown, error)
	GetRenewals() ([]domain.Renewal, error)
	GetActiveSubsCount() (int, error)
}
