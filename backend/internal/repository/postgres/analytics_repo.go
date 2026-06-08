package postgres

import (
	"database/sql"
	"math"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/domain"
)

type AnalyticsRepo struct {
	db *sql.DB
}

func NewAnalyticsRepo(db *sql.DB) *AnalyticsRepo {
	return &AnalyticsRepo{db: db}
}

func (r *AnalyticsRepo) GetPortfolioPnL(userID string, days int) ([]domain.PnLSeries, error) {
	val := 24800.0
	var series []domain.PnLSeries
	for i := days - 1; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		drift := math.Sin(float64(i)/3)*220 + (float64(i%7) * 50)
		val += drift
		series = append(series, domain.PnLSeries{
			Date:  d.Format("Jan 2"),
			Value: math.Round(val),
			PnL:   math.Round(drift),
		})
	}
	return series, nil
}

func (r *AnalyticsRepo) GetSignups(rangeType string) ([]domain.SignupAnalytics, error) {
	days := 30
	var series []domain.SignupAnalytics
	base := 42.0
	for i := days - 1; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		base += math.Sin(float64(i)/3)*8 + float64(i%7)*2
		if base < 20 {
			base = 20
		}
		signups := int(math.Round(base))
		churn := int(math.Round(float64(signups) * (0.08 + float64(i%8)*0.01)))
		series = append(series, domain.SignupAnalytics{
			Day:     d.Format("Jan 2"),
			Date:    d,
			Signups: signups,
			Churn:   churn,
			Revenue: float64(signups)*38 + 800 + float64(i%400),
		})
	}
	return series, nil
}

func (r *AnalyticsRepo) GetRevenueSplit() ([]domain.RevenueSource, error) {
	return []domain.RevenueSource{
		{Name: "Subscriptions", Value: 184320},
		{Name: "Performance fee", Value: 92840},
		{Name: "Marketplace", Value: 31120},
		{Name: "API access", Value: 14210},
	}, nil
}

func (r *AnalyticsRepo) GetAdminDashboard() (*domain.AdminDashboard, error) {
	var totalBots int
	r.db.QueryRow(`SELECT COUNT(*) FROM bots`).Scan(&totalBots)
	var activeBots int
	r.db.QueryRow(`SELECT COUNT(*) FROM bots WHERE status='running'`).Scan(&activeBots)

	return &domain.AdminDashboard{
		RevenueToday: 8642,
		RevenueMTD:   184320,
		RevenueYTD:   2186540,
		ActiveSubs:   3428,
		ActiveBots:   activeBots,
		TotalBots:    totalBots,
	}, nil
}
