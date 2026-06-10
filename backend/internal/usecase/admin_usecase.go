package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
	apperrors "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"
)

type AdminUsecase struct {
	userRepo      repository.UserRepository
	botRepo       repository.BotRepository
	subRepo       repository.SubscriptionRepository
	alertRepo     repository.AlertRepository
	analyticsRepo repository.AnalyticsRepository
}

func NewAdminUsecase(
	userRepo repository.UserRepository,
	botRepo repository.BotRepository,
	subRepo repository.SubscriptionRepository,
	alertRepo repository.AlertRepository,
	analyticsRepo repository.AnalyticsRepository,
) *AdminUsecase {
	return &AdminUsecase{
		userRepo:      userRepo,
		botRepo:       botRepo,
		subRepo:       subRepo,
		alertRepo:     alertRepo,
		analyticsRepo: analyticsRepo,
	}
}

func (uc *AdminUsecase) GetDashboard() (*domain.AdminDashboard, error) {
	return uc.analyticsRepo.GetAdminDashboard()
}

func (uc *AdminUsecase) GetSignups(rangeType string) ([]domain.SignupAnalytics, error) {
	return uc.analyticsRepo.GetSignups(rangeType)
}

func (uc *AdminUsecase) GetRevenueSplit() ([]domain.RevenueSource, error) {
	return uc.analyticsRepo.GetRevenueSplit()
}

func (uc *AdminUsecase) ListUsers(filter domain.UserFilter) ([]domain.User, int, error) {
	return uc.userRepo.List(filter)
}

func (uc *AdminUsecase) UpdateUserStatus(id, status string) error {
	user, err := uc.userRepo.FindByID(id)
	if err != nil {
		return err
	}
	if user == nil {
		return apperrors.NewNotFoundError("User not found")
	}
	validStatuses := map[string]bool{"active": true, "trial": true, "past_due": true, "suspended": true}
	if !validStatuses[status] {
		return apperrors.NewValidationError("Invalid status")
	}
	return uc.userRepo.UpdateStatus(id, status)
}

func (uc *AdminUsecase) ListBots(filter domain.BotFilter) ([]domain.Bot, int, error) {
	return uc.botRepo.ListAll(filter)
}

func (uc *AdminUsecase) GetMRRSeries() ([]domain.MRRSeries, error) {
	return uc.subRepo.GetMRRSeries()
}

func (uc *AdminUsecase) GetPlanBreakdown() ([]domain.PlanBreakdown, error) {
	return uc.subRepo.GetPlanBreakdown()
}

func (uc *AdminUsecase) GetPlanPricing() ([]domain.Plan, error) {
	return uc.subRepo.GetPlans()
}

func (uc *AdminUsecase) GetRenewals() ([]domain.Renewal, error) {
	return uc.subRepo.GetRenewals()
}

func (uc *AdminUsecase) ListAlerts(filter domain.AlertFilter) ([]domain.Alert, int, error) {
	return uc.alertRepo.FindByFilter(filter)
}

func (uc *AdminUsecase) AcknowledgeAlert(id string) error {
	alert, err := uc.alertRepo.FindByID(id)
	if err != nil {
		return err
	}
	if alert == nil {
		return apperrors.NewNotFoundError("Alert not found")
	}
	return uc.alertRepo.Acknowledge(id)
}
