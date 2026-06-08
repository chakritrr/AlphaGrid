package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
	apperrors "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"
)

type ExchangeUsecase struct {
	exchangeRepo repository.ExchangeRepository
}

func NewExchangeUsecase(exchangeRepo repository.ExchangeRepository) *ExchangeUsecase {
	return &ExchangeUsecase{exchangeRepo: exchangeRepo}
}

func (uc *ExchangeUsecase) GetExchanges(userID string) ([]domain.ExchangeConnection, error) {
	conns, err := uc.exchangeRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if conns == nil {
		return []domain.ExchangeConnection{}, nil
	}
	for i := range conns {
		conns[i].APIKeyEncrypted = ""
		conns[i].SecretKeyEncrypted = ""
	}
	return conns, nil
}

func (uc *ExchangeUsecase) Disconnect(userID, exchangeID string) error {
	conn, err := uc.exchangeRepo.FindByID(exchangeID)
	if err != nil {
		return err
	}
	if conn == nil {
		return apperrors.NewNotFoundError("Exchange connection not found")
	}
	if conn.UserID != userID {
		return apperrors.ErrForbidden
	}
	return uc.exchangeRepo.Delete(exchangeID)
}

func (uc *ExchangeUsecase) Connect(userID string, req *domain.ExchangeConnectRequest) (*domain.ExchangeConnection, error) {
	conn := &domain.ExchangeConnection{
		UserID:             userID,
		ExchangeName:       req.Exchange,
		APIKeyEncrypted:    req.APIKey,
		SecretKeyEncrypted: req.SecretKey,
		Permissions:        `{"read":true,"trade":false,"withdraw":false}`,
		Status:             "connected",
		Balance:            8420.91,
	}
	if err := uc.exchangeRepo.Create(conn); err != nil {
		return nil, err
	}
	return conn, nil
}
