// ============================================================
// Admin Mock Data — BinQuant Admin Panel
// ============================================================

const fmtUSD = (n, d = 0) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtNum = (n) => (n || 0).toLocaleString('en-US');
const fmtPct = (n, d = 1) => (n >= 0 ? '+' : '') + n.toFixed(d) + '%';

// 30-day signup + revenue series
const signups30 = (() => {
  const out = [];
  let base = 42;
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    base += Math.sin(i / 3) * 8 + Math.random() * 14 - 4;
    base = Math.max(20, base);
    const newUsers = Math.round(base);
    const churn = Math.round(newUsers * (0.08 + Math.random() * 0.08));
    out.push({
      day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      iso: d.toISOString().slice(0, 10),
      signups: newUsers,
      churn,
      revenue: Math.round(newUsers * 38 + Math.random() * 400 + 800),
    });
  }
  return out;
})();

const revenueSplit = [
  { name: 'Subscriptions', value: 184320 },
  { name: 'Performance fee', value: 92840 },
  { name: 'Marketplace', value: 31120 },
  { name: 'API access', value: 14210 },
];

const planMix = [
  { name: 'Starter', value: 1842, price: 29, color: '#6ee7ff' },
  { name: 'Pro', value: 1136, price: 79, color: '#b6ff3c' },
  { name: 'Quant', value: 412, price: 249, color: '#c084fc' },
  { name: 'Institutional', value: 38, price: 1490, color: '#f5b754' },
];

const exchanges = ['Binance', 'Bybit', 'OKX', 'Coinbase', 'Kraken', 'KuCoin', 'Bitget', 'dYdX'];
const strategies = ['Grid · BTC', 'DCA · ETH', 'Arb · USDT', 'Scalper · SOL', 'Momentum · TIA', 'Market-mkr · ARB', 'Mean-rev · DOGE', 'Funding · HYPE'];
const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'TIA/USDT', 'ARB/USDT', 'HYPE/USDC', 'DOGE/USDT', 'BNB/USDT'];

const firstNames = ['Maya', 'Idris', 'Vera', 'Kenji', 'Sasha', 'Lior', 'Ana', 'Theo', 'Priya', 'Mateo', 'Yuki', 'Noor', 'Eli', 'Hana', 'Omar', 'Iris', 'Ruben', 'Naomi', 'Dario', 'Linnea', 'Asher', 'Mira', 'Jules', 'Kai'];
const lastNames = ['Okafor', 'Patel', 'Nguyen', 'Ferraro', 'Bauer', 'Reyes', 'Lindqvist', 'Haddad', 'Sato', 'Romero', 'Kowal', 'Yamada', 'Volkov', 'Brennan', 'Khoury', 'Singh', 'Costa', 'Larsen', 'Mitra', 'Aoki'];

