package usecase

import (
	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
	apperrors "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"
	"github.com/chakritrr/AlphaGrid/backend/internal/pkg/jwt"
	"github.com/chakritrr/AlphaGrid/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase struct {
	userRepo  repository.UserRepository
	jwtSecret string
	jwtExpiry int
}

func NewAuthUsecase(userRepo repository.UserRepository, jwtSecret string, jwtExpiry int) *AuthUsecase {
	return &AuthUsecase{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

type RegisterInput struct {
	Name     string
	Email    string
	Password string
}

type LoginInput struct {
	Email    string
	Password string
}

type AuthResult struct {
	Token string
	User  *domain.User
}

func (uc *AuthUsecase) Register(input RegisterInput) (*AuthResult, error) {
	existing, err := uc.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, apperrors.NewValidationError("Email already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
		Role:         "user",
		Plan:         "starter",
		Status:       "trial",
		BotsUsed:     0,
		BotsLimit:    2,
		Country:      "US",
	}

	if err := uc.userRepo.Create(user); err != nil {
		return nil, err
	}

	token, err := jwt.GenerateToken(user.ID, user.Email, user.Role, uc.jwtSecret, uc.jwtExpiry)
	if err != nil {
		return nil, err
	}

	return &AuthResult{Token: token, User: user}, nil
}

func (uc *AuthUsecase) Login(input LoginInput) (*AuthResult, error) {
	user, err := uc.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, apperrors.NewValidationError("Invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return nil, apperrors.NewValidationError("Invalid email or password")
	}

	if user.Status == "suspended" {
		return nil, apperrors.NewValidationError("Account is suspended")
	}

	token, err := jwt.GenerateToken(user.ID, user.Email, user.Role, uc.jwtSecret, uc.jwtExpiry)
	if err != nil {
		return nil, err
	}

	return &AuthResult{Token: token, User: user}, nil
}
