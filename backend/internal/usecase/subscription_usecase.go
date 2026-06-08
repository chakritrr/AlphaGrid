package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
	apperrors "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"
)

type SubscriptionUsecase struct {
	subRepo repository.SubscriptionRepository
}

func NewSubscriptionUsecase(subRepo repository.SubscriptionRepository) *SubscriptionUsecase {
	return &SubscriptionUsecase{subRepo: subRepo}
}

func (uc *SubscriptionUsecase) GetCurrent(userID string) (*domain.Subscription, error) {
	sub, err := uc.subRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if sub == nil {
		return nil, apperrors.NewNotFoundError("No active subscription found")
	}
	return sub, nil
}

func (uc *SubscriptionUsecase) GetPlans() ([]domain.Plan, error) {
	return uc.subRepo.GetPlans()
}

func (uc *SubscriptionUsecase) GetPayments(userID string) ([]domain.Payment, error) {
	return uc.subRepo.GetPayments(userID)
}