const seed = (n) => { let s = n; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
const rng = seed(31337);
const planNames = ['Starter', 'Pro', 'Quant', 'Institutional'];
const statusOpts = ['Active', 'Active', 'Active', 'Active', 'Trial', 'Past due', 'Suspended'];

const users = Array.from({ length: 42 }).map((_, i) => {
  const fn = firstNames[(i * 7) % firstNames.length];
  const ln = lastNames[(i * 11) % lastNames.length];
  const plan = planNames[Math.floor(rng() * planNames.length * 0.95)];
  const bots = plan === 'Starter' ? Math.floor(rng() * 3) + 1 : plan === 'Pro' ? Math.floor(rng() * 5) + 2 : plan === 'Quant' ? Math.floor(rng() * 9) + 3 : Math.floor(rng() * 20) + 10;
  const rev = Math.round(({ Starter: 29, Pro: 79, Quant: 249, Institutional: 1490 })[plan] * (1 + rng() * 1.6));
  const status = statusOpts[Math.floor(rng() * statusOpts.length)];
  const joined = new Date(Date.now() - Math.floor(rng() * 620) * 86400000);
  return {
    id: 'U-' + (10240 + i),
    name: `${fn} ${ln}`,
    handle: (fn[0] + ln).toLowerCase() + (20 + Math.floor(rng() * 80)),
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${['proton.me', 'gmail.com', 'outlook.com', 'hey.com'][i % 4]}`,
    plan, bots, rev, status,
    pnl30: Math.round((rng() - 0.35) * 18000) / 100,
    joined,
    country: ['US', 'DE', 'SG', 'BR', 'UK', 'JP', 'CA', 'AE', 'NL', 'PT'][i % 10],
  };
});

const botStatusOpts = ['running', 'running', 'running', 'running', 'running', 'idle', 'warning', 'error', 'paused'];

const bots = Array.from({ length: 36 }).map((_, i) => {
  const owner = users[i % users.length];
  const ex = exchanges[i % exchanges.length];
  const strat = strategies[i % strategies.length];
  const pair = pairs[i % pairs.length];
  const status = botStatusOpts[Math.floor(rng() * botStatusOpts.length)];
  const pnl = Math.round((rng() - 0.35) * 5400) / 100;
  const trades = 40 + Math.floor(rng() * 820);
  const wr = Math.round(40 + rng() * 40);
  const lev = [1, 2, 3, 5, 10][Math.floor(rng() * 5)];
  const spark = [];
  let v = 100;
  for (let s = 0; s < 24; s++) {
    v += (rng() - 0.5 + (pnl > 0 ? 0.06 : -0.04)) * 2;
    spark.push({ x: s, y: +v.toFixed(2) });
  }
  return {
    id: 'BOT-' + (70210 + i).toString(36).toUpperCase(),
    user: owner.name,
    userId: owner.id,
    plan: owner.plan,
    exchange: ex,
    strategy: strat,
    pair,
    status,
    pnlToday: pnl,
    trades,
    winRate: wr,
    leverage: lev,
    uptimeH: Math.floor(rng() * 880),
    spark,
    aum: Math.round(2000 + rng() * 94000),
  };
});

const renewals = users
  .filter((u) => u.status === 'Active' || u.status === 'Trial')
  .slice(0, 8)
  .map((u, i) => ({
    user: u.name,
    plan: u.plan,
    amount: ({ Starter: 29, Pro: 79, Quant: 249, Institutional: 1490 })[u.plan],
    days: i - 1,
    method: ['Visa ••4242', 'Mastercard ••8810', 'USDC · 0x9f…2c', 'Apple Pay', 'ACH'][i % 5],
  }));

const mrrSeries = (() => {
  const arr = [];
  let m = 168000;
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    m += 6000 + Math.random() * 9000 - (i === 4 ? 12000 : 0);
    arr.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      mrr: Math.round(m),
      nrr: 102 + Math.round(Math.random() * 16),
    });
  }
  return arr;
})();

const alerts = [
  { id: 'A-9421', sev: 'critical', kind: 'Bot error', title: 'Binance API: signature invalid', detail: 'BOT-1KQR · user @ifekoya — 7 consecutive failed orders', time: '2 min ago', ack: false },
  { id: 'A-9420', sev: 'critical', kind: 'Failed payment', title: 'Card declined — auto-retry exhausted', detail: 'Vera Reyes · Quant · $249.00 · Visa ••4242', time: '14 min ago', ack: false },
  { id: 'A-9419', sev: 'warning', kind: 'Suspicious', title: 'New device + new IP within 90s', detail: 'Mateo Bauer · Lagos → Frankfurt · session forced re-auth', time: '38 min ago', ack: false },
  { id: 'A-9418', sev: 'warning', kind: 'Bot error', title: 'OKX rate-limit (10003) sustained 5m', detail: '7 bots throttled — auto-cooldown engaged', time: '1 hr ago', ack: false },
  { id: 'A-9417', sev: 'info', kind: 'Suspicious', title: 'Withdrawal pattern flagged', detail: 'Noor Haddad · 4 outbound USDC > $5k inside 1h', time: '2 hr ago', ack: true },
  { id: 'A-9416', sev: 'critical', kind: 'Bot error', title: 'Kraken WS dropped — reconnect loop', detail: 'BOT-8FZA · failover to REST polling at 60s', time: '3 hr ago', ack: true },
  { id: 'A-9415', sev: 'warning', kind: 'Failed payment', title: 'USDC under-paid by 0.42', detail: 'Asher Costa · Pro · invoice INV-22841', time: '5 hr ago', ack: true },
  { id: 'A-9414', sev: 'info', kind: 'Bot error', title: 'Strategy "Grid · BTC" desync 0.3%', detail: 'Self-healed at 14:02 UTC · BOT-2A0X', time: '7 hr ago', ack: true },
  { id: 'A-9413', sev: 'warning', kind: 'Suspicious', title: 'Coupon abuse — 9 trials, same fingerprint', detail: 'Browser hash 7e2…aa1 · auto-blocked', time: '9 hr ago', ack: true },
];

export { fmtUSD, fmtNum, fmtPct };
export { signups30, revenueSplit, planMix, users, bots, renewals, mrrSeries, alerts };
