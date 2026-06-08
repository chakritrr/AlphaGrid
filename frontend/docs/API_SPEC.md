# API Specification

> This document defines the backend API contract for BinQuant. All endpoints return JSON. This spec is for a future backend implementation — the frontend currently uses mock data that matches these shapes exactly.

---

## Base URLs

| App | Base Path | Auth |
|-----|-----------|------|
| User API | `/api/v1` | JWT Bearer token |
| Admin API | `/api/admin/v1` | JWT + admin role |
| Public API | `/api/public/v1` | None |

---

## Authentication

### POST /api/v1/auth/login

Login with email + password.

**Request:**
```json
{ "email": "user@example.com", "password": "..." }
```

**Response:**
```json
{
  "token": "jwt...",
  "user": {
    "id": "U-10240",
    "name": "Alex Karpov",
    "email": "alex@example.com",
    "avatar": "https://...",
    "role": "user",
    "plan": "pro",
    "botsUsed": 5,
    "botsLimit": 10
  }
}
```

### POST /api/v1/auth/register

```json
{ "name": "...", "email": "...", "password": "..." }
```

---

## User Dashboard API (`/api/v1`)

### GET /dashboard/stats

Portfolio-level statistics for the dashboard header.

**Response:**
```json
{
  "portfolioValue": 32418.42,
  "change30d": 12.4,
  "todayPnl": 284.18,
  "activeBots": 3,
  "monthTrades": 849
}
```

### GET /portfolio/pnl?range=30d

Portfolio P&L time series for the area chart.

**Response:**
```json
{
  "range": "30d",
  "series": [
    { "date": "May 10", "value": 28400, "pnl": 120 },
    { "date": "May 9", "value": 28280, "pnl": -40 }
  ]
}
```

**Query params:** `range` = `7d` | `30d` | `90d` | `1y`

### GET /bots

List all bots for the current user.

**Response:**
```json
{
  "bots": [
    {
      "id": "bot-01",
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
      "risk": "Medium",
      "runtime": "14d 3h"
    }
  ]
}
```

### POST /bots

Create a new bot.

**Request:**
```json
{
  "strategy": "scalping",
  "exchange": "Binance",
  "pair": "BTC/USDT",
  "investment": 2500,
  "risk": 50,
  "takeProfit": 2.5,
  "stopLoss": 1.5
}
```

**Response:** `201` with full bot object.

### PATCH /bots/:id/toggle

Toggle bot between running/paused.

**Response:** `{ "id": "bot-01", "status": "paused" }`

### GET /trades?limit=10&offset=0

Recent trades with pagination.

**Response:**
```json
{
  "trades": [
    {
      "id": "TX-9821",
      "date": "2026-05-10T14:22:00Z",
      "bot": "Athena Scalper",
      "pair": "BTC/USDT",
      "side": "Long",
      "entry": 71240.50,
      "exit": 71398.80,
      "pnl": 158.30,
      "duration": "12m",
      "status": "win"
    }
  ],
  "total": 849,
  "limit": 10,
  "offset": 0
}
```

### GET /exchanges

Connected exchanges.

**Response:**
```json
{
  "exchanges": [
    {
      "id": "ex-01",
      "name": "Binance",
      "balance": 12480.42,
      "status": "connected",
      "lastSync": "2 min ago",
      "accent": "#F0B90B"
    }
  ]
}
```

### POST /exchanges

Add a new exchange connection.

**Request:**
```json
{
  "exchange": "Binance",
  "apiKey": "...",
  "secretKey": "...",
  "permissions": { "read": true, "trade": true, "withdraw": false }
}
```

### GET /performance?range=30d

Performance analytics.

