package postgres

import (
	"database/sql"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type ExchangeRepo struct {
	db *sql.DB
}

func NewExchangeRepo(db *sql.DB) *ExchangeRepo {
	return &ExchangeRepo{db: db}
}

func (r *ExchangeRepo) Create(conn *domain.ExchangeConnection) error {
	query := `INSERT INTO exchange_connections (user_id, exchange_name, api_key_encrypted, secret_key_encrypted, permissions, status, balance)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`
	return r.db.QueryRow(query, conn.UserID, conn.ExchangeName, conn.APIKeyEncrypted,
		conn.SecretKeyEncrypted, conn.Permissions, conn.Status, conn.Balance,
	).Scan(&conn.ID, &conn.CreatedAt)
}

func (r *ExchangeRepo) FindByUserID(userID string) ([]domain.ExchangeConnection, error) {
	rows, err := r.db.Query(`SELECT id, user_id, exchange_name, api_key_encrypted, secret_key_encrypted, permissions::text, status, balance, last_sync_at, created_at
		FROM exchange_connections WHERE user_id=$1 ORDER BY created_at`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var conns []domain.ExchangeConnection
	for rows.Next() {
		var c domain.ExchangeConnection
		var lastSync sql.NullTime
		if err := rows.Scan(&c.ID, &c.UserID, &c.ExchangeName, &c.APIKeyEncrypted, &c.SecretKeyEncrypted,
			&c.Permissions, &c.Status, &c.Balance, &lastSync, &c.CreatedAt); err != nil {
			return nil, err
		}
		if lastSync.Valid {
			c.LastSyncAt = &lastSync.Time
		}
		conns = append(conns, c)
	}
	return conns, nil
}

func (r *ExchangeRepo) FindByID(id string) (*domain.ExchangeConnection, error) {
	c := &domain.ExchangeConnection{}
	var lastSync sql.NullTime
	query := `SELECT id, user_id, exchange_name, api_key_encrypted, secret_key_encrypted, permissions::text, status, balance, last_sync_at, created_at
		FROM exchange_connections WHERE id=$1`
	err := r.db.QueryRow(query, id).Scan(&c.ID, &c.UserID, &c.ExchangeName, &c.APIKeyEncrypted,
		&c.SecretKeyEncrypted, &c.Permissions, &c.Status, &c.Balance, &lastSync, &c.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if lastSync.Valid {
		c.LastSyncAt = &lastSync.Time
	}
	return c, err
}

func (r *ExchangeRepo) Delete(id string) error {
	_, err := r.db.Exec(`DELETE FROM exchange_connections WHERE id=$1`, id)
	return err
}
