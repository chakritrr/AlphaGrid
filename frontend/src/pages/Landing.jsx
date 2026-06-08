import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Menu, X, Check, ChevronDown, ChevronRight, TrendingUp, Bot, Zap, Shield, Users, Activity } from 'lucide-react';

// ────────────────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: 'Starter', price: 29, tagline: 'For testing the waters',
    features: ['1 bot', '1 exchange', 'Basic strategies', 'Paper trading', 'Community support'],
  },
  {
    name: 'Pro', price: 79, popular: true, tagline: 'For serious traders',
    features: ['10 bots', 'All exchanges', 'All strategies', 'Backtesting', 'Email support', 'Live trading'],
  },
  {
    name: 'Elite', price: 199, tagline: 'For trading desks',
    features: ['Unlimited bots', 'All exchanges', 'Custom strategies', 'API access', 'Dedicated manager', 'P&L exports'],
  },
];

const STRATEGIES_DATA = [
  { name: 'Grid Trading', tag: 'sideways', perf: '+18% / 90d', desc: 'Buys low / sells high inside a range. Best in chop.' },
  { name: 'DCA Bot', tag: 'long-bias', perf: '+24% / 90d', desc: 'Averages your entry on every dip. Long-only.' },
  { name: 'Scalping', tag: 'high-freq', perf: '+11% / 90d', desc: 'Hundreds of micro trades, sub-second hold time.' },
  { name: 'Arbitrage', tag: 'neutral', perf: '+9% / 90d', desc: 'Cross-exchange spread hunter. Market-neutral.' },
  { name: 'Trend Follow', tag: 'directional', perf: '+31% / 90d', desc: 'Rides momentum on 4h candles.' },
  { name: 'Mean Reversion', tag: 'contrarian', perf: '+14% / 90d', desc: 'Fades overextended moves to a fair-value band.' },
];

const EXCHANGES = ['Binance', 'OKX', 'Bybit', 'Coinbase', 'Kraken', 'KuCoin', 'Bitget', 'Gate.io'];

const TESTIMONIALS = [
  { quote: '"Set a grid bot on ETH/USDT, walked away. Came back 3 weeks later up 12%."', author: 'M. — DeFi degen, since Jan' },
  { quote: '"The backtester saved me from a strategy I was 100% sure was a winner."', author: 'L. — ex-prop trader' },
  { quote: '"Plug-and-play infra. The kill-switch alone is worth the subscription."', author: 'A. — quant hobbyist' },
];

const FAQS = [
  { q: 'Do you ever hold my funds?', a: 'Never. Your API keys are read-only by default. We never hold crypto or fiat. Withdrawal permissions are always disabled.' },
  { q: 'What happens if the bot loses money?', a: 'Every bot has a configurable stop-loss and daily loss limit. You can pause or kill any bot from the dashboard instantly.' },
  { q: 'Can I write my own strategy?', a: 'Yes — our Elite plan includes a custom strategy builder and API access for writing your own trading logic.' },
  { q: 'Which exchanges are supported?', a: 'Binance, OKX, Bybit, Coinbase, Kraken, KuCoin, Bitget, Gate.io and 12+ more.' },
  { q: 'Is there a free trial?', a: 'Yes — all plans come with a 14-day free trial. No credit card required for Starter.' },
];

const TICKER_ITEMS = [
  ['BTC', '67,412', '+2.4%'], ['ETH', '3,512', '+1.8%'], ['SOL', '184.20', '+4.1%'],
  ['BNB', '612.40', '-0.6%'], ['XRP', '0.5821', '+0.9%'], ['DOGE', '0.1432', '+5.2%'],
  ['AVAX', '36.74', '-1.1%'], ['LINK', '17.93', '+2.0%'], ['ADA', '0.4621', '+0.4%'],
];

const PERF_CHART_DATA = Array.from({ length: 90 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (89 - i));
  let val = Math.sin(i / 12) * 8 + Math.cos(i / 7) * 4 + i * 0.5 + Math.random() * 3 - 1.5;
  val = Math.max(0, val);
  return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.round(val * 100 + 10000) / 100 };
});

