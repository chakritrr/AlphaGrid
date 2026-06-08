// ============================================================
// Mock Data — BinQuant Trading Bot Dashboard
// ============================================================

export const fmtUSD = (n, opts = {}) => {
  const { sign = false, decimals = 2 } = opts;
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  if (sign) return (n >= 0 ? '+$' : '−$') + formatted;
  return (n < 0 ? '−$' : '$') + formatted;
};

export const fmtPct = (n) => (n >= 0 ? '+' : '') + n.toFixed(2) + '%';

// ----- Portfolio P&L (last 30 days) -----
const seedPnL = () => {
  let val = 24800;
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const drift = Math.sin(i / 3) * 220 + (Math.random() - 0.42) * 380;
    val += drift;
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(val),
      pnl: Math.round(drift),
    });
  }
  return out;
};
export const PNL_30D = seedPnL();

// daily bar P&L (signed)
export const DAILY_PNL = PNL_30D.map(d => ({ date: d.date, pnl: d.pnl }));

// Cumulative for performance page (90 days)
const seedCumulative = (days) => {
  let val = 0;
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const drift = Math.sin(i / 4) * 90 + (Math.random() - 0.4) * 220;
    val += drift;
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cumulative: Math.round(val),
      daily: Math.round(drift),
    });
  }
  return out;
};

export const PERF_DATA = {
  '7D': seedCumulative(7),
  '30D': seedCumulative(30),
  '90D': seedCumulative(90),
  'All': seedCumulative(180),
};

// Win/Loss donut
export const WIN_LOSS = [
  { name: 'Wins', value: 287, color: '#00FF88' },
  { name: 'Losses', value: 96, color: '#FF5A6E' },
];

// ----- Bots -----
export const BOTS = [
  {
    id: 'bot-01',
    name: 'Athena Scalper',
    strategy: 'Scalping',
    exchange: 'Binance',
    pair: 'BTC/USDT',
    status: 'running',
    todayPnl: 184.42,
    totalPnl: 4820.18,
    winRate: 72,
    trades: 142,
    invested: 5000,
    risk: 'Medium',
    runtime: '14d 3h',
  },
  {
    id: 'bot-02',
    name: 'Hyperion Grid',
    strategy: 'Grid',
    exchange: 'OKX',
    pair: 'ETH/USDT',
    status: 'running',
    todayPnl: 67.05,
    totalPnl: 2104.66,
    winRate: 81,
    trades: 304,
    invested: 3500,
    risk: 'Low',
    runtime: '28d 11h',
  },
  {
    id: 'bot-03',
    name: 'Orion DCA',
    strategy: 'DCA',
    exchange: 'Bybit',
    pair: 'SOL/USDT',
    status: 'paused',
    todayPnl: 0,
    totalPnl: 612.30,
    winRate: 64,
    trades: 48,
    invested: 1500,
    risk: 'Low',
    runtime: '9d 2h',
  },
  {
    id: 'bot-04',
    name: 'Nyx Arbitrage',
    strategy: 'Arbitrage',
    exchange: 'Binance',
    pair: 'BNB/USDT',
    status: 'running',
    todayPnl: 41.88,
    totalPnl: 988.42,
    winRate: 88,
    trades: 96,
    invested: 2000,
    risk: 'High',
    runtime: '6d 14h',
  },
  {
    id: 'bot-05',
    name: 'Helios Scalper',
    strategy: 'Scalping',
    exchange: 'Bitget',
    pair: 'ARB/USDT',
    status: 'error',
    todayPnl: -22.10,
    totalPnl: 144.20,
    winRate: 51,
    trades: 71,
    invested: 1000,
    risk: 'High',
    runtime: '2d 0h',
  },
  {
    id: 'bot-06',
    name: 'Selene Grid',
    strategy: 'Grid',
    exchange: 'KuCoin',
    pair: 'AVAX/USDT',
    status: 'running',
    todayPnl: 28.54,
    totalPnl: 740.91,
    winRate: 76,
    trades: 188,
    invested: 2500,
    risk: 'Medium',
    runtime: '11d 7h',
  },
];

