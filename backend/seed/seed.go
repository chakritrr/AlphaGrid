package seed

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"os"
	"time"

	"github.com/chakritrr/AlphaGrid/backend/internal/pkg/crypto"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Seeder struct {
	db *sql.DB
}

func NewSeeder(db *sql.DB) *Seeder {
	return &Seeder{db: db}
}

func (s *Seeder) Seed() error {
	var count int
	s.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if count > 0 {
		log.Println("Database already seeded, skipping")
		return nil
	}

	log.Println("Seeding database...")

	// Admin credentials from env vars (or use safe defaults for dev only)
	adminEmail := getEnv("SEED_ADMIN_EMAIL", "admin@binquant.io")
	adminPassword := getEnv("SEED_ADMIN_PASSWORD", "")
	if adminPassword == "" {
		log.Println("WARNING: SEED_ADMIN_PASSWORD not set, using insecure default (dev only!)")
		adminPassword = "admin123" // fallback for dev, should NEVER be used in production
	}
	adminName := getEnv("SEED_ADMIN_NAME", "Sasha Kowal")
	// Admin user
	adminID := uuid.New().String()
	adminHash, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash admin password: %w", err)
	}
	_, err = s.db.Exec(`INSERT INTO users (id, name, email, password_hash, role, plan, status, bots_used, bots_limit, country)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		adminID, adminName, adminEmail, string(adminHash),
		"admin", "elite", "active", 0, 999, "US")
	if err != nil {
		return fmt.Errorf("failed to insert admin user: %w", err)
	}

	// Demo user credentials from env vars
	demoEmail := getEnv("SEED_DEMO_EMAIL", "alex@example.com")
	demoPassword := getEnv("SEED_DEMO_PASSWORD", "user123")
	demoName := getEnv("SEED_DEMO_NAME", "Alex Karpov")
	userID := uuid.New().String()
	userHash, err := bcrypt.GenerateFromPassword([]byte(demoPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash demo password: %w", err)
	}
	_, err = s.db.Exec(`INSERT INTO users (id, name, email, password_hash, role, plan, status, bots_used, bots_limit, country)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		userID, demoName, demoEmail, string(userHash),
		"user", "pro", "active", 5, 10, "US")
	if err != nil {
		return fmt.Errorf("failed to insert demo user: %w", err)
	}

	// Mock users for admin panel
	firstNames := []string{"Maya", "Idris", "Vera", "Kenji", "Lior", "Ana", "Theo", "Priya", "Mateo", "Yuki", "Noor", "Eli", "Hana", "Omar", "Iris"}
	lastNames := []string{"Okafor", "Patel", "Nguyen", "Ferraro", "Bauer", "Reyes", "Lindqvist", "Haddad", "Sato", "Romero"}
	plans := []string{"starter", "starter", "pro", "pro", "pro", "elite"}
	statuses := []string{"active", "active", "active", "trial", "past_due", "suspended"}
	planLimits := map[string]int{"starter": 2, "pro": 10, "elite": 999}

	for i := 0; i < 20; i++ {
		id := uuid.New().String()
		fn := firstNames[i%len(firstNames)]
		ln := lastNames[i%len(lastNames)]
		plan := plans[i%len(plans)]
		status := statuses[i%len(statuses)]
		limits := planLimits[plan]
		botsUsed := i % (limits + 1)
		if botsUsed == 0 {
			botsUsed = 1
		}
		seedPassword := getEnv("SEED_DEFAULT_PASSWORD", "password")
		hash, err := bcrypt.GenerateFromPassword([]byte(seedPassword), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("failed to hash seed password: %w", err)
		}
		_, err = s.db.Exec(`INSERT INTO users (id, name, email, password_hash, role, plan, status, bots_used, bots_limit, country)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			id, fn+" "+ln, fn+"."+ln+"@email.com", string(hash),
			"user", plan, status, botsUsed, limits,
			[]string{"US", "DE", "SG", "BR", "UK", "JP"}[i%6])
		if err != nil {
			return fmt.Errorf("failed to insert mock user %d: %w", i, err)
		}
	}

	// Subscription for demo user
	if _, err := s.db.Exec(`INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
		VALUES ($1, $2, $3, $4, $5)`,
		userID, "pro", "active", time.Now().AddDate(0, -1, 0), time.Now().AddDate(0, 1, 0)); err != nil {
		return fmt.Errorf("failed to insert subscription: %w", err)
	}

	// Payment history
	payments := [][]interface{}{
		{userID, "pro", 79.00, "paid", time.Now().AddDate(0, -1, 0)},
		{userID, "pro", 79.00, "paid", time.Now().AddDate(0, -2, 0)},
		{userID, "starter", 29.00, "paid", time.Now().AddDate(0, -3, 0)},
	}
	for _, p := range payments {
		if _, err := s.db.Exec(`INSERT INTO payment_history (user_id, plan_id, amount, status, paid_at)
			VALUES ($1, $2, $3, $4, $5)`, p...); err != nil {
			return fmt.Errorf("failed to insert payment: %w", err)
		}
	}

	// Exchange connections for demo user (encrypt keys to match production format)
	exchanges := []struct{ name, apiKey, secret string; balance float64 }{
		{"Binance", "bnq_bin_key_abc123", "***", 12480.42},
		{"OKX", "bnq_okx_key_def456", "***", 6210.18},
		{"Bybit", "bnq_bybit_key_ghi789", "sk_byb..._rst", 3104.50},
	}
	for _, ex := range exchanges {
		encKey, err := crypto.Encrypt(ex.apiKey)
		if err != nil {
			return fmt.Errorf("failed to encrypt exchange API key for %s: %w", ex.name, err)
		}
		encSecret, err := crypto.Encrypt(ex.secret)
		if err != nil {
			return fmt.Errorf("failed to encrypt exchange secret key for %s: %w", ex.name, err)
		}
		if _, err := s.db.Exec(`INSERT INTO exchange_connections (user_id, exchange_name, api_key_encrypted, secret_key_encrypted, permissions, status, balance, last_sync_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			userID, ex.name, encKey, encSecret,
			`{"read":true,"trade":true,"withdraw":false}`, "connected", ex.balance, time.Now().Add(-2*time.Minute)); err != nil {
			return fmt.Errorf("failed to insert exchange connection %s: %w", ex.name, err)
		}
	}

	// Bots for demo user
	botNames := []struct {
		name     string
		strategy string
		exchange string
		pair     string
		risk     string
	}{
		{"Athena Scalper", "Scalping", "Binance", "BTC/USDT", "medium"},
		{"Hyperion Grid", "Grid", "OKX", "ETH/USDT", "low"},
		{"Orion DCA", "DCA", "Bybit", "SOL/USDT", "low"},
		{"Nyx Arbitrage", "Arbitrage", "Binance", "BNB/USDT", "high"},
		{"Helios Scalper", "Scalping", "Bitget", "ARB/USDT", "high"},
	}
	statuses_bot := []string{"running", "running", "paused", "running", "error"}
	pnls := []float64{184.42, 67.05, 0, 41.88, -22.10}
	totalPnls := []float64{4820.18, 2104.66, 612.30, 988.42, 144.20}
	winRates := []float64{72, 81, 64, 88, 51}
	trades := []int{142, 304, 48, 96, 71}
	invested := []float64{5000, 3500, 1500, 2000, 1000}

	for i := range botNames {
		botID := uuid.New().String()
		b := botNames[i]
		if _, err := s.db.Exec(`INSERT INTO bots (id, user_id, name, strategy, exchange, pair, status,
			today_pnl, total_pnl, win_rate, trades_count, invested, risk_level, aum)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
			botID, userID, b.name, b.strategy, b.exchange, b.pair, statuses_bot[i],
			pnls[i], totalPnls[i], winRates[i], trades[i], invested[i], b.risk, invested[i]); err != nil {
			return fmt.Errorf("failed to insert bot %s: %w", b.name, err)
		}
	}

	// Trades for demo user
	tradePairs := []string{"BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "ARB/USDT"}
	tradeSides := []string{"Long", "Short"}
	for i := 1; i <= 12; i++ {
		t := time.Now().Add(-time.Duration(i*2) * time.Hour)
		side := tradeSides[i%2]
		pair := tradePairs[i%len(tradePairs)]
		pnl := math.Round((math.Sin(float64(i))*100+50)*100) / 100
		status := "win"
		if pnl < 0 {
			status = "loss"
		}
		if _, err := s.db.Exec(`INSERT INTO trades (bot_id, user_id, pair, side, entry_price, exit_price, quantity, pnl, duration, status, created_at)
			VALUES ((SELECT id FROM bots LIMIT 1), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			userID, pair, side, 71240.50+float64(i*100), 71398.80+float64(i*100), 0.042, pnl, "15m", status, t); err != nil {
			return fmt.Errorf("failed to insert trade %d: %w", i, err)
		}
	}

	// Alerts
	alerts := []struct {
		sev, kind, title, detail string
		ack                      bool
		hoursAgo                 int
	}{
		{"critical", "bot_error", "Binance API: signature invalid", "BOT-1KQR · 7 consecutive failed orders", false, 1},
		{"critical", "failed_payment", "Card declined — auto-retry exhausted", "Vera Reyes · Quant · $249.00", false, 2},
		{"warning", "suspicious", "New device + new IP within 90s", "Mateo Bauer · Lagos → Frankfurt", false, 3},
		{"warning", "bot_error", "OKX rate-limit (10003) sustained 5m", "7 bots throttled — auto-cooldown engaged", false, 4},
		{"info", "suspicious", "Withdrawal pattern flagged", "Noor Haddad · 4 outbound USDC > $5k", true, 6},
		{"critical", "bot_error", "Kraken WS dropped — reconnect loop", "BOT-8FZA · failover to REST polling at 60s", true, 8},
		{"info", "bot_error", "Strategy desync 0.3%", "Self-healed at 14:02 UTC", true, 12},
	}
	for _, a := range alerts {
		t := time.Now().Add(-time.Duration(a.hoursAgo) * time.Hour)
		if _, err := s.db.Exec(`INSERT INTO alerts (severity, kind, title, detail, acknowledged, created_at)
			VALUES ($1, $2, $3, $4, $5, $6)`, a.sev, a.kind, a.title, a.detail, a.ack, t); err != nil {
			return fmt.Errorf("failed to insert alert %q: %w", a.title, err)
		}
	}

	log.Println("Seed data inserted successfully")
	return nil
}

// getEnv returns the env var value or fallback.
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
