# Architecture

## Overview

BinQuant is a single-page React app with three distinct "apps" served under different routes:

```
BrowserRouter
  ├── /         → LandingPage     (public marketing site)
  ├── /app/*    → DashboardApp    (user dashboard with sidebar)
  └── /admin/*  → AdminApp        (admin panel with admin sidebar)
```

Each app is self-contained with its own layout shell, components, and mock data. There is no shared global state — each page manages its own state via React hooks (`useState`, `useMemo`, `useEffect`).

---

## Component Tree

### Landing Page (`/`)

```
LandingPage
├── Header (nav + sign-in buttons)
├── Ticker (crypto price ticker tape)
├── Hero Section (headline + CTA + live profit chart)
├── Stats Section (4 stat cards)
├── How It Works (3-step grid)
├── Strategies (6 strategy cards)
├── Performance (90-day equity curve chart)
├── Exchanges (8 exchange logos)
├── Pricing (3-tier pricing cards)
├── Testimonials (3 quote cards)
├── FAQ (accordion)
├── CTA Section
└── Footer (links + copyright)
```

### User Dashboard (`/app`)

```
DashboardApp
├── Sidebar (nav, user card, plan upsell, logout)
└── Main Content
    ├── Dashboard   → TopBar + StatCards + Portfolio P&L Chart + Active Bots + Trades Table
    ├── Bots        → TopBar + Filter tabs + BotCard grid + CreateBotWizard (modal)
    ├── Performance → TopBar + Range tabs + Metrics + Cumulative Chart + Daily P&L + Win/Loss + Trade History
    ├── Exchanges   → TopBar + Exchange cards + AddExchangeWizard (modal)
    ├── Subscription→ TopBar + Plan banner + Usage bars + Plans + Payment history
    ├── Settings    → Placeholder page
    └── Help        → Placeholder page
```

### Admin Panel (`/admin`)

```
AdminApp
├── Sidebar (nav, env selector, system stats)
├── TopBar (breadcrumb, search, alerts, status)
└── Main Content
    ├── Overview    → KPI cards + Signups chart + Revenue donut + Alert preview + Top bots
    ├── Users       → Search + filters + sortable table + batch actions
    ├── Fleet       → Status bar + filterable bot card grid (live tick)
    ├── Subs        → MRR chart + Plan breakdown pie + Renewal queue + Churn signals
    └── Alerts      → Severity tabs + acknowledge flow + filter by kind
```

---

## Data Flow

All data is currently **mock** (client-side generated). The architecture is designed to swap in real API calls:

```
Mock (current)           Future (with backend)
──────────────           ──────────────────
data/mockData.js  ──>    fetch('/api/v1/...')
  │                       │
  ├── PNL_30D             GET /api/v1/portfolio/pnl?range=30d
  ├── BOTS                GET /api/v1/bots
  ├── TRADES              GET /api/v1/trades?limit=10
  └── ...

admin/data.js     ──>    fetch('/api/admin/v1/...')
  │                       │
  ├── users               GET /api/admin/v1/users
  ├── bots                GET /api/admin/v1/bots
  ├── alerts              GET /api/admin/v1/alerts
  ├── mrrSeries           GET /api/admin/v1/subscriptions/mrr
  └── ...
```

**Pattern for migration:** Replace the import from `data/mockData.js` with a `useEffect` + `fetch` call, keeping data shapes identical. No component changes needed.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No Redux** | State is local to pages/views — no global store needed. Redux was removed during the dashboard rewrite. |
| **CSS-first Tailwind** | Tailwind v4 uses `@theme` in CSS file rather than `tailwind.config.js`. All design tokens live in `src/index.css`. |
| **Inline SVG icons in admin** | Admin panel uses hand-inlined SVG icons to avoid importing the full lucide-react library twice (admin uses a unique set). User dashboard uses lucide-react directly. |
| **Recharts** | All charts use Recharts — it's already installed and provides the needed chart types (area, bar, pie, composed, line). |
| **State-based routing vs react-router** | User dashboard and admin panel use state-based page switching (faster, no URL changes). The top-level routes (`/`, `/app`, `/admin`) use react-router for proper URL-based navigation. |
