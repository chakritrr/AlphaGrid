# Design System

> BinQuant uses a dark fintech theme with glassmorphism cards, neon accents, and Geist typography.

---

## Theme Variables

All tokens are defined in `src/index.css` under `@theme` and custom CSS variables.

### Core Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0A0B0F` | Page background |
| `--color-bg-2` | `#0E1016` | Secondary background (sidebar) |
| `--color-card` | `#12141A` | Card background |
| `--color-card-2` | `#161922` | Secondary card background |
| `--color-line` | `rgba(255,255,255,0.06)` | Subtle borders |
| `--color-line-2` | `rgba(255,255,255,0.10)` | Strong borders |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text` | `#E7EAF2` | Primary text |
| `--color-muted` | `#8A90A2` | Secondary/muted text |
| `--color-dim` | `#5A6072` | Tertiary/disabled text |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#00D4FF` | Primary accent (blue) — links, active states |
| `--color-green` | `#00FF88` | Positive P&L, success |
| `--color-purple` | `#8B5CF6` | Secondary accent |
| `--color-red` | `#FF5A6E` | Negative P&L, errors |
| `--color-yellow` | `#FFC857` | Warnings, paused state |

### Admin Theme (overrides in `.admin-panel`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#07090d` | Admin background |
| `--acc` | `#b6ff3c` | Admin accent (lime) |
| `--acc-2` | `#6ee7ff` | Admin secondary (cyan) |
| `--pos` | `#34d399` | Admin positive |
| `--neg` | `#fb5d6f` | Admin negative |

---

## Typography

| Style | Font | Usage |
|-------|------|-------|
| UI Text | `Geist` (sans-serif) | All body text, labels, buttons |
| Numeric | `Geist Mono` (monospace) | Prices, P&L, percentages, table data |
| Admin UI | `Inter` + `JetBrains Mono` + `Space Grotesk` | Admin panel uses different font stack |

Fonts loaded from Google Fonts via `<link>` in `index.html`.

Utility classes:
- `.mono` — `font-family: var(--font-mono); font-feature-settings: "tnum", "zero"`
- `.num` — Same as mono with tighter letter-spacing

---

## UI Patterns

### Glass Cards

```html
<div className="glass">        <!-- Primary card → linear-gradient + border + blur -->
<div className="glass-2">      <!-- Secondary card → slightly different gradient -->
<div className="glass lift">   <!-- With hover lift effect (translateY -2px) -->
```

### Buttons

| Class | Style | Usage |
|-------|-------|-------|
| `.btn` | Dark outline with hover glow | Default action |
| `.btn-primary` | Blue gradient with shadow | Primary CTA |
| `.btn-ghost` | Transparent | Icons, mobile menu |
| `.btn-danger` | Red tint + border | Destructive actions |

### Badges

| Class | Style | Usage |
|-------|-------|-------|
| `.badge-running` | Green | Active/Running status |
| `.badge-paused` | Yellow | Paused status |
| `.badge-error` | Red | Error status |
| `.badge-blue` | Blue | Strategy tags |
| `.badge-purple` | Purple | Secondary tags |
| `.badge-soft` | Subtle gray | Muted labels |

### Animations

| Class | Description |
|-------|-------------|
| `.pulse-dot` | Pulsing opacity/scale (1.6s loop) |
| `.shimmer` | Horizontal shimmer gradient (2.4s loop) |
| `.page-enter` | Fade-in + translateY on page mount (280ms) |
| `.lift` | Hover: `translateY(-2px)` + border lighter |

### Glows

| Class | Usage |
|-------|-------|
| `.glow-blue` | Blue neon box-shadow |
| `.glow-green` | Green neon box-shadow |
| `.glow-purple` | Purple neon box-shadow |

---

## Spacing & Layout

- **Page max-width:** `1480px` (dashboard), `1200px` (landing)
- **Sidebar width:** `248px` (user), `232px` (admin)
- **Card padding:** `20px` (standard), `24px` (generous)
- **Border radius:** `16px` (cards), `10px` (buttons/inputs), `999px` (badges)
- **Gap grid:** `16px` / `20px` / `24px` depending on context

---

## Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile | `< 768px` | Single column, hamburger nav |
| Tablet | `768px – 1023px` | 2-column grids, sidebar hidden |
| Desktop | `>= 1024px` | Sidebar visible, multi-column layouts |
| Wide | `>= 1280px` | Max content width |
