package postgres

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type BotRepo struct {
	db *sql.DB
}

func NewBotRepo(db *sql.DB) *BotRepo {
	return &BotRepo{db: db}
}

func (r *BotRepo) Create(bot *domain.Bot) error {
	query := `INSERT INTO bots (user_id, name, strategy, exchange, pair, status, today_pnl, total_pnl,
		win_rate, trades_count, invested, risk_level, leverage, aum, uptime_hours)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query,
		bot.UserID, bot.Name, bot.Strategy, bot.Exchange, bot.Pair, bot.Status,
		bot.TodayPnl, bot.TotalPnl, bot.WinRate, bot.Trades, bot.Invested,
		bot.RiskLevel, bot.Leverage, bot.AUM, bot.UptimeH,
	).Scan(&bot.ID, &bot.CreatedAt, &bot.UpdatedAt)
}

func (r *BotRepo) FindByID(id string) (*domain.Bot, error) {
	b := &domain.Bot{}
	query := `SELECT id, user_id, name, strategy, exchange, pair, status, today_pnl, total_pnl,
		win_rate, trades_count, invested, risk_level, leverage, aum, uptime_hours, created_at, updated_at
		FROM bots WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&b.ID, &b.UserID, &b.Name, &b.Strategy, &b.Exchange, &b.Pair, &b.Status,
		&b.TodayPnl, &b.TotalPnl, &b.WinRate, &b.Trades, &b.Invested,
		&b.RiskLevel, &b.Leverage, &b.AUM, &b.UptimeH, &b.CreatedAt, &b.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return b, err
}

