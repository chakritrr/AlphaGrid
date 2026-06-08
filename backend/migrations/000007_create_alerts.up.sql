CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    severity VARCHAR(20) NOT NULL,
    kind VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL DEFAULT '',
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_kind ON alerts(kind);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);
