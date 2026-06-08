package response

import "github.com/chakritrr/AlphaGrid/backend/internal/pkg/errors"

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewError(appErr *errors.AppError) ErrorResponse {
	return ErrorResponse{
		Error: ErrorDetail{
			Code:    appErr.Code,
			Message: appErr.Message,
		},
	}
}

type PaginatedResponse struct {
	Data       interface{} `json:"data,omitempty"`
	Total      int         `json:"total"`
	Page       int         `json:"page"`
	PerPage    int         `json:"perPage"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