// ────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────
function Ticker() {
  return (
    <div className="relative overflow-hidden whitespace-nowrap py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
      <div className="inline-flex" style={{ animation: 'tick 60s linear infinite' }}>
        {[0, 1, 2].map((pass) => (
          <div key={pass} className="inline-flex gap-8 px-4">
            {TICKER_ITEMS.map(([sym, px, ch], i) => {
              const down = ch.startsWith('-');
              return (
                <span key={i} className="inline-flex gap-2 items-baseline mono text-[12.5px]">
                  <span className="font-semibold text-white">{sym}</span>
                  <span className="text-muted">${px}</span>
                  <span className={down ? 'text-red' : 'text-green'}>{ch}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ id, label, children, className = '' }) {
  return (
    <section id={id} className={'py-16 md:py-20 px-5 md:px-10 border-t border-[rgba(255,255,255,0.05)] ' + className}>
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}

function StatCard({ label, value, sub, className = '' }) {
  return (
    <div className={'glass p-5 text-center ' + className}>
      <div className="text-dim text-[11px] uppercase tracking-[0.1em] font-medium">{label}</div>
      <div className="num text-[32px] font-semibold leading-none mt-2 text-white">{value}</div>
      <div className="text-muted text-[12px] mt-1">{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Landing Page
// ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10,11,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="logo-mark" />
            <span className="text-[16px] font-semibold tracking-tight text-white">BinQuant</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'Pricing', 'Strategies', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] text-muted hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app" className="btn !py-1.5 !px-3 text-[12px]">
              Sign in
            </Link>
            <Link to="/app?mode=register" className="btn btn-primary !py-1.5 !px-3 text-[12px]">
              Start free
            </Link>
            <button className="md:hidden btn-ghost btn !p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-5 pb-4 pt-2 flex flex-col gap-2">
            {['Features', 'Pricing', 'Strategies', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[13px] text-muted hover:text-white py-1">
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ─── TICKER ─── */}
      <Ticker />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20 px-5">
        <div className="aurora" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-blue text-[11px] px-3 py-1">v0.4 · public beta</span>
              <h1 className="text-[44px] md:text-[64px] font-semibold leading-[0.95] tracking-tight text-white mt-6">
                Trading bots,<br />
                <span className="text-accent">rented by the hour.</span>
              </h1>
              <p className="text-muted text-[15px] mt-4 max-w-[480px] leading-relaxed">
                Hosted strategies that compound while you sleep. Connect your exchange, pick a strategy,
                and let the bots do the work. Pause anytime.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/app?mode=register" className="btn btn-primary !py-3 !px-6 text-[14px]">
                  <Zap size={16} color="#001016" /> Start free trial
                </Link>
                <a href="#pricing" className="btn !py-3 !px-6 text-[14px]">
                  View plans <ChevronRight size={14} />
                </a>
              </div>
              <p className="text-dim text-[12px] mt-3">no credit card · 14 days · cancel anytime</p>
            </div>
            {/* Hero visual */}
            <div className="glass p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-dim text-[11px] uppercase tracking-[0.1em] font-medium">Live profit · all users</span>
                <span className="badge badge-running text-[11px]">● live</span>
              </div>
              <div className="num text-[48px] font-semibold text-green leading-none">$1,284,907</div>
              <span className="text-muted text-[12px] mt-1 block">↑ ticking up · resets at 00:00 UTC</span>
              <div className="mt-4 h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERF_CHART_DATA.slice(-30)} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" vertical={false} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, fontSize: 12 }}
                      formatter={(v) => ['$' + v.toLocaleString(), 'Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} fill="url(#heroGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE STATS ─── */}
      <Section id="features" label="Live stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Traders on the platform" value="48,210" sub="↑ 312 this week" />
          <StatCard label="Profit generated, lifetime" value="$84.2M" sub="all bots, all time" />
          <StatCard label="Uptime · 90d" value="99.98%" sub="status.binquant.io" />
          <StatCard label="Active bots right now" value="12,884" sub="running across 14 venues" />
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section id="how" label="How it works">
        <div className="text-center mb-12">
          <h2 className="text-[34px] md:text-[42px] font-semibold tracking-tight text-white">
            Three steps. <span className="text-accent">Twelve minutes.</span> Zero babysitting.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Connect exchange', desc: 'Add your exchange API key with read-only or trade permissions. We never touch your withdrawals.' },
            { num: '02', title: 'Pick a strategy', desc: 'Grid, DCA, scalp, arbitrage. Backtest before you commit a single dollar.' },
            { num: '03', title: 'Let it run', desc: 'Live P&L tracking, kill switch, and weekly digest. Pause or stop anytime.' },
          ].map((step, i) => (
            <div key={i} className="glass p-6 text-center lift">
              <div className="text-[56px] font-semibold text-accent/30 mono leading-none">{step.num}</div>
              <h3 className="text-[18px] font-semibold text-white mt-3">{step.title}</h3>
              <p className="text-muted text-[13px] mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── STRATEGIES ─── */}
      <Section id="strategies" label="Strategies">
        <div className="text-center mb-10">
          <h2 className="text-[34px] md:text-[42px] font-semibold tracking-tight text-white">
            Twelve strategies. <span className="text-accent">One subscription.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {STRATEGIES_DATA.map((s, i) => (
            <div key={i} className="glass p-5 lift">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-[15px] font-semibold text-white">{s.name}</h3>
                <span className="badge badge-soft text-[10px]">{s.tag}</span>
              </div>
              <p className="text-muted text-[12.5px] leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <span className="text-green text-[14px] font-semibold mono">{s.perf}</span>
                <span className="text-accent text-[12px] cursor-pointer hover:underline">view →</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── PERFORMANCE CHART ─── */}
      <Section id="perf" label="Performance">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[34px] md:text-[42px] font-semibold tracking-tight text-white leading-tight">
              Backtested. Forward-tested. <span className="text-accent">Receipts.</span>
            </h2>
            <p className="text-muted text-[14px] mt-4 leading-relaxed">
              90-day equity curve for our flagship Grid strategy on ETH/USDT.
              All performance data is verified and published weekly.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="glass-2 p-4 text-center">
                <div className="text-dim text-[10px] uppercase tracking-wider">Best 90d</div>
                <div className="num text-[22px] font-semibold text-green mt-1">+37.8%</div>
              </div>
              <div className="glass-2 p-4 text-center">
                <div className="text-dim text-[10px] uppercase tracking-wider">Worst DD</div>
                <div className="num text-[22px] font-semibold text-red mt-1">−6.2%</div>
              </div>
            </div>
          </div>
          <div className="glass p-5">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERF_CHART_DATA}>
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF88" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="date" interval={14} tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => '$' + v.toFixed(0)} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                    formatter={(v) => ['$' + v.toLocaleString(), 'Equity']}
                    cursor={{ stroke: '#00FF88', strokeDasharray: '3 3', strokeOpacity: 0.3 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00FF88" strokeWidth={2} fill="url(#perfGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── EXCHANGES ─── */}
      <Section id="exchanges" label="Exchanges">
        <div className="text-center mb-8">
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-white">
            Connect <span className="text-accent">any</span> of these.
          </h2>
          <p className="text-muted text-[13px] mt-2">read-only or trade keys</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {EXCHANGES.map((ex, i) => (
            <div key={i} className="glass-2 px-5 py-3 flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold mono text-[12px]"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#00D4FF',
                }}
              >
                {ex[0]}
              </div>
              <span className="text-[13px] text-muted font-medium">{ex}</span>
            </div>
          ))}
          <div className="glass-2 px-5 py-3 flex items-center">
            <span className="text-muted text-[13px] mono">+ 12 more</span>
          </div>
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing" label="Pricing">
        <div className="text-center mb-10">
          <h2 className="text-[34px] md:text-[42px] font-semibold tracking-tight text-white">
            Pick a tier. <span className="text-accent">Switch anytime.</span>
          </h2>
          <p className="text-muted text-[13px] mt-2">billed monthly · USD · cancel in app</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
          {PRICING_TIERS.map((tier, i) => (
            <div
              key={i}
              className="glass p-6 relative lift"
              style={tier.popular ? { borderColor: 'rgba(0,212,255,0.40)', boxShadow: '0 0 0 1px rgba(0,212,255,0.20), 0 20px 60px -20px rgba(0,212,255,0.30)' } : {}}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase"
                     style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)', color: '#001016' }}>
                  ⭐ Most Popular
                </div>
              )}
              <div className="text-[12px] uppercase tracking-wider text-dim mb-2">{tier.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="num text-[38px] font-semibold leading-none text-white">${tier.price}</span>
                <span className="text-dim text-[13px]">/mo</span>
              </div>
              <p className="text-muted text-[12.5px] mb-5">{tier.tagline}</p>
              <div className="flex flex-col gap-2.5 mb-6">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-[12.5px]">
                    <Check size={12} color="#00FF88" />
                    <span className="text-muted">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to={tier.popular ? "/app?mode=register" : "/app"}
                className={`btn w-full justify-center ${tier.popular ? 'btn-primary' : ''}`}
              >
                {tier.popular ? 'Start 14-day trial' : 'Choose ' + tier.name}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── TESTIMONIALS ─── */}
      <Section id="testimonials" label="Testimonials">
        <div className="text-center mb-10">
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-white">
            What traders <span className="text-accent">say.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass p-6">
              <p className="text-[14px] text-white leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[11px]"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)', color: '#00121A' }}
                >
                  {t.author[0]}
                </div>
                <span className="text-dim text-[12px]">{t.author}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section id="faq" label="FAQ">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-white text-center mb-8">
            Questions, <span className="text-purple">answered.</span>
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-2 overflow-hidden" style={{ borderColor: openFaq === i ? 'rgba(0,212,255,0.2)' : undefined }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-[14px] font-medium text-white"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 text-dim"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-[13px] text-muted leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <Section label="CTA" className="!pb-24">
        <div className="glass p-10 md:p-16 text-center relative overflow-hidden">
          <div className="aurora" />
          <div className="relative z-10">
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-white leading-tight">
              Start the bot.<br />
              <span className="text-accent">Sleep through the dip.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/app?mode=register" className="btn btn-primary !py-3 !px-8 text-[14px]">
                <Zap size={16} color="#001016" /> Start free trial
              </Link>
              <Link to="/app" className="btn !py-3 !px-8 text-[14px]">
                <Shield size={16} /> Talk to a quant
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[rgba(255,255,255,0.05)] px-5 py-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="logo-mark" />
                <span className="text-[15px] font-semibold text-white">BinQuant</span>
              </div>
              <p className="text-dim text-[12px] leading-relaxed max-w-[260px]">
                Hosted trading bots for retail traders. Not financial advice. Past performance ≠ future results.
              </p>
            </div>
            {[
              { title: 'Product', items: ['Strategies', 'Pricing', 'Backtester', 'API', 'Status'] },
              { title: 'Company', items: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Legal', items: ['Terms', 'Privacy', 'Risk disclosure', 'Security'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-3">{col.title}</h4>
                <div className="flex flex-col gap-2">
                  {col.items.map((item, j) => (
                    <span key={j} className="text-dim text-[12.5px] hover:text-muted cursor-pointer transition-colors">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(255,255,255,0.05)] mt-8 pt-6 flex flex-wrap justify-between items-center gap-4">
            <span className="text-dim text-[11px] mono">© 2026 BinQuant Labs · made in a basement</span>
            <span className="text-dim text-[11px] mono">EN · USD · v0.4-beta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
