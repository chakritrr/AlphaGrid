package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	"github.com/chakritrr/AlphaGrid/backend/internal/pkg/crypto"
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
	// Actually encrypt the API keys before storing
	encAPIKey, err := crypto.Encrypt(req.APIKey)
	if err != nil {
		return nil, apperrors.NewValidationError("Failed to encrypt API key")
	}
	encSecretKey, err := crypto.Encrypt(req.SecretKey)
	if err != nil {
		return nil, apperrors.NewValidationError("Failed to encrypt secret key")
	}

	conn := &domain.ExchangeConnection{
		UserID:             userID,
		ExchangeName:       req.Exchange,
		APIKeyEncrypted:    encAPIKey,
		SecretKeyEncrypted: encSecretKey,
		Permissions:        `{"read":true,"trade":false,"withdraw":false}`,
		Status:             "connected",
		Balance:            0, // Start at 0; balance is fetched from exchange API after connection
	}
	if err := uc.exchangeRepo.Create(conn); err != nil {
		return nil, err
	}
	return conn, nil
}
