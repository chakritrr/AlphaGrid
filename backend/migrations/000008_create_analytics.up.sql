CREATE TABLE portfolio_pnl (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    value DECIMAL(18,4) NOT NULL DEFAULT 0,
    pnl DECIMAL(18,4) NOT NULL DEFAULT 0,
    UNIQUE(user_id, date)
);

CREATE INDEX idx_portfolio_pnl_user_id ON portfolio_pnl(user_id);

CREATE TABLE signup_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    signups INT NOT NULL DEFAULT 0,
    churn INT NOT NULL DEFAULT 0,
    revenue DECIMAL(18,4) NOT NULL DEFAULT 0
);

CREATE INDEX idx_signup_analytics_date ON signup_analytics(date DESC);
