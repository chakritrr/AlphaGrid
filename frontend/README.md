# BinQuant — Trading Bot Platform

> Premium crypto trading bot platform — user dashboard, admin panel, and marketing landing page. Built with React 19 + Tailwind CSS v4 + Vite.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Charts | Recharts |
| Icons | Lucide React |
| State | React state (no Redux) |
| Routing | react-router-dom |
| Fonts | Geist (UI), Geist Mono (numeric) |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Route Map

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing Page** | Public marketing site — hero, stats, pricing, FAQ, footer |
| `/app` | **User Dashboard** | Bot management, P&L charts, trades, exchange connect, subscription |
| `/admin` | **Admin Panel** | User mgmt, bot fleet monitor, subscriptions, alert center |

## Project Structure

```
src/
├── components/       # Shared UI (Sidebar, TopBar, StatCard, BotCard, …)
├── pages/
│   ├── Landing.jsx   # Marketing landing page
│   ├── Dashboard.jsx # Main user dashboard
│   ├── Bots.jsx       # My Bots + Create Bot Wizard
│   ├── Performance.jsx# Charts, metrics, trade history
│   ├── Exchanges.jsx  # Exchange Connect + Add Exchange Wizard
│   ├── Subscription.jsx# Plans, usage, payment history
│   └── Placeholder.jsx# Settings / Help pages
├── admin/
│   ├── AdminApp.jsx   # Admin shell (sidebar, topbar, routing)
│   ├── data.js        # Admin mock data
│   ├── components/    # Admin UI (StatusPill, Avatar, KPI, …)
│   └── views/         # Overview, Users, Fleet, Subscriptions, Alerts
├── data/
│   └── mockData.js    # User dashboard mock data
├── App.jsx            # Router entry point
├── DashboardApp.jsx   # User dashboard app shell
├── main.jsx           # Vite entry point
└── index.css          # Global theme + utility classes
```

## Design System

All tokens are defined in `src/index.css`:

- **Background:** `#0A0B0F` (near-black)
- **Cards:** Glassmorphism (`glass`, `glass-2` classes)
- **Accents:** `#00D4FF` (blue), `#00FF88` (green), `#8B5CF6` (purple)
- **Admin accent:** `#b6ff3c` (lime)
- **Fonts:** Geist (sans), Geist Mono (mono)

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for full reference.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — Project structure, data flow, routing
- [Routes](docs/ROUTES.md) — Complete route map with all views
- [Components](docs/COMPONENTS.md) — Component library reference
- [Design System](docs/DESIGN_SYSTEM.md) — Design tokens and styling
- [API Spec](docs/API_SPEC.md) — Backend API contract for future implementation

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build
```
