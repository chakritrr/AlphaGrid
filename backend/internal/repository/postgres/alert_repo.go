package postgres

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type AlertRepo struct {
	db *sql.DB
}

func NewAlertRepo(db *sql.DB) *AlertRepo {
	return &AlertRepo{db: db}
}

func (r *AlertRepo) Create(alert *domain.Alert) error {
	query := `INSERT INTO alerts (severity, kind, title, detail, acknowledged)
		VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	return r.db.QueryRow(query, alert.Severity, alert.Kind, alert.Title, alert.Detail, alert.Acknowledged).
		Scan(&alert.ID, &alert.CreatedAt)
}

func (r *AlertRepo) FindByFilter(filter domain.AlertFilter) ([]domain.Alert, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	idx := 1

	if filter.Kind != "" && filter.Kind != "All" {
		where = append(where, fmt.Sprintf("kind=$%d", idx))
		args = append(args, filter.Kind)
		idx++
	}
	if filter.Ack != nil {
		where = append(where, fmt.Sprintf("acknowledged=$%d", idx))
		args = append(args, *filter.Ack)
		idx++
	}
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PerPage < 1 {
		filter.PerPage = 20
	}
	offset := (filter.Page - 1) * filter.PerPage

	var total int
	countQ := fmt.Sprintf("SELECT COUNT(*) FROM alerts WHERE %s", strings.Join(where, " AND"))
	r.db.QueryRow(countQ, args...).Scan(&total)

	query := fmt.Sprintf(`SELECT id, severity, kind, title, detail, acknowledged, created_at
		FROM alerts WHERE %s ORDER BY created_at DESC LIMIT %d OFFSET %d`,
		strings.Join(where, " AND"), filter.PerPage, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var alerts []domain.Alert
	for rows.Next() {
		var a domain.Alert
		rows.Scan(&a.ID, &a.Severity, &a.Kind, &a.Title, &a.Detail, &a.Acknowledged, &a.CreatedAt)
		alerts = append(alerts, a)
	}
	return alerts, total, nil
}

func (r *AlertRepo) FindByID(id string) (*domain.Alert, error) {
	a := &domain.Alert{}
	err := r.db.QueryRow(`SELECT id, severity, kind, title, detail, acknowledged, created_at
		FROM alerts WHERE id=$1`, id).Scan(&a.ID, &a.Severity, &a.Kind, &a.Title, &a.Detail, &a.Acknowledged, &a.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return a, err
}

func (r *AlertRepo) Acknowledge(id string) error {
	_, err := r.db.Exec(`UPDATE alerts SET acknowledged=true WHERE id=$1`, id)
	return err
}

func (r *AlertRepo) GetUnacknowledgedCount() (int, error) {
	var count int
	err := r.db.QueryRow(`SELECT COUNT(*) FROM alerts WHERE acknowledged=false`).Scan(&count)
	return count, err
}
