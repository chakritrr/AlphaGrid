CREATE TABLE plans (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bots_limit INT NOT NULL,
    exchanges_limit INT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    color VARCHAR(10) DEFAULT '#00D4FF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO plans (id, name, price, bots_limit, exchanges_limit, features, color) VALUES
    ('starter', 'Starter', 29, 2, 1, '["1 bot","1 exchange","Basic strategies","Paper trading","Community support"]', '#6ee7ff'),
    ('pro', 'Pro', 79, 10, 3, '["10 bots","All exchanges","All strategies","Backtesting","Email support","Live trading"]', '#b6ff3c'),
    ('elite', 'Elite', 199, 999, 99, '["Unlimited bots","All exchanges","Custom strategies","API access","Dedicated manager","P&L exports"]', '#c084fc');
