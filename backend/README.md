# BinQuant — Backend API

> Go + Gin + PostgreSQL backend for the BinQuant trading bot platform.

## Tech Stack

| Layer | Tech |
|-------|------|
| Language | **Go 1.24** |
| HTTP Framework | **Gin v1.10** |
| Database | **PostgreSQL 16** |
| Auth | **JWT (golang-jwt/v5)** |
| Migrations | **golang-migrate** |
| Password | **bcrypt** |
| Container | **Docker + docker-compose** |

## Quick Start

```bash
# Start everything
docker-compose up --build -d

# Check health
curl http://localhost:8080/health
# → {"status":"ok"}
```

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@binquant.io` | `admin123` |
| Demo User | `alex@example.com` | `user123` |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | API listen port |
| `DATABASE_URL` | `postgres://binquant:binquant@localhost:5432/binquant?sslmode=disable` | PostgreSQL connection |
| `JWT_SECRET` | `change-me-in-production` | JWT signing key |
| `JWT_EXPIRATION_HOURS` | `72` | Token lifetime |
| `ENVIRONMENT` | `development` | Runtime environment |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

## Routes

| Base Path | Auth | App |
|-----------|------|-----|
| `/api/v1` | JWT | User Dashboard |
| `/api/admin/v1` | JWT + admin role | Admin Panel |
| `/api/v1/auth` | Public | Register / Login |

See [docs/API.md](docs/API.md) for full endpoint reference.

## Project Structure

```
backend/
├── cmd/server/main.go       # Entry point
├── internal/
│   ├── domain/              # Business entities (structs)
│   ├── dto/                 # Request/response types
│   ├── repository/          # Interfaces + postgres implementations
│   ├── usecase/             # Business logic
│   ├── handler/             # HTTP handlers (Gin)
│   ├── middleware/          # Auth, CORS
│   └── pkg/                 # Config, DB, JWT, errors
├── migrations/              # SQL migrations
├── seed/                    # Dev seed data
├── Dockerfile
└── docker-compose.yml
```

## Makefile Commands

```bash
make dev          # docker-compose up --build -d
make dev-down     # docker-compose down
make dev-logs     # docker-compose logs -f
make build        # go build
make run          # go run (local)
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — Clean Architecture layers and data flow
- [API Reference](docs/API.md) — All endpoints with request/response examples
- [Database](docs/DATABASE.md) — Schema, ER diagram, seed data
- [Development](docs/DEVELOPMENT.md) — Docker guide, debugging, extending
