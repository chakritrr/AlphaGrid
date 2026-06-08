package errors

import "net/http"

type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrNotFound       = &AppError{Code: "NOT_FOUND", Message: "Resource not found", Status: http.StatusNotFound}
	ErrUnauthorized   = &AppError{Code: "UNAUTHORIZED", Message: "Authentication required", Status: http.StatusUnauthorized}
	ErrForbidden      = &AppError{Code: "FORBIDDEN", Message: "Insufficient permissions", Status: http.StatusForbidden}
	ErrInvalidInput   = &AppError{Code: "VALIDATION_ERROR", Message: "Invalid input", Status: http.StatusBadRequest}
	ErrConflict       = &AppError{Code: "CONFLICT", Message: "Resource already exists", Status: http.StatusConflict}
	ErrInternal       = &AppError{Code: "INTERNAL_ERROR", Message: "Internal server error", Status: http.StatusInternalServerError}
)

func NewValidationError(msg string) *AppError {
	return &AppError{Code: "VALIDATION_ERROR", Message: msg, Status: http.StatusBadRequest}
}

func NewNotFoundError(msg string) *AppError {
	return &AppError{Code: "NOT_FOUND", Message: msg, Status: http.StatusNotFound}
}