func (r *BotRepo) FindByUserID(userID string) ([]domain.Bot, error) {
	rows, err := r.db.Query(`SELECT id, user_id, name, strategy, exchange, pair, status, today_pnl, total_pnl,
		win_rate, trades_count, invested, risk_level, leverage, aum, uptime_hours, created_at, updated_at
		FROM bots WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bots []domain.Bot
	for rows.Next() {
		var b domain.Bot
		if err := rows.Scan(&b.ID, &b.UserID, &b.Name, &b.Strategy, &b.Exchange, &b.Pair, &b.Status,
			&b.TodayPnl, &b.TotalPnl, &b.WinRate, &b.Trades, &b.Invested,
			&b.RiskLevel, &b.Leverage, &b.AUM, &b.UptimeH, &b.CreatedAt, &b.UpdatedAt); err != nil {
			return nil, err
		}
		bots = append(bots, b)
	}
	return bots, nil
}

func (r *BotRepo) Update(bot *domain.Bot) error {
	bot.UpdatedAt = time.Now()
	query := `UPDATE bots SET name=$1, strategy=$2, exchange=$3, pair=$4, status=$5,
		today_pnl=$6, total_pnl=$7, win_rate=$8, trades_count=$9, invested=$10,
		risk_level=$11, leverage=$12, aum=$13, uptime_hours=$14, updated_at=$15 WHERE id=$16`
	_, err := r.db.Exec(query, bot.Name, bot.Strategy, bot.Exchange, bot.Pair, bot.Status,
		bot.TodayPnl, bot.TotalPnl, bot.WinRate, bot.Trades, bot.Invested,
		bot.RiskLevel, bot.Leverage, bot.AUM, bot.UptimeH, bot.UpdatedAt, bot.ID)
	return err
}

func (r *BotRepo) ToggleStatus(id string) (*domain.Bot, error) {
	b, err := r.FindByID(id)
	if err != nil || b == nil {
		return nil, err
	}
	newStatus := "paused"
	if b.Status == "paused" || b.Status == "error" {
		newStatus = "running"
	}
	_, err = r.db.Exec(`UPDATE bots SET status=$1, updated_at=NOW() WHERE id=$2`, newStatus, id)
	if err != nil {
		return nil, err
	}
	b.Status = newStatus
	return b, nil
}

func (r *BotRepo) GetUserBotStats(userID string) (activeBots int, monthTrades int, err error) {
	err = r.db.QueryRow(`SELECT COUNT(*) FROM bots WHERE user_id=$1 AND status='running'`, userID).Scan(&activeBots)
	if err != nil {
		return
	}
	err = r.db.QueryRow(`SELECT COALESCE(SUM(trades_count),0) FROM bots WHERE user_id=$1`, userID).Scan(&monthTrades)
	return
}

func (r *BotRepo) ListAll(filter domain.BotFilter) ([]domain.Bot, int, error) {
	where := []string{"1=1"}
	args := []interface{}{}
	idx := 1

	if filter.Status != "" && filter.Status != "All" {
		where = append(where, fmt.Sprintf("status=$%d", idx))
		args = append(args, strings.ToLower(filter.Status))
		idx++
	}
	if filter.Exchange != "" && filter.Exchange != "All" {
		where = append(where, fmt.Sprintf("exchange=$%d", idx))
		args = append(args, filter.Exchange)
		idx++
	}
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PerPage < 1 {
		filter.PerPage = 36
	}
	offset := (filter.Page - 1) * filter.PerPage

	var total int
	countQ := fmt.Sprintf("SELECT COUNT(*) FROM bots WHERE %s", strings.Join(where, " AND"))
	r.db.QueryRow(countQ, args...).Scan(&total)

	// Use $N placeholders for LIMIT/OFFSET to avoid SQL injection
	limitArg := idx
	offsetArg := idx + 1
	query := fmt.Sprintf(`SELECT id, user_id, name, strategy, exchange, pair, status,
		today_pnl, total_pnl, win_rate, trades_count, invested, risk_level, leverage, aum, uptime_hours, created_at, updated_at
		FROM bots WHERE %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d`,
		strings.Join(where, " AND"), limitArg, offsetArg)

	rows, err := r.db.Query(query, append(args, filter.PerPage, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var bots []domain.Bot
	for rows.Next() {
		var b domain.Bot
		rows.Scan(&b.ID, &b.UserID, &b.Name, &b.Strategy, &b.Exchange, &b.Pair, &b.Status,
			&b.TodayPnl, &b.TotalPnl, &b.WinRate, &b.Trades, &b.Invested,
			&b.RiskLevel, &b.Leverage, &b.AUM, &b.UptimeH, &b.CreatedAt, &b.UpdatedAt)
		bots = append(bots, b)
	}
	return bots, total, nil
}

func (r *BotRepo) GetPerformance(userID, rangeType string) (*domain.PerformanceResponse, error) {
	resp := &domain.PerformanceResponse{
		Range: rangeType,
		Metrics: domain.PerfMetrics{TotalProfit: 0, WinRate: 0, TotalTrades: 0,
			BestDay: 0, AvgDailyProfit: 0, ProfitFactor: 0},
		WinLoss: domain.WinLossData{Wins: 0, Losses: 0},
	}

	// Per bot — real data from DB only
	bots, err := r.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	var totalPnL float64
	var totalTrades int
	for _, b := range bots {
		totalPnL += b.TotalPnl
		totalTrades += b.Trades
		resp.PerBot = append(resp.PerBot, domain.BotPnL{
			Name: b.Name,
			PnL:  b.TotalPnl,
		})
	}
	resp.Metrics.TotalProfit = totalPnL
	resp.Metrics.TotalTrades = totalTrades
	if len(bots) > 0 {
		var wins, losses int
		for _, b := range bots {
			if b.WinRate > 50 {
				wins++
			} else {
				losses++
			}
		}
		resp.WinLoss = domain.WinLossData{Wins: wins, Losses: losses}
		var avgWinRate float64
		for _, b := range bots {
			avgWinRate += b.WinRate
		}
		resp.Metrics.WinRate = avgWinRate / float64(len(bots))
	}
	return resp, nil
}
