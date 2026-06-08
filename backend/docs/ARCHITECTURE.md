# Architecture

## Clean Architecture Layers

```
handler  →  usecase  →  repository (interface)  →  postgres (impl)
```

### Layer Rules

| Layer | Depends On | Purpose |
|-------|------------|---------|
| **domain** | Nothing | Pure structs, no tags, no imports |
| **dto** | Nothing | Request/response structs with JSON tags |
| **repository** | domain | Interface definition for data access |
| **repository/postgres** | domain, repository, database/sql | PostgreSQL implementation |
| **usecase** | domain, repository | Business logic, validation, orchestration |
| **handler** | usecase, dto, pkg/errors | HTTP request parsing + response writing |
| **middleware** | pkg/jwt | Request pre-processing (auth, CORS) |
| **pkg** | External libs | Config, DB connection, JWT, errors |

### Dependency Flow Diagram

```
cmd/server/main.go
└── config.Load()
└── database.Connect()
└── postgres.New*() repos
└── usecase.New*() services
└── handler.New*() handlers
└── r.GET/POST/PATCH routes
```

## Data Flow per Request

```
1. HTTP Request → Gin Router
2. Middleware (CORS → Auth → Admin check)
3. Handler: Parse request body/params
4. Handler → Usecase (DTO conversion)
5. Usecase → Repository (via interface)
6. Repository → PostgreSQL
7. Response bubbles back up
```

## Folder Purpose

| Directory | Contents |
|-----------|----------|
| `domain/` | `User`, `Bot`, `Trade`, `ExchangeConnection`, `Subscription`, `Plan`, `Alert`, `PortfolioPnL` |
| `dto/request/` | `RegisterRequest`, `LoginRequest`, `CreateBot`, `ConnectExchange`, `UserFilter` |
| `dto/response/` | `AuthResponse`, `ErrorResponse`, `DashboardStats`, `PnlSeries`, `AdminUserList` |
| `repository/` | Interfaces: `UserRepository`, `BotRepository`, `TradeRepository`, `ExchangeRepository`, `SubscriptionRepository`, `AlertRepository`, `AnalyticsRepository` |
| `repository/postgres/` | Concrete implementations with SQL queries |
| `usecase/` | `AuthUsecase`, `DashboardUsecase`, `ExchangeUsecase`, `SubscriptionUsecase`, `AdminUsecase` |
| `handler/` | `AuthHandler`, `DashboardHandler`, `AdminHandler` |
| `middleware/` | `AuthMiddleware`, `AdminMiddleware`, `CORSMiddleware` |
| `pkg/config/` | Env-based configuration loader |
| `pkg/database/` | PostgreSQL connection + migration runner |
| `pkg/jwt/` | Token generation + validation |
| `pkg/errors/` | `AppError` type with HTTP status codes |

## Error Handling

All errors flow through `pkg/errors.AppError`:

```go
type AppError struct {
    Code    string // "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED", etc.
    Message string
    Status  int    // HTTP status code
}
```

Standardized JSON response:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Email already registered"
    }
}
```

## Authentication Flow

```
1. POST /api/v1/auth/login → { email, password }
2. Verify password with bcrypt
3. Generate JWT with claims: { userId, email, role }
4. Client stores token in localStorage
5. Subsequent requests: Authorization: Bearer <token>
6. AuthMiddleware validates JWT → sets userId/email/role in Gin context
```

## Seed Data

`seed/seed.go` runs automatically on first startup if the database is empty:

- Admin user + demo user
- 20 mock users for admin panel
- 5 bots with 12 trades for demo user
- 7 alerts (critical, warning, info)
- Subscription + payment history for demo user