**Response:**
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
    { "date": "Apr 10", "cumulative": 100, "daily": 12 }
  ],
  "winLoss": { "wins": 287, "losses": 96 },
  "perBot": [
    { "name": "Athena", "pnl": 4820.18 }
  ]
}
```

### GET /subscription

Current subscription + usage.

**Response:**
```json
{
  "plan": "pro",
  "status": "active",
  "renewsAt": "2026-06-01",
  "botsUsed": 5,
  "botsLimit": 10,
  "usage": {
    "exchanges": { "used": 4, "limit": 3 },
    "trades": { "used": 849, "limit": null },
    "apiCalls": { "used": 12400, "limit": 50000 }
  }
}
```

### GET /subscription/plans

Available plans.

### GET /subscription/payments

Payment history.

---

## Admin API (`/api/admin/v1`)

### GET /dashboard

Admin overview KPIs.

**Response:**
```json
{
  "revenueToday": 8642,
  "revenueMTD": 184320,
  "revenueYTD": 2186540,
  "activeSubs": 3428,
  "activeBots": 5142,
  "totalBots": 5402
}
```

### GET /signups?range=30d

Signup and churn time series.

**Response:**
```json
{
  "series": [
    { "day": "May 10", "signups": 42, "churn": 5, "revenue": 2100 }
  ]
}
```

### GET /revenue/split

Revenue breakdown by source.

**Response:**
```json
{
  "sources": [
    { "name": "Subscriptions", "value": 184320 },
    { "name": "Performance fee", "value": 92840 },
    { "name": "Marketplace", "value": 31120 },
    { "name": "API access", "value": 14210 }
  ]
}
```

### GET /users?search=&plan=&status=&sort=&order=&page=1

User management — filtered, sorted, paginated.

**Response:**
```json
{
  "users": [
    {
      "id": "U-10240",
      "name": "Maya Okafor",
      "email": "maya.okafo@proton.me",
      "plan": "Pro",
      "bots": 5,
      "rev": 142,
      "status": "Active",
      "pnl30": 842.10,
      "joined": "2025-09-12",
      "country": "US"
    }
  ],
  "total": 42,
  "page": 1
}
```

### GET /admin/bots?status=&exchange=&page=1

Admin bot fleet.

**Response:**
```json
{
  "bots": [
    {
      "id": "BOT-1KQR",
      "user": "Maya Okafor",
      "exchange": "Binance",
      "strategy": "Grid · BTC",
      "pair": "BTC/USDT",
      "status": "running",
      "pnlToday": 42.18,
      "trades": 142,
      "winRate": 72,
      "leverage": 3,
      "uptimeH": 420,
      "aum": 12480
    }
  ],
  "total": 36
}
```

### GET /subscriptions/mrr

MRR time series.

**Response:**
```json
{
  "series": [
    { "month": "Jun", "mrr": 189000, "nrr": 112 }
  ]
}
```

### GET /subscriptions/plans

Plan breakdown.

**Response:**
```json
{
  "plans": [
    { "name": "Starter", "count": 1842, "price": 29, "color": "#6ee7ff" }
  ]
}
```

### GET /subscriptions/renewals

Upcoming renewals.

### GET /alerts?kind=&ack=&page=1

Alert center.

---

## WebSocket Events (`ws://host/ws`)

### User Dashboard

| Event | Direction | Payload |
|-------|-----------|---------|
| `bot:pnl` | Server→Client | `{ botId, pnlToday }` — real-time P&L update |
| `bot:status` | Server→Client | `{ botId, status }` — running/paused/error |
| `trade:new` | Server→Client | `{ trade }` — new fill notification |
| `portfolio:update` | Server→Client | `{ value, pnl }` — portfolio value tick |

### Admin

| Event | Direction | Payload |
|-------|-----------|---------|
| `fleet:tick` | Server→Client | `{ bots: [...] }` — full fleet state every 2s |
| `alert:new` | Server→Client | `{ alert }` — new alert pushed |

---

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "plan": "starter | pro | elite",
  "status": "active | trial | past_due | suspended",
  "bots": "number",
  "rev": "number",
  "pnl30": "number",
  "joined": "ISO date",
  "country": "string"
}
```

### Bot
```json
{
  "id": "string",
  "userId": "string",
  "name": "string",
  "exchange": "string",
  "strategy": "string",
  "pair": "string",
  "status": "running | paused | error | idle | warning",
  "todayPnl": "number",
  "totalPnl": "number",
  "winRate": "number (0-100)",
  "trades": "number",
  "invested": "number",
  "risk": "low | medium | high",
  "aum": "number",
  "uptimeH": "number",
  "leverage": "number"
}
```

### Trade
```json
{
  "id": "string",
  "date": "ISO datetime",
  "bot": "string",
  "botId": "string",
  "pair": "string",
  "side": "long | short",
  "entry": "number",
  "exit": "number",
  "pnl": "number",
  "duration": "string",
  "status": "win | loss"
}
```

### Alert
```json
{
  "id": "string",
  "severity": "critical | warning | info",
  "kind": "bot_error | failed_payment | suspicious",
  "title": "string",
  "detail": "string",
  "time": "ISO datetime",
  "acknowledged": false
}
```

### Subscription
```json
{
  "id": "string",
  "planId": "string",
  "userId": "string",
  "status": "active | past_due | canceled",
  "currentPeriodStart": "ISO date",
  "currentPeriodEnd": "ISO date",
  "canceledAt": "ISO date | null"
}
```

---

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { "field": "error reason" }
  }
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request / validation error
- `401` — Unauthenticated
- `403` — Forbidden (not admin)
- `404` — Not found
- `429` — Rate limited
- `500` — Server error