// performance per bot (bar chart)
export const BOT_COMPARE = BOTS.map(b => ({
  name: b.name.split(' ')[0],
  pnl: b.totalPnl,
}));

// ----- Recent trades -----
export const TRADES = [
  { id: 'TX-9821', date: '2026-05-10 14:22', bot: 'Athena Scalper', pair: 'BTC/USDT', side: 'Long', entry: 71240.50, exit: 71398.80, pnl: 158.30, duration: '12m', status: 'win' },
  { id: 'TX-9820', date: '2026-05-10 13:55', bot: 'Hyperion Grid', pair: 'ETH/USDT', side: 'Long', entry: 3812.40, exit: 3824.10, pnl: 11.70, duration: '4m', status: 'win' },
  { id: 'TX-9819', date: '2026-05-10 13:18', bot: 'Nyx Arbitrage', pair: 'BNB/USDT', side: 'Long', entry: 612.20, exit: 614.90, pnl: 2.70, duration: '2m', status: 'win' },
  { id: 'TX-9818', date: '2026-05-10 12:40', bot: 'Athena Scalper', pair: 'BTC/USDT', side: 'Short', entry: 71504.00, exit: 71460.20, pnl: 43.80, duration: '8m', status: 'win' },
  { id: 'TX-9817', date: '2026-05-10 11:55', bot: 'Helios Scalper', pair: 'ARB/USDT', side: 'Long', entry: 1.182, exit: 1.176, pnl: -22.10, duration: '6m', status: 'loss' },
  { id: 'TX-9816', date: '2026-05-10 10:32', bot: 'Selene Grid', pair: 'AVAX/USDT', side: 'Long', entry: 41.20, exit: 41.55, pnl: 28.54, duration: '18m', status: 'win' },
  { id: 'TX-9815', date: '2026-05-10 09:14', bot: 'Hyperion Grid', pair: 'ETH/USDT', side: 'Long', entry: 3798.10, exit: 3812.40, pnl: 14.30, duration: '22m', status: 'win' },
  { id: 'TX-9814', date: '2026-05-09 23:48', bot: 'Athena Scalper', pair: 'BTC/USDT', side: 'Long', entry: 70988.40, exit: 71082.10, pnl: 93.70, duration: '15m', status: 'win' },
  { id: 'TX-9813', date: '2026-05-09 22:11', bot: 'Nyx Arbitrage', pair: 'BNB/USDT', side: 'Short', entry: 615.40, exit: 612.10, pnl: 3.30, duration: '3m', status: 'win' },
  { id: 'TX-9812', date: '2026-05-09 20:34', bot: 'Hyperion Grid', pair: 'ETH/USDT', side: 'Long', entry: 3780.20, exit: 3776.10, pnl: -4.10, duration: '11m', status: 'loss' },
  { id: 'TX-9811', date: '2026-05-09 18:02', bot: 'Athena Scalper', pair: 'BTC/USDT', side: 'Long', entry: 70812.10, exit: 70934.20, pnl: 122.10, duration: '19m', status: 'win' },
  { id: 'TX-9810', date: '2026-05-09 16:49', bot: 'Selene Grid', pair: 'AVAX/USDT', side: 'Long', entry: 40.84, exit: 41.20, pnl: 22.40, duration: '24m', status: 'win' },
];

// ----- Exchanges -----
export const EXCHANGES = [
  { id: 'ex-01', name: 'Binance', balance: 12480.42, status: 'connected', lastSync: '2 min ago', accent: '#F0B90B' },
  { id: 'ex-02', name: 'OKX', balance: 6210.18, status: 'connected', lastSync: '5 min ago', accent: '#FFFFFF' },
  { id: 'ex-03', name: 'Bybit', balance: 3104.50, status: 'connected', lastSync: '1 min ago', accent: '#F7A600' },
  { id: 'ex-04', name: 'Bitget', balance: 1280.04, status: 'connected', lastSync: '12 min ago', accent: '#54B0FF' },
];

