# Routes

## Route Map

```
/                   Landing Page (public)
/app                User Dashboard (requires auth in future)
/admin              Admin Panel (requires admin auth in future)
```

---

## Landing Page (`/`)

| Section | Component | Key Data |
|---------|-----------|----------|
| Header | Inline nav | — |
| Ticker | `Ticker` | Crypto prices (mock) |
| Hero | Inline | Headline, CTA, live profit counter, area chart |
| Live Stats | `StatCard` × 4 | Users, profit, uptime, active bots |
| How It Works | Glass card grid | 3 steps |
| Strategies | Glass card grid | 6 strategy cards |
| Performance | Glass card + area chart | 90-day equity curve |
| Exchanges | Logo grid | 8 exchanges |
| Pricing | Price card × 3 | Starter/Pro/Elite |
| Testimonials | Quote cards × 3 | User reviews |
| FAQ | Accordion | 5 questions |
| CTA | Glass card with aurora | Newsletter + CTAs |
| Footer | Links grid | Product, Company, Legal |

---

## User Dashboard (`/app`)

| Route (state) | Page | File | Key Components |
|---------------|------|------|----------------|
| `dashboard` | Dashboard | `pages/Dashboard.jsx` | TopBar, StatCard × 4, P&L AreaChart, BotCard × 3, TradesTable |
| `bots` | My Bots | `pages/Bots.jsx` | TopBar, filter tabs, BotCard grid, CreateBotWizard modal |
| `performance` | Performance | `pages/Performance.jsx` | TopBar, range tabs, 6 metrics, cumulative chart, daily bars, win/loss pie, per-bot bars, trade history |
| `exchanges` | Exchange Connect | `pages/Exchanges.jsx` | TopBar, exchange cards, AddExchangeWizard modal |
| `subscription` | Subscription | `pages/Subscription.jsx` | TopBar, plan banner, usage bars, 3 pricing cards, payment table |
| `settings` | Settings | `pages/Placeholder.jsx` | Placeholder card |
| `help` | Help | `pages/Placeholder.jsx` | Placeholder card |

### Navigation (Sidebar)
- **Workspace:** Dashboard, My Bots, Performance, Exchange Connect, Subscription
- **Account:** Settings, Help & Support

---

## Admin Panel (`/admin`)

| Route (state) | View | File | Key Data |
|---------------|------|------|----------|
| `overview` | Overview | `admin/views/Overview.jsx` | Revenue KPIs, signups+churn chart, revenue mix donut, alerts, top bots |
| `users` | User Management | `admin/views/Users.jsx` | Sortable/filterable table with 42 users, batch actions |
| `fleet` | Bot Fleet | `admin/views/Fleet.jsx` | Live grid (2s tick), status bar, per-bot sparklines |
| `subs` | Subscriptions | `admin/views/Subscriptions.jsx` | MRR 12mo chart, plan breakdown pie, renewals, churn signals |
| `alerts` | Alert Center | `admin/views/Alerts.jsx` | Severity tabs, acknowledge flow, 9 mock alerts |

### Navigation (Sidebar)
- **Workspace:** Overview, Users, Bot Fleet, Subscriptions, Alert Center
- **Insights:** Strategies, Marketplace, Affiliates, Audit log (all placeholder)
