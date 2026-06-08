import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { StatusPill, Avatar, FilterChip, Seg } from '../components/ui';
import { fmtUSD, bots } from '../data';

function BotCard({ bot: b }) {
  const st = b.status;
  const stMap = { running: 'ok', idle: 'mute', warning: 'warn', error: 'bad', paused: 'info' };
  const pos = b.pnlToday >= 0;
  const lastY = b.spark[b.spark.length - 1].y;
  const firstY = b.spark[0].y;
  const trend = lastY - firstY;
  return (
    <div className="panel rounded-lg p-3.5 hover:border-[var(--line-2)] transition group relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-md grid place-items-center mono text-[9.5px] font-semibold"
            style={{ background: '#0b0e13', border: '1px solid var(--line-2)' }}
          >
            {b.exchange.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="mono text-[10.5px]" style={{ color: 'var(--ink-3)' }}>
              {b.id}
            </div>
            <div className="text-[12px] font-medium leading-tight">{b.strategy}</div>
          </div>
        </div>
        <StatusPill tone={stMap[st]}>{st}</StatusPill>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={b.user} size={20} />
          <span className="text-[11.5px] truncate" style={{ color: 'var(--ink-2)' }}>
            {b.user}
          </span>
        </div>
        <div
          className="mono text-[10.5px] chip rounded-sm px-1.5 py-0.5"
          style={{ color: 'var(--ink-2)' }}
        >
          {b.pair}
        </div>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[.14em]" style={{ color: 'var(--ink-3)' }}>
            P&L today
          </div>
          <div
            className={
              'display text-[22px] font-semibold tabular-nums leading-none mt-0.5 ' +
              (pos ? 'text-[#b6ff3c]' : 'text-[#fb5d6f]')
            }
          >
            {pos ? '+' : ''}
            {fmtUSD(b.pnlToday, 2)}
          </div>
        </div>
        <div className="flex-1 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={b.spark} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={'fleet-sp-' + b.id} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={trend >= 0 ? '#34d399' : '#fb5d6f'} stopOpacity=".4" />
                  <stop offset="100%" stopColor={trend >= 0 ? '#34d399' : '#fb5d6f'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <Area
                dataKey="y"
                stroke={trend >= 0 ? '#34d399' : '#fb5d6f'}
                strokeWidth={1.3}
                fill={`url(#fleet-sp-${b.id})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
        {[
          { l: 'Trades', v: b.trades },
          { l: 'WR', v: b.winRate + '%' },
          { l: 'Lev', v: b.leverage + '×' },
        ].map((x) => (
          <div key={x.l} className="panel-2 rounded-sm py-1">
            <div className="text-[9.5px] uppercase tracking-[.14em]" style={{ color: 'var(--ink-3)' }}>
              {x.l}
            </div>
            <div className="mono text-[11.5px] tabular-nums">{x.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[10.5px] mono" style={{ color: 'var(--ink-3)' }}>
        <span>AUM {fmtUSD(b.aum)}</span>
        <span>↑ {b.uptimeH}h</span>
      </div>
    </div>
  );
}

export default function FleetView() {
  const [filter, setFilter] = useState('All');
  const [exf, setExf] = useState('All');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const liveBots = useMemo(
    () => bots.map((b) => ({ ...b, pnlToday: +(b.pnlToday + Math.sin((tick + b.trades) / 3) * 0.4).toFixed(2) })),
    [tick]
  );
  const exs = ['All', ...Array.from(new Set(bots.map((b) => b.exchange)))];

  const filt = liveBots.filter((b) => {
    if (filter !== 'All' && b.status !== filter.toLowerCase()) return false;
    if (exf !== 'All' && b.exchange !== exf) return false;
    return true;
  });

  const counts = bots.reduce((a, b) => {
    a[b.status] = (a[b.status] || 0) + 1;
    return a;
  }, {});
  const total = bots.length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: 'var(--acc)' }} />
            <span className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>
              Realtime · tick {tick}
            </span>
          </div>
          <h1 className="display text-[28px] font-semibold mt-1">Bot fleet monitor</h1>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>
            <span className="text-[#34d399] mono">{counts.running || 0}</span> running ·{' '}
            <span className="text-[#f5b754] mono"> {counts.warning || 0}</span> warning ·{' '}
            <span className="text-[#fb5d6f] mono"> {counts.error || 0}</span> error ·{' '}
            <span className="mono"> {counts.idle || 0}</span> idle ·<span className="mono"> {counts.paused || 0}</span> paused
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Seg value={filter} onChange={setFilter} options={['All', 'Running', 'Warning', 'Error', 'Paused']} />
          <FilterChip label="Venue" value={exf} onChange={setExf} options={exs} />
        </div>
      </div>

      {/* uptime bar */}
      <div className="panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10.5px] uppercase tracking-[.16em]" style={{ color: 'var(--ink-3)' }}>
            Fleet status · all bots
          </div>
          <div className="text-[11.5px] mono" style={{ color: 'var(--ink-3)' }}>
            {total} bots · {Math.round(((counts.running || 0) / total) * 100)}% online
          </div>
        </div>
        <div className="flex gap-px h-1.5 rounded-sm overflow-hidden">
          {bots.map((b) => (
            <div
              key={b.id}
              className="flex-1"
              title={`${b.id} · ${b.status}`}
              style={{
                background: ({ running: '#34d399', idle: '#5b6473', warning: '#f5b754', error: '#fb5d6f', paused: '#9aa3b2' })[b.status],
              }}
            />
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filt.map((b) => (
          <BotCard key={b.id} bot={b} />
        ))}
      </div>
    </div>
  );
}
