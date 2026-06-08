package repository

import "github.com/chakritrr/AlphaGrid/backend/internal/domain"

type UserRepository interface {
	Create(user *domain.User) error
	FindByID(id string) (*domain.User, error)
	FindByEmail(email string) (*domain.User, error)
	Update(user *domain.User) error
	UpdateStatus(id, status string) error
	List(filter domain.UserFilter) ([]domain.User, int, error)
}
