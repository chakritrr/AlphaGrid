CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    strategy VARCHAR(50) NOT NULL,
    exchange VARCHAR(50) NOT NULL,
    pair VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'running',
    today_pnl DECIMAL(18,4) NOT NULL DEFAULT 0,
    total_pnl DECIMAL(18,4) NOT NULL DEFAULT 0,
    win_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    trades_count INT NOT NULL DEFAULT 0,
    invested DECIMAL(18,4) NOT NULL DEFAULT 0,
    risk_level VARCHAR(10) NOT NULL DEFAULT 'medium',
    leverage INT NOT NULL DEFAULT 1,
    aum DECIMAL(18,4) NOT NULL DEFAULT 0,
    uptime_hours INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_bots_status ON bots(status);
CREATE INDEX idx_bots_exchange ON bots(exchange);
