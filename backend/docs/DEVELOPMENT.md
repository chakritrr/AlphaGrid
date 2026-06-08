# Development Guide

## Prerequisites

- Docker (for containerized development)
- Go 1.24+ (optional, for local development without Docker)

## Docker Workflow

```bash
# Build and start
make dev
# → docker-compose up --build -d
# → App at http://localhost:8080
# → DB at localhost:5432

# View logs
make dev-logs

# Stop
make dev-down
```

## Local Development (without Docker)

```bash
# Start PostgreSQL manually, then:
export DATABASE_URL="postgres://binquant:binquant@localhost:5432/binquant?sslmode=disable"
make run
```

## Adding a New Endpoint

Example: Adding a `GET /api/v1/bots/:id/stats` endpoint.

### 1. Add Repository method

```go
// internal/repository/bot_repository.go
type BotRepository interface {
    // ... existing methods ...
    GetBotStats(id string) (*BotStats, error)
}
```

### 2. Implement in postgres

```go
// internal/repository/postgres/bot_repo.go
func (r *BotRepo) GetBotStats(id string) (*domain.BotStats, error) {
    var stats domain.BotStats
    err := r.db.QueryRow(`SELECT ... FROM bots WHERE id=$1`, id).Scan(...)
    return &stats, err
}
```

### 3. Add domain entity (if new type)

```go
// internal/domain/bot.go
type BotStats struct {
    Trades int     `json:"trades"`
    PnL    float64 `json:"pnl"`
}
```

### 4. Add usecase method

```go
// internal/usecase/dashboard_usecase.go
func (uc *DashboardUsecase) GetBotStats(id string) (*domain.BotStats, error) {
    return uc.botRepo.GetBotStats(id)
}
```

### 5. Add handler

```go
// internal/handler/dashboard_handler.go or new file
func (h *DashboardHandler) GetBotStats(c *gin.Context) {
    id := c.Param("id")
    stats, err := h.dashboardUsecase.GetBotStats(id)
    if err != nil { /* handle */ }
    c.JSON(http.StatusOK, stats)
}
```

### 6. Add route in main.go

```go
// cmd/server/main.go
user.GET("/bots/:id/stats", dashHandler.GetBotStats)
```

## Testing Endpoints with curl

```bash
# Get admin token
ADMIN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@binquant.io","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Use token
curl http://localhost:8080/api/admin/v1/dashboard \
  -H "Authorization: Bearer $ADMIN"
```

## Common Tasks

### Rebuild from scratch

```bash
docker-compose down -v  # removes volumes (DB data)
docker-compose up --build -d
```

### Reset database only

```bash
docker-compose down
docker volume rm backend_pgdata
docker-compose up -d
```

### View database directly

```bash
docker-compose exec db psql -U binquant -d binquant
\dt
SELECT * FROM users;
```

### Add a new dependency

```bash
go get github.com/some/package
go mod tidy
```
