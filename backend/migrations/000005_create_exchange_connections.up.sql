CREATE TABLE exchange_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exchange_name VARCHAR(50) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    secret_key_encrypted TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{"read":true,"trade":false,"withdraw":false}',
    status VARCHAR(20) NOT NULL DEFAULT 'connected',
    balance DECIMAL(18,4) NOT NULL DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exchange_connections_user_id ON exchange_connections(user_id);
