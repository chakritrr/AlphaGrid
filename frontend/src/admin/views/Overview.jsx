import { useState } from 'react';
import { Wallet, Users, Bot, Sparkles } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ComposedChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPI, SectionHead, Seg } from '../components/ui';
import { StatusPill } from '../components/ui';
import { fmtUSD, fmtNum, signups30, revenueSplit, alerts, bots } from '../data';

export default function OverviewView({ push }) {
  const [range, setRange] = useState('30d');
  const totalToday = 8642;
  const totalMonth = 184320;
  const totalYear = 2186540;
  const activeSubs = 3428;
  const activeBots = 5142;

  const sparkRev = signups30.slice(-14).map((d, i) => ({ y: d.revenue / 100, x: i }));
  const sparkSub = signups30.slice(-14).map((d, i) => ({ y: d.signups, x: i }));
  const sparkBot = signups30.slice(-14).map((d, i) => ({ y: 80 + Math.sin(i / 2) * 9 + i * 1.4, x: i }));

  return (
    <div className="space-y-6">
      {/* eyebrow + actions */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>
            Control room · live
          </div>
          <h1 className="display text-[28px] font-semibold mt-1">Good afternoon, Sasha</h1>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>
            <span className="mono">5,142</span> bots executing across <span className="mono">14</span> venues · last tick{' '}
            <span className="mono">2s</span> ago
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Seg value={range} onChange={setRange} options={['24h', '7d', '30d', 'MTD', 'YTD']} />
          <button className="chip rounded-md px-2.5 py-1.5 text-[12px] mono flex items-center gap-1.5 hover:bg-white/[0.04]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/></svg>{' '}
            Sync
          </button>
          <button className="chip rounded-md px-2.5 py-1.5 text-[12px] mono flex items-center gap-1.5 hover:bg-white/[0.04]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11"/><path d="m7 9 5-5 5 5"/><path d="M5 19h14"/></svg>{' '}
            Export
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <KPI icon={Wallet} label="Revenue · today" value={fmtUSD(totalToday)} sub="vs $7,910 yest." delta={9.3} deltaTone="ok" accent="#b6ff3c" sparkData={sparkRev} />
        </div>
        <div className="col-span-12 md:col-span-3">
          <KPI icon={Wallet} label="Revenue · MTD" value={fmtUSD(totalMonth)} sub="goal $220k · 84%" delta={12.6} deltaTone="ok" accent="#6ee7ff" sparkData={sparkRev} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <KPI icon={Users} label="Active subs" value={fmtNum(activeSubs)} sub="+184 this wk" delta={5.8} deltaTone="ok" accent="#c084fc" sparkData={sparkSub} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <KPI icon={Bot} label="Bots running" value={fmtNum(activeBots)} sub="of 5,402 deployed" delta={2.1} deltaTone="ok" accent="#f5b754" sparkData={sparkBot} />
        </div>
        <div className="col-span-12 md:col-span-2">
          <KPI icon={Sparkles} label="Revenue · YTD" value={fmtUSD(totalYear)} sub="run-rate $2.6M" delta={31.2} deltaTone="ok" accent="#34d399" />
        </div>
      </div>

      {/* row: signups chart + revenue split */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 panel rounded-xl p-5">
          <SectionHead
            eyebrow="Acquisition"
            title="New signups · last 30 days"
            right={
              <div className="flex items-center gap-3 text-[11px] mono" style={{ color: 'var(--ink-3)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: '#b6ff3c' }} /> signups
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: '#fb5d6f', opacity: 0.7 }} /> churn
                </span>
                <Seg value="Daily" onChange={() => {}} options={['Daily', 'Weekly']} />
              </div>
            }
          />
          <div className="h-[260px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={signups30} margin={{ top: 6, right: 14, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="signFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#b6ff3c" stopOpacity=".4" />
                    <stop offset="100%" stopColor="#b6ff3c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" interval={3} tickLine={false} axisLine={false} dy={6} tick={{ fill: '#5A6072', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fill: '#5A6072', fontSize: 11 }} />
                <Tooltip
                  cursor={{ stroke: '#b6ff3c', strokeOpacity: 0.3, strokeDasharray: '2 4' }}
                  contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#9aa3b2', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}
                  itemStyle={{ color: '#e7ecf3' }}
                />
                <Bar dataKey="churn" fill="#fb5d6f" fillOpacity={0.55} barSize={6} radius={[2, 2, 0, 0]} />
                <Area type="monotone" dataKey="signups" stroke="#b6ff3c" strokeWidth={2} fill="url(#signFill)" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-4 text-[12px]">
            {[
              { k: 'Net new', v: '+1,284', s: '30d' },
              { k: 'Conversion', v: '18.4%', s: 'trial→paid' },
              {
                k: 'Best day',
                v: signups30.reduce((a, b) => (b.signups > a.signups ? b : a)).day,
                s: '+' + signups30.reduce((a, b) => (b.signups > a.signups ? b : a)).signups + ' signups',
              },
              { k: 'CAC', v: '$24.10', s: '-9.2% vs last m.' },
            ].map((x) => (
              <div key={x.k} className="panel-2 rounded-md p-3">
                <div className="text-[10px] uppercase tracking-[.16em]" style={{ color: 'var(--ink-3)' }}>
                  {x.k}
                </div>
                <div className="display text-[18px] mt-1 tabular-nums">{x.v}</div>
                <div className="mono text-[11px]" style={{ color: 'var(--ink-3)' }}>
                  {x.s}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* revenue split donut */}
        <div className="col-span-12 lg:col-span-4 panel rounded-xl p-5">
          <SectionHead eyebrow="Revenue mix" title="Sources · MTD" />
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueSplit} dataKey="value" innerRadius={60} outerRadius={86} paddingAngle={2} stroke="none">
                  {revenueSplit.map((e, i) => (
                    <Cell key={i} fill={['#b6ff3c', '#6ee7ff', '#c084fc', '#f5b754'][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8, fontSize: 12 }} formatter={(v) => fmtUSD(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10px] uppercase tracking-[.18em]" style={{ color: 'var(--ink-3)' }}>
                Total MTD
              </div>
              <div className="display text-[22px] font-semibold tabular-nums mt-0.5">
                {fmtUSD(revenueSplit.reduce((a, b) => a + b.value, 0))}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {revenueSplit.map((s, i) => {
              const t = revenueSplit.reduce((a, b) => a + b.value, 0);
              const pct = ((s.value / t) * 100).toFixed(1);
              return (
                <div key={s.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm" style={{ background: ['#b6ff3c', '#6ee7ff', '#c084fc', '#f5b754'][i] }} />
                    {s.name}
                  </span>
                  <span className="mono tabular-nums" style={{ color: 'var(--ink-2)' }}>
                    {fmtUSD(s.value)} · <span className="text-white">{pct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* row: alerts preview + top bots */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 panel rounded-xl p-5">
          <SectionHead
            eyebrow="Health"
            title="Alert center"
            right={
              <button onClick={() => push('alerts')} className="text-[12px] mono flex items-center gap-1 hover:text-white" style={{ color: 'var(--ink-2)' }}>
                View all{' '}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            }
          />
          <div className="space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="panel-2 rounded-md px-3 py-2.5 flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusPill tone={a.sev === 'critical' ? 'bad' : a.sev === 'warning' ? 'warn' : 'info'} dot={true}>
                    {a.sev}
                  </StatusPill>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{a.title}</div>
                  <div className="text-[11.5px] mt-0.5 truncate" style={{ color: 'var(--ink-3)' }}>
                    {a.detail}
                  </div>
                </div>
                <div className="text-[11px] mono shrink-0" style={{ color: 'var(--ink-3)' }}>
                  {a.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 panel rounded-xl p-5">
          <SectionHead
            eyebrow="Top performers"
            title="Bots · P&L today"
            right={
              <button onClick={() => push('fleet')} className="text-[12px] mono flex items-center gap-1 hover:text-white" style={{ color: 'var(--ink-2)' }}>
                Fleet monitor{' '}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            }
          />
          <div className="grid grid-cols-2 gap-2">
            {[...bots]
              .sort((a, b) => b.pnlToday - a.pnlToday)
              .slice(0, 6)
              .map((b) => (
                <div key={b.id} className="panel-2 rounded-md p-3 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-md grid place-items-center mono text-[10px]"
                    style={{
                      background: '#0b0e13',
                      border: '1px solid var(--line-2)',
                      color: b.pnlToday > 0 ? '#b6ff3c' : '#fb5d6f',
                    }}
                  >
                    {b.exchange.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] truncate">{b.strategy}</div>
                    <div className="text-[11px] mono truncate" style={{ color: 'var(--ink-3)' }}>
                      {b.user} · {b.pair}
                    </div>
                  </div>
                  <div className={'mono text-[13px] tabular-nums ' + (b.pnlToday >= 0 ? 'text-[#b6ff3c]' : 'text-[#fb5d6f]')}>
                    {b.pnlToday >= 0 ? '+' : ''}
                    {b.pnlToday.toFixed(2)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
