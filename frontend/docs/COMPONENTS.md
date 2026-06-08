# Component Reference

> All components live under `src/components/` (shared across user dashboard pages) and `src/admin/components/` (admin-specific).

---

## Shared Components (`src/components/`)

### Sidebar

Navigation sidebar with logo, user card, nav items, upsell panel, and logout.

```jsx
<Sidebar current="dashboard" onNav={setPage} mobileOpen={bool} onClose={fn} />
```

| Prop | Type | Description |
|------|------|-------------|
| `current` | string | Active page ID (`dashboard`, `bots`, `performance`, etc.) |
| `onNav` | fn | Called with page ID when nav item clicked |
| `mobileOpen` | boolean | Mobile menu toggle state |
| `onClose` | fn | Called to close mobile menu |

---

### TopBar

Page header with title, subtitle, search bar (desktop), notification bell, and action slot.

```jsx
<TopBar title="Page Title" subtitle="Subtitle text" action={<button />} />
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Page heading |
| `subtitle` | string? | Subtitle below heading |
| `onMenu` | fn? | Called when hamburger menu clicked (mobile) |
| `action` | ReactNode? | Right-side action button(s) |

---

### StatCard

KPI metric card with sparkline, delta indicator, and icon.

```jsx
<StatCard
  label="Portfolio Value"
  value="$32,418"
  delta={12.4}
  deltaLabel="vs 30d ago"
  accent="#00D4FF"
  icon={Wallet}
  sparkData={[{ value: 100 }, { value: 120 }, ...]}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Metric label (uppercase) |
| `value` | string | Formatted value |
| `delta` | number? | Percent change (positive = green, negative = red) |
| `deltaLabel` | string? | Context for delta (e.g. "vs 30d ago") |
| `accent` | string | Hex color for glow/icon |
| `icon` | LucideIcon | Icon component |
| `sparkData` | array? | `[{ value: number }]` for sparkline chart |

---

### BotCard

Trading bot card with status, P&L, win rate, and action buttons.

```jsx
<BotCard bot={bot} compact={false} onToggle={fn} onDetails={fn} />
```

| Prop | Type | Description |
|------|------|-------------|
| `bot` | object | Bot data (see mockData.js) |
| `compact` | boolean | Dashboard mode (no action buttons) |
| `onToggle` | fn? | Called with bot when Start/Pause clicked |
| `onDetails` | fn? | Called with bot when details arrow clicked |

**Bot shape:**
```js
{
  id: 'bot-01',
  name: 'Athena Scalper',
  strategy: 'Scalping',
  exchange: 'Binance',
  pair: 'BTC/USDT',
  status: 'running',       // 'running' | 'paused' | 'error'
  todayPnl: 184.42,
  totalPnl: 4820.18,
  winRate: 72,
  trades: 142,
  invested: 5000,
  risk: 'Medium',          // 'Low' | 'Medium' | 'High'
  runtime: '14d 3h',
}
```

---

### TradesTable

Trade history table with optional pagination.

```jsx
<TradesTable trades={TRADES} compact={false} showPagination={false} />
```

| Prop | Type | Description |
|------|------|-------------|
| `trades` | array | Array of trade objects |
| `compact` | boolean | Hides bot/entry/exit/duration columns |
| `showPagination` | boolean | Shows page controls (8 per page) |

---

### Other Shared Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ExchangeLogo` | `name, size, accent` | Letter-based exchange logo |
| `StatusBadge` | `status` | Colored pill with pulse dot (running/paused/error) |
| `StrategyBadge` | `strategy` | Categorized badge (Scalping→blue, Grid→purple, etc.) |
| `RiskBadge` | `risk` | Low→green, Medium→yellow, High→red |
| `Sparkline` | `data, color, height` | Mini Recharts line chart |
| `Progress` | `value, color, height` | Animated progress bar |
| `Modal` | `open, onClose, maxWidth` | Overlay modal with backdrop blur |
| `Toggle` | `value, onChange` | On/off toggle switch |
| `Stepper` | `steps, current` | Step indicator for wizards |

---

## Admin Components (`src/admin/components/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `StatusPill` | `tone, children, dot` | Colored pill (`ok`/`bad`/`warn`/`info`/`mute`/`acc`) |
| `Avatar` | `name, size` | Initials avatar with deterministic hue |
| `KPI` | `label, value, delta, accent, sparkData, icon` | Metric card with sparkline |
| `SectionHead` | `eyebrow, title, right` | Section header with optional right content |
| `Seg` | `value, onChange, options` | Segmented control (pill buttons) |
| `KPIBlock` | `label, value, sub, delta` | Simple stat block |
| `FilterChip` | `label, value, onChange, options` | Dropdown filter button |
