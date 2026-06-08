# API Reference

> Base URL: `http://localhost:8080`
>
> All authenticated endpoints require header: `Authorization: Bearer <token>`

---

## Health

```bash
GET /health
```

```json
{ "status": "ok" }
```

---

## Auth (Public)

### Register

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User Name","email":"user@example.com","password":"password123"}'
```

**Response** `201`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "plan": "starter",
    "botsUsed": 0,
    "botsLimit": 2
  }
}
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"user123"}'
```

**Response** `200`: Same shape as register.

---

## User Dashboard API (JWT required)

### Dashboard Stats

```bash
curl http://localhost:8080/api/v1/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

```json
{
  "portfolioValue": 35825,
  "change30d": 44.45,
  "todayPnl": -2.7,
  "activeBots": 3,
  "monthTrades": 661
}
```

### Portfolio P&L

```bash
curl "http://localhost:8080/api/v1/portfolio/pnl?range=30d" \
  -H "Authorization: Bearer <token>"
```

**Query params:** `range` = `7d` | `30d` (default) | `90d` | `1y`

```json
{
  "range": "30d",
  "series": [
    { "date": "May 10", "value": 28400, "pnl": 120 }
  ]
}
```

### List Bots

```bash
curl http://localhost:8080/api/v1/bots \
  -H "Authorization: Bearer <token>"
```

```json
{
  "bots": [
    {
      "id": "uuid",
      "name": "Athena Scalper",
      "strategy": "Scalping",
      "exchange": "Binance",
      "pair": "BTC/USDT",
      "status": "running",
      "todayPnl": 184.42,
      "totalPnl": 4820.18,
      "winRate": 72,
      "trades": 142,
      "invested": 5000,
      "risk": "medium",
      "leverage": 1,
      "aum": 5000,
      "uptimeH": 0
    }
  ]
}
```

### Create Bot

```bash
curl -X POST http://localhost:8080/api/v1/bots \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"Scalping","exchange":"Binance","pair":"BTC/USDT","investment":2500}'
```

**Response** `201`: Full bot object.

### Toggle Bot

```bash
curl -X PATCH http://localhost:8080/api/v1/bots/:id/toggle \
  -H "Authorization: Bearer <token>"
```

```json
{ "id": "uuid", "status": "paused" }
```

### List Trades

```bash
curl "http://localhost:8080/api/v1/trades?limit=10&offset=0" \
  -H "Authorization: Bearer <token>"
```

```json
{
  "trades": [
    {
      "id": "uuid",
      "botId": "uuid",
      "pair": "BTC/USDT",
      "side": "Long",
      "entry": 71240.50,
      "exit": 71398.80,
      "pnl": 158.30,
      "duration": "15m",
      "status": "win",
      "date": "2026-05-10T14:22:00Z"
    }
  ],
  "total": 12,
  "limit": 10,
  "offset": 0
}
```

### List Exchanges

```bash
curl http://localhost:8080/api/v1/exchanges \
  -H "Authorization: Bearer <token>"
```

```json
{
  "exchanges": [
    {
      "id": "uuid",
      "name": "Binance",
      "balance": 12480.42,
      "status": "connected",
      "lastSync": "recently"
    }
  ]
}
```

### Connect Exchange

```bash
curl -X POST http://localhost:8080/api/v1/exchanges \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"exchange":"Binance","apiKey":"key123","secretKey":"secret456","permissions":{"read":true,"trade":false,"withdraw":false}}'
```

**Response** `201`: Full exchange connection object.

### Performance

```bash
curl "http://localhost:8080/api/v1/performance?range=30d" \
  -H "Authorization: Bearer <token>"
```

```json
{
  "range": "30d",
  "metrics": {
    "totalProfit": 8420.21,
    "winRate": 74.9,
    "totalTrades": 849,
    "bestDay": 1284.90,
    "avgDailyProfit": 280.67,
    "profitFactor": 2.18
  },
  "cumulative": [
    { "date": "Apr 10", "value": 100, "pnl": 12 }
  ],
  "winLoss": { "wins": 287, "losses": 96 },
  "perBot": [
    { "name": "Athena Scalper", "pnl": 4820.18 }
  ]
}
```

### Subscription

```bash
curl http://localhost:8080/api/v1/subscription \
  -H "Authorization: Bearer <token>"
```

### Plans

```bash
curl http://localhost:8080/api/v1/subscription/plans \
  -H "Authorization: Bearer <token>"
```

### Payments

```bash
curl http://localhost:8080/api/v1/subscription/payments \
  -H "Authorization: Bearer <token>"
```

---

## Admin API (JWT + admin role required)

### Dashboard Overview

```bash
curl http://localhost:8080/api/admin/v1/dashboard \
  -H "Authorization: Bearer <admin_token>"
```

```json
{
  "revenueToday": 8642,
  "revenueMTD": 184320,
  "revenueYTD": 2186540,
  "activeSubs": 3428,
  "activeBots": 3,
  "totalBots": 5
}
```

### Signups

```bash
curl "http://localhost:8080/api/admin/v1/signups?range=30d" \
  -H "Authorization: Bearer <admin_token>"
```

### Revenue Split

```bash
curl http://localhost:8080/api/admin/v1/revenue/split \
  -H "Authorization: Bearer <admin_token>"
```

### List Users

```bash
curl "http://localhost:8080/api/admin/v1/users?search=&plan=&status=&sort=created_at&order=desc&page=1" \
  -H "Authorization: Bearer <admin_token>"
```

```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Maya Okafor",
      "email": "maya@email.com",
      "plan": "pro",
      "bots": 5,
      "rev": 142,
      "status": "active",
      "joined": "2025-09-12",
      "country": "US"
    }
  ],
  "total": 22,
  "page": 1
}
```

### Update User Status

```bash
curl -X PATCH http://localhost:8080/api/admin/v1/users/:id/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"suspended"}'
```

### List Admin Bots

```bash
curl "http://localhost:8080/api/admin/v1/bots?status=&exchange=" \
  -H "Authorization: Bearer <admin_token>"
```

### MRR Series

```bash
curl http://localhost:8080/api/admin/v1/subscriptions/mrr \
  -H "Authorization: Bearer <admin_token>"
```

### Plan Breakdown

```bash
curl http://localhost:8080/api/admin/v1/subscriptions/plans \
  -H "Authorization: Bearer <admin_token>"
```

### Renewals

```bash
curl http://localhost:8080/api/admin/v1/subscriptions/renewals \
  -H "Authorization: Bearer <admin_token>"
```

### List Alerts

```bash
curl "http://localhost:8080/api/admin/v1/alerts?kind=&ack=false&page=1" \
  -H "Authorization: Bearer <admin_token>"
```

### Acknowledge Alert

```bash
curl -X PATCH http://localhost:8080/api/admin/v1/alerts/:id/acknowledge \
  -H "Authorization: Bearer <admin_token>"
```

---

## Error Response Format

All errors return:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request / validation error |
| `401` | Unauthenticated (missing/invalid token) |
| `403` | Forbidden (not admin) |
| `404` | Not found |
| `500` | Internal server error |