export const AVAILABLE_EXCHANGES = [
  { name: 'Binance', accent: '#F0B90B' },
  { name: 'OKX', accent: '#FFFFFF' },
  { name: 'Bybit', accent: '#F7A600' },
  { name: 'Bitget', accent: '#54B0FF' },
  { name: 'KuCoin', accent: '#24AE8F' },
  { name: 'Kraken', accent: '#7B5CFA' },
];

// ----- Subscription -----
export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    bots: 2,
    tagline: 'For testing the waters',
    features: ['2 active bots', 'Basic strategies', '1 exchange', 'Email support', '24h trade history'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    bots: 10,
    tagline: 'For serious traders',
    popular: true,
    features: ['10 active bots', 'All strategies', '3 exchanges', 'Priority support', 'Unlimited history', 'Advanced backtesting'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 199,
    bots: 'Unlimited',
    tagline: 'For trading desks',
    features: ['Unlimited bots', 'All strategies', 'All exchanges', 'Dedicated manager', 'Unlimited history', 'API access', 'Custom indicators'],
  },
];

export const PAYMENTS = [
  { id: 'INV-2026-005', date: '2026-05-01', plan: 'Pro', amount: 79.00, status: 'paid' },
  { id: 'INV-2026-004', date: '2026-04-01', plan: 'Pro', amount: 79.00, status: 'paid' },
  { id: 'INV-2026-003', date: '2026-03-01', plan: 'Pro', amount: 79.00, status: 'paid' },
  { id: 'INV-2026-002', date: '2026-02-01', plan: 'Starter', amount: 29.00, status: 'paid' },
  { id: 'INV-2026-001', date: '2026-01-01', plan: 'Starter', amount: 29.00, status: 'paid' },
];

// ----- Strategies -----
export const STRATEGIES = [
  {
    id: 'scalping', name: 'Scalping', risk: 'High', tagline: 'Fast micro-profits on volatility',
    desc: 'Captures small price moves on high-frequency setups. Best for liquid pairs in trending markets.',
    expected: '0.3 – 1.2% / day',
  },
  {
    id: 'grid', name: 'Grid Trading', risk: 'Low', tagline: 'Profits from sideways action',
    desc: 'Places staggered buy/sell orders within a range. Steady performance in choppy markets.',
    expected: '0.1 – 0.4% / day',
  },
  {
    id: 'dca', name: 'DCA', risk: 'Low', tagline: 'Average down on dips',
    desc: 'Dollar-cost-averaging into positions during pullbacks. Long-term accumulation strategy.',
    expected: '5 – 18% / mo',
  },
  {
    id: 'arb', name: 'Arbitrage', risk: 'Medium', tagline: 'Cross-venue price gaps',
    desc: 'Exploits price differences across exchanges. Low directional risk with capital efficiency.',
    expected: '0.2 – 0.8% / day',
  },
];

export const TRADING_PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'AVAX/USDT', 'ARB/USDT', 'LINK/USDT', 'MATIC/USDT'];

// ----- Sidebar nav -----
export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'bots', label: 'My Bots', icon: 'Bot' },
  { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
  { id: 'exchanges', label: 'Exchange Connect', icon: 'Plug' },
  { id: 'subscription', label: 'Subscription', icon: 'Crown' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'help', label: 'Help & Support', icon: 'LifeBuoy' },
];

// Stat cards on dashboard
export const computeStats = () => {
  const total = PNL_30D[PNL_30D.length - 1].value;
  const start = PNL_30D[0].value;
  const change = ((total - start) / start) * 100;
  const today = PNL_30D[PNL_30D.length - 1].pnl;
  const activeBots = BOTS.filter(b => b.status === 'running').length;
  const monthTrades = BOTS.reduce((s, b) => s + b.trades, 0);
  return { total, change, today, activeBots, monthTrades };
};
