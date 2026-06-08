# AlphaGrid — BinQuant

> Premium crypto trading bot platform. Monorepo with React frontend and Go backend.

```
AlphaGrid/
├── frontend/     React 19 + Vite + Tailwind CSS v4
├── backend/      Go 1.24 + Gin + PostgreSQL
└── docs/         Platform documentation
```

---

## Quick Start

### Prerequisites

- **Docker** (for backend)
- **Node.js 20+** (for frontend)

### 1. Backend

```bash
cd backend
docker-compose up --build -d
```

Verify: `curl http://localhost:8080/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Routes

| URL | App | Description |
|-----|-----|-------------|
| `/` | **Landing Page** | Public marketing site |
| `/app` | **User Dashboard** | Bot management, P&L, trades |
| `/admin` | **Admin Panel** | Users, fleet, subscriptions, alerts |

## Accounts

| Role | Email | Password |
|------|-------|----------|
| User | `alex@example.com` | `user123` |
| Admin | `admin@binquant.io` | `admin123` |

---

## Project Structure

```
frontend/                         backend/
├── src/                          ├── cmd/server/
│   ├── pages/                    ├── internal/
│   │   ├── Landing.jsx           │   ├── domain/
│   │   ├── Dashboard.jsx         │   ├── dto/
│   │   ├── Bots.jsx              │   ├── repository/
│   │   ├── Exchanges.jsx         │   ├── usecase/
│   │   ├── Subscription.jsx      │   ├── handler/
│   │   └── Performance.jsx       │   ├── middleware/
│   ├── admin/                    │   └── pkg/
│   │   └── views/                ├── migrations/
│   ├── components/               ├── seed/
│   ├── services/                 ├── Dockerfile
│   ├── data/                     └── docker-compose.yml
│   ├── App.jsx
│   └── index.css                 docs/
├── docs/                         ├── API_SPEC.md
│   ├── ARCHITECTURE.md           ├── ARCHITECTURE.md
│   ├── ROUTES.md                 ├── DATABASE.md
│   ├── COMPONENTS.md             └── DEVELOPMENT.md
│   ├── DESIGN_SYSTEM.md
│   └── API_SPEC.md
└── README.md
```

---

## Documentation

### Platform
- [Frontend Architecture](frontend/docs/ARCHITECTURE.md)
- [Routes](frontend/docs/ROUTES.md)
- [Components](frontend/docs/COMPONENTS.md)
- [Design System](frontend/docs/DESIGN_SYSTEM.md)

### Backend
- [Backend Architecture](backend/docs/ARCHITECTURE.md)
- [API Reference](backend/docs/API.md)
- [Database Schema](backend/docs/DATABASE.md)
- [Development Guide](backend/docs/DEVELOPMENT.md)

### API Contract
- [Full API Spec](frontend/docs/API_SPEC.md) — Data models, all endpoints, WebSocket events

---

## Tech Stack

| Layer | Frontend | Backend |
|-------|----------|---------|
| Language | React 19 | Go 1.24 |
| Framework | Vite 8 | Gin |
| Styling | Tailwind CSS v4 | — |
| Charts | Recharts | — |
| Icons | Lucide React | — |
| Database | — | PostgreSQL 16 |
| Auth | JWT (localStorage) | JWT (golang-jwt) |
| Container | — | Docker + docker-compose |
