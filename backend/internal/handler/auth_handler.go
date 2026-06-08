package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/chakritrr/AlphaGrid/backend/internal/dto/request"
	"github.com/chakritrr/AlphaGrid/backend/internal/dto/response"
	apperrors "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"
	"github.com/chakritrr/AlphaGrid/backend/internal/usecase"
)

type AuthHandler struct {
	authUsecase *usecase.AuthUsecase
}

func NewAuthHandler(authUsecase *usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{authUsecase: authUsecase}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req request.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()},
		})
		return
	}

	result, err := h.authUsecase.Register(usecase.RegisterInput{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		if appErr, ok := err.(*apperrors.AppError); ok {
			c.JSON(appErr.Status, response.NewError(appErr))
		} else {
			c.JSON(http.StatusInternalServerError, response.NewError(apperrors.ErrInternal))
		}
		return
	}

	c.JSON(http.StatusCreated, response.AuthResponse{
		Token: result.Token,
		User: response.UserInfo{
			ID:        result.User.ID,
			Name:      result.User.Name,
			Email:     result.User.Email,
			Role:      result.User.Role,
			Plan:      result.User.Plan,
			BotsUsed:  result.User.BotsUsed,
			BotsLimit: result.User.BotsLimit,
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req request.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()},
		})
		return
	}

	result, err := h.authUsecase.Login(usecase.LoginInput{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		if appErr, ok := err.(*apperrors.AppError); ok {
			c.JSON(appErr.Status, response.NewError(appErr))
		} else {
			c.JSON(http.StatusInternalServerError, response.NewError(apperrors.ErrInternal))
		}
		return
	}

	c.JSON(http.StatusOK, response.AuthResponse{
		Token: result.Token,
		User: response.UserInfo{
			ID:        result.User.ID,
			Name:      result.User.Name,
			Email:     result.User.Email,
			Role:      result.User.Role,
			Plan:      result.User.Plan,
			BotsUsed:  result.User.BotsUsed,
			BotsLimit: result.User.BotsLimit,
		},
	})
}
