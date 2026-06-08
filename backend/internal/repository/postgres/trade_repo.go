package postgres

import (
	"database/sql"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type TradeRepo struct {
	db *sql.DB
}

func NewTradeRepo(db *sql.DB) *TradeRepo {
	return &TradeRepo{db: db}
}

func (r *TradeRepo) Create(trade *domain.Trade) error {
	query := `INSERT INTO trades (bot_id, user_id, pair, side, entry_price, exit_price, quantity, pnl, duration, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at`
	return r.db.QueryRow(query, trade.BotID, trade.UserID, trade.Pair, trade.Side,
		trade.Entry, trade.Exit, trade.Quantity, trade.PnL, trade.Duration, trade.Status,
	).Scan(&trade.ID, &trade.CreatedAt)
}

func (r *TradeRepo) FindByUserID(userID string, limit, offset int) ([]domain.Trade, int, error) {
	if limit < 1 {
		limit = 10
	}

	var total int
	r.db.QueryRow(`SELECT COUNT(*) FROM trades WHERE user_id=$1`, userID).Scan(&total)

	query := `SELECT t.id, t.bot_id, t.user_id, COALESCE(b.name,''), t.pair, t.side,
		t.entry_price, t.exit_price, t.quantity, t.pnl, t.duration, t.status, t.created_at
		FROM trades t LEFT JOIN bots b ON t.bot_id = b.id
		WHERE t.user_id = $1 ORDER BY t.created_at DESC LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var trades []domain.Trade
	for rows.Next() {
		var t domain.Trade
		if err := rows.Scan(&t.ID, &t.BotID, &t.UserID, &t.BotName, &t.Pair, &t.Side,
			&t.Entry, &t.Exit, &t.Quantity, &t.PnL, &t.Duration, &t.Status, &t.CreatedAt); err != nil {
			return nil, 0, err
		}
		trades = append(trades, t)
	}
	return trades, total, nil
}

func (r *TradeRepo) FindByBotID(botID string) ([]domain.Trade, error) {
	rows, err := r.db.Query(`SELECT id, bot_id, user_id, ''::text, pair, side,
		entry_price, exit_price, quantity, pnl, duration, status, created_at
		FROM trades WHERE bot_id=$1 ORDER BY created_at DESC`, botID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trades []domain.Trade
	for rows.Next() {
		var t domain.Trade
		rows.Scan(&t.ID, &t.BotID, &t.UserID, &t.BotName, &t.Pair, &t.Side,
			&t.Entry, &t.Exit, &t.Quantity, &t.PnL, &t.Duration, &t.Status, &t.CreatedAt)
		trades = append(trades, t)
	}
	return trades, nil
}
