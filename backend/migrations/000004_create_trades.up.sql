CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pair VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    entry_price DECIMAL(18,4) NOT NULL,
    exit_price DECIMAL(18,4) DEFAULT 0,
    quantity DECIMAL(18,8) NOT NULL DEFAULT 0,
    pnl DECIMAL(18,4) DEFAULT 0,
    duration VARCHAR(20) DEFAULT '',
    status VARCHAR(10) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_bot_id ON trades(bot_id);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);
