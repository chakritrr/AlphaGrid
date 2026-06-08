import { AreaChart, Area, LineChart, Line, ComposedChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionHead, StatusPill, KPIBlock, Avatar } from '../components/ui';
import { fmtUSD, fmtNum, planMix, mrrSeries, renewals } from '../data';

export default function SubsView() {
  const mrr = mrrSeries[mrrSeries.length - 1].mrr;
  const mrrPrev = mrrSeries[mrrSeries.length - 2].mrr;
  const arr = mrr * 12;
  const churn = 3.4;

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>
          Billing
        </div>
        <h1 className="display text-[28px] font-semibold mt-1">Subscription management</h1>
        <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>
          ARR <span className="mono text-white">{fmtUSD(arr)}</span> · MRR <span className="mono text-white">{fmtUSD(mrr)}</span>
          <span className={'mono ' + (mrr > mrrPrev ? 'text-[#34d399]' : 'text-[#fb5d6f]')}>
            {' '}
            ({mrr > mrrPrev ? '+' : ''}
            {((mrr - mrrPrev) / mrrPrev * 100).toFixed(1)}% MoM)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <KPIBlock className="col-span-6 md:col-span-3" label="MRR" value={fmtUSD(mrr)} delta={+5.2} sub="net new + expansion" />
        <KPIBlock className="col-span-6 md:col-span-3" label="Churn · monthly" value={churn.toFixed(2) + '%'} delta={-0.4} deltaTone="ok" sub="logos · 3-mo avg" />
        <KPIBlock className="col-span-6 md:col-span-3" label="NRR" value="114%" delta={+2.1} sub="incl. upgrades" />
        <KPIBlock className="col-span-6 md:col-span-3" label="LTV · payback" value="6.4 mo" delta={-0.8} deltaTone="ok" sub="blended" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* mrr chart */}
        <div className="col-span-12 lg:col-span-8 panel rounded-xl p-5">
          <SectionHead
            eyebrow="Recurring revenue"
            title="MRR · trailing 12 mo"
            right={
              <div className="flex items-center gap-3 text-[11px] mono" style={{ color: 'var(--ink-3)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: '#b6ff3c' }} /> MRR
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: '#6ee7ff' }} /> NRR %
                </span>
              </div>
            }
          />
          <div className="h-[280px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mrrSeries}>
                <defs>
                  <linearGradient id="mrrFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#b6ff3c" stopOpacity=".35" />
                    <stop offset="100%" stopColor="#b6ff3c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} dy={6} tick={{ fill: '#5A6072', fontSize: 11 }} />
                <YAxis
                  yAxisId="l"
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(v) => '$' + (v / 1000).toFixed(0) + 'k'}
                  tick={{ fill: '#5A6072', fontSize: 11 }}
                />
                <YAxis
                  yAxisId="r"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(v) => v + '%'}
                  tick={{ fill: '#5A6072', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8, fontSize: 12 }}
                  formatter={(v, k) => (k === 'mrr' ? fmtUSD(v) : v + '%')}
                />
                <Area yAxisId="l" dataKey="mrr" stroke="#b6ff3c" strokeWidth={2} fill="url(#mrrFill)" isAnimationActive={false} />
                <Line yAxisId="r" dataKey="nrr" stroke="#6ee7ff" strokeWidth={1.6} dot={{ r: 2.5, fill: '#6ee7ff' }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* plan breakdown pie */}
        <div className="col-span-12 lg:col-span-4 panel rounded-xl p-5">
          <SectionHead eyebrow="Plan breakdown" title="Active subscribers" />
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planMix} dataKey="value" innerRadius={60} outerRadius={86} paddingAngle={2} stroke="none">
                  {planMix.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10px] uppercase tracking-[.18em]" style={{ color: 'var(--ink-3)' }}>
                Total subs
              </div>
              <div className="display text-[22px] font-semibold tabular-nums mt-0.5">
                {fmtNum(planMix.reduce((a, b) => a + b.value, 0))}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {planMix.map((p) => {
              const t = planMix.reduce((a, b) => a + b.value, 0);
              const pct = (p.value / t) * 100;
              const rev = p.value * p.price;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
                      {p.name}
                      <span className="mono text-[11px]" style={{ color: 'var(--ink-3)' }}>
                        ${p.price}/mo
                      </span>
                    </span>
                    <span className="mono tabular-nums" style={{ color: 'var(--ink-2)' }}>
                      {fmtNum(p.value)} · <span className="text-white">{fmtUSD(rev / 1000)}k</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1 rounded-sm bg-white/[0.04] overflow-hidden">
                    <div className="h-full" style={{ width: pct + '%', background: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* upcoming renewals + churn risk */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 panel rounded-xl p-5">
          <SectionHead
            eyebrow="Renewals"
            title="Upcoming · next 14 days"
            right={
              <div className="text-[11.5px] mono" style={{ color: 'var(--ink-3)' }}>
                <span className="text-[#34d399]">{renewals.filter((r) => r.days >= 0).length}</span> upcoming ·{' '}
                <span className="text-[#fb5d6f]">{renewals.filter((r) => r.days < 0).length}</span> overdue
              </div>
            }
          />
          <div className="space-y-1.5">
            {renewals.map((r, i) => {
              const overdue = r.days < 0;
              return (
                <div key={i} className="panel-2 rounded-md px-3 py-2.5 grid grid-cols-12 items-center gap-3">
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                    <Avatar name={r.user} size={26} />
                    <div className="min-w-0">
                      <div className="text-[13px] truncate">{r.user}</div>
                      <div className="text-[11px] mono truncate" style={{ color: 'var(--ink-3)' }}>
                        {r.method}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <StatusPill tone="mute" dot={false}>
                      {r.plan}
                    </StatusPill>
                  </div>
                  <div className="col-span-2 mono text-[12.5px] tabular-nums">{fmtUSD(r.amount, 2)}</div>
                  <div className={'col-span-2 mono text-[12px] ' + (overdue ? 'text-[#fb5d6f]' : 'text-[var(--ink-2)]')}>
                    {overdue ? `${Math.abs(r.days)}d overdue` : r.days === 0 ? 'today' : `in ${r.days}d`}
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="text-[11.5px] mono px-2 py-1 rounded chip hover:bg-white/[0.04]">Charge</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 panel rounded-xl p-5">
          <SectionHead eyebrow="Risk" title="Churn signals" />
          <div className="space-y-3">
            {[
              { l: 'Trial expiring · no card on file', v: 42, c: '#f5b754' },
              { l: 'Active · 0 bots in 30d', v: 18, c: '#f5b754' },
              { l: 'P&L < -10% MTD', v: 27, c: '#fb5d6f' },
              { l: 'Logged in but no trades · 14d', v: 64, c: '#6ee7ff' },
              { l: 'Downgrade requested', v: 9, c: '#c084fc' },
            ].map((x) => (
              <div key={x.l}>
                <div className="flex justify-between text-[12.5px]">
                  <span>{x.l}</span>
                  <span className="mono tabular-nums">{x.v}</span>
                </div>
                <div className="mt-1 h-1 rounded-sm bg-white/[0.04] overflow-hidden">
                  <div className="h-full" style={{ width: Math.min(100, (x.v / 64) * 100) + '%', background: x.c }} />
                </div>
              </div>
            ))}
            <button className="w-full mt-2 chip rounded-md py-2 text-[12px] mono hover:bg-white/[0.04]">
              Open retention playbook →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
