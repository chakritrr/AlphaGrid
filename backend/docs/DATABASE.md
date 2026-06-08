# Database Schema

> PostgreSQL 16 — 8 tables, auto-migrated with golang-migrate.

## Entity Relationship Diagram

```
users 1──────────N bots
users 1──────────N trades
users 1──────────N exchange_connections
users 1──────────1 subscriptions
users 1──────────N payment_history
users 1──────────N portfolio_pnl
subscriptions N──1 plans
```

## Tables

### users

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | UUID | gen_random_uuid() | PK |
| name | VARCHAR(100) | | |
| email | VARCHAR(255) | | UNIQUE |
| password_hash | VARCHAR(255) | | bcrypt hash |
| role | VARCHAR(20) | `'user'` | `user` or `admin` |
| plan | VARCHAR(20) | `'starter'` | `starter`, `pro`, `elite` |
| status | VARCHAR(20) | `'active'` | `active`, `trial`, `past_due`, `suspended` |
| bots_used | INT | 0 | |
| bots_limit | INT | 2 | |
| avatar_url | VARCHAR(255) | '' | |
| country | VARCHAR(10) | `'US'` | |
| created_at | TIMESTAMPTZ | NOW() | |
| updated_at | TIMESTAMPTZ | NOW() | |

### plans

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | VARCHAR(20) | | PK — `starter`, `pro`, `elite` |
| name | VARCHAR(50) | | |
| price | DECIMAL(10,2) | | |
| bots_limit | INT | | |
| exchanges_limit | INT | | |
| features | JSONB | `'[]'` | Array of feature strings |
| color | VARCHAR(10) | `'#00D4FF'` | UI accent color |

**Seeded data:**

| id | name | price | bots | exchanges |
|----|------|-------|------|-----------|
| starter | Starter | $29 | 2 | 1 |
| pro | Pro | $79 | 10 | 3 |
| elite | Elite | $199 | 999 | 99 |

### bots

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) ON DELETE CASCADE |
| name | VARCHAR(100) | |
| strategy | VARCHAR(50) | `Scalping`, `Grid`, `DCA`, `Arbitrage` |
| exchange | VARCHAR(50) | |
| pair | VARCHAR(20) | e.g. `BTC/USDT` |
| status | VARCHAR(20) | `running`, `paused`, `error`, `idle`, `warning` |
| today_pnl, total_pnl | DECIMAL(18,4) | |
| win_rate | DECIMAL(5,2) | 0–100 |
| trades_count | INT | |
| invested | DECIMAL(18,4) | |
| risk_level | VARCHAR(10) | `low`, `medium`, `high` |
| leverage | INT | |
| aum | DECIMAL(18,4) | |
| uptime_hours | INT | |

### trades

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| bot_id | UUID | FK → bots(id) |
| user_id | UUID | FK → users(id) |
| pair | VARCHAR(20) | |
| side | VARCHAR(10) | `Long`, `Short` |
| entry_price, exit_price | DECIMAL(18,4) | |
| quantity | DECIMAL(18,8) | |
| pnl | DECIMAL(18,4) | |
| duration | VARCHAR(20) | e.g. `15m` |
| status | VARCHAR(10) | `win`, `loss`, `open` |

### exchange_connections

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) |
| exchange_name | VARCHAR(50) | |
| api_key_encrypted | TEXT | AES-256 in production |
| secret_key_encrypted | TEXT | |
| permissions | JSONB | `{"read":true,"trade":false,"withdraw":false}` |
| status | VARCHAR(20) | `connected`, `error` |
| balance | DECIMAL(18,4) | |
| last_sync_at | TIMESTAMPTZ | |

### subscriptions

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id), UNIQUE |
| plan_id | VARCHAR(20) | FK → plans(id) |
| status | VARCHAR(20) | `active`, `past_due`, `canceled` |
| current_period_start | TIMESTAMPTZ | |
| current_period_end | TIMESTAMPTZ | |
| canceled_at | TIMESTAMPTZ | nullable |

### payment_history

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) |
| plan_id | VARCHAR(20) | |
| amount | DECIMAL(10,2) | |
| status | VARCHAR(20) | `paid` |
| paid_at | TIMESTAMPTZ | |

### alerts

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| severity | VARCHAR(20) | `critical`, `warning`, `info` |
| kind | VARCHAR(50) | `bot_error`, `failed_payment`, `suspicious` |
| title | VARCHAR(255) | |
| detail | TEXT | |
| acknowledged | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### portfolio_pnl

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) |
| date | DATE | UNIQUE(user_id, date) |
| value | DECIMAL(18,4) | |
| pnl | DECIMAL(18,4) | |

### signup_analytics

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | PK |
| date | DATE | UNIQUE |
| signups | INT | |
| churn | INT | |
| revenue | DECIMAL(18,4) | |

## Migrations

Files are in `migrations/` named `NNNNNN_name.up.sql` / `NNNNNN_name.down.sql`.

| # | Name | Tables |
|---|------|--------|
| 1 | `create_users` | users |
| 2 | `create_plans` | plans (with seed data) |
| 3 | `create_bots` | bots |
| 4 | `create_trades` | trades |
| 5 | `create_exchange_connections` | exchange_connections |
| 6 | `create_subscriptions` | subscriptions, payment_history |
| 7 | `create_alerts` | alerts |
| 8 | `create_analytics` | portfolio_pnl, signup_analytics |

### Run manually

```bash
make migrate-up   # applies all pending
make migrate-down # rolls back one step
```

## Seed Data Accounts

Run automatically on first startup via `seed/seed.go`:

| Email | Password | Role |
|-------|----------|------|
| `admin@binquant.io` | `admin123` | admin |
| `alex@example.com` | `user123` | user |

Includes 20 mock users, 5 bots, 12 trades, 7 alerts, and subscription data.
