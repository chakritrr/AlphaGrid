package postgres

import (
	"database/sql"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type SubscriptionRepo struct {
	db *sql.DB
}

func NewSubscriptionRepo(db *sql.DB) *SubscriptionRepo {
	return &SubscriptionRepo{db: db}
}

func (r *SubscriptionRepo) FindByUserID(userID string) (*domain.Subscription, error) {
	s := &domain.Subscription{}
	query := `SELECT id, user_id, plan_id, status, current_period_start, current_period_end, canceled_at, created_at
		FROM subscriptions WHERE user_id=$1`
	var canceledAt sql.NullTime
	err := r.db.QueryRow(query, userID).Scan(
		&s.ID, &s.UserID, &s.PlanID, &s.Status,
		&s.CurrentPeriodStart, &s.CurrentPeriodEnd, &canceledAt, &s.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if canceledAt.Valid {
		s.CanceledAt = &canceledAt.Time
	}
	return s, err
}

func (r *SubscriptionRepo) Create(sub *domain.Subscription) error {
	query := `INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
		VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	return r.db.QueryRow(query, sub.UserID, sub.PlanID, sub.Status,
		sub.CurrentPeriodStart, sub.CurrentPeriodEnd).Scan(&sub.ID, &sub.CreatedAt)
}

func (r *SubscriptionRepo) Update(sub *domain.Subscription) error {
	_, err := r.db.Exec(`UPDATE subscriptions SET plan_id=$1, status=$2, current_period_start=$3, current_period_end=$4,
		canceled_at=$5 WHERE id=$6`, sub.PlanID, sub.Status, sub.CurrentPeriodStart, sub.CurrentPeriodEnd, sub.CanceledAt, sub.ID)
	return err
}

func (r *SubscriptionRepo) GetPlans() ([]domain.Plan, error) {
	rows, err := r.db.Query(`SELECT id, name, price, bots_limit, exchanges_limit, features::text FROM plans ORDER BY price`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var plans []domain.Plan
	for rows.Next() {
		var p domain.Plan
		var featuresJSON string
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.BotsLimit, &p.ExchangesLimit, &featuresJSON); err != nil {
			return nil, err
		}
		// Note: In production, parse json. But for mock we'll just return the plans inline
		plans = append(plans, p)
	}
	return plans, nil
}

func (r *SubscriptionRepo) GetPayments(userID string) ([]domain.Payment, error) {
	rows, err := r.db.Query(`SELECT id, user_id, plan_id, amount, status, paid_at
		FROM payment_history WHERE user_id=$1 ORDER BY paid_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payments []domain.Payment
	for rows.Next() {
		var p domain.Payment
		rows.Scan(&p.ID, &p.UserID, &p.PlanID, &p.Amount, &p.Status, &p.PaidAt)
		payments = append(payments, p)
	}
	return payments, nil
}

func (r *SubscriptionRepo) GetMRRSeries() ([]domain.MRRSeries, error) {
	var series []domain.MRRSeries
	m := 168000.0
	for i := 11; i >= 0; i-- {
		d := time.Now().AddDate(0, -i, 0)
		m += 6000 + float64(i)*800 - (map[int]float64{4: 12000}[i])
		series = append(series, domain.MRRSeries{
			Month: d.Format("Jan"),
			MRR:   m,
			NRR:   102 + float64(i%16),
		})
	}
	return series, nil
}

func (r *SubscriptionRepo) GetPlanBreakdown() ([]domain.PlanBreakdown, error) {
	return []domain.PlanBreakdown{
		{Name: "Starter", Count: 1842, Price: 29, Color: "#6ee7ff"},
		{Name: "Pro", Count: 1136, Price: 79, Color: "#b6ff3c"},
		{Name: "Elite", Count: 412, Price: 199, Color: "#c084fc"},
	}, nil
}

func (r *SubscriptionRepo) GetRenewals() ([]domain.Renewal, error) {
	return []domain.Renewal{
		{User: "Maya Okafor", Plan: "Pro", Amount: 79, Days: 3, Method: "Visa ••4242"},
		{User: "Vera Reyes", Plan: "Elite", Amount: 199, Days: 0, Method: "Mastercard ••8810"},
		{User: "Mateo Bauer", Plan: "Pro", Amount: 79, Days: -1, Method: "USDC · 0x9f…2c"},
		{User: "Noor Haddad", Plan: "Starter", Amount: 29, Days: -2, Method: "Apple Pay"},
		{User: "Asher Costa", Plan: "Pro", Amount: 79, Days: -3, Method: "ACH"},
	}, nil
}

func (r *SubscriptionRepo) GetActiveSubsCount() (int, error) {
	var count int
	err := r.db.QueryRow(`SELECT COUNT(*) FROM users WHERE status='active'`).Scan(&count)
	return count, err
}
