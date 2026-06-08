package domain

import "time"

type Alert struct {
	ID            string    `json:"id"`
	Severity      string    `json:"severity"` // "critical" | "warning" | "info"
	Kind          string    `json:"kind"`     // "bot_error" | "failed_payment" | "suspicious"
	Title         string    `json:"title"`
	Detail        string    `json:"detail"`
	Acknowledged  bool      `json:"acknowledged"`
	CreatedAt     time.Time `json:"time"`
}

type AlertFilter struct {
	Kind  string
	Ack   *bool
	Page  int
	PerPage int
}
