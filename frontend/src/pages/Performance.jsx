import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Download, TrendingUp, Target, Activity, Star, CalendarDays, Scale } from 'lucide-react';
import TopBar from '../components/TopBar';
import TradesTable from '../components/TradesTable';
import { fmtUSD, PERF_DATA, BOT_COMPARE, TRADES, WIN_LOSS } from '../data/mockData';

const ChartGrid = () => (
  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" vertical={false} />
);
const ChartAxisX = (props) => (
  <XAxis tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} {...props} />
);
const ChartAxisY = (props) => (
  <YAxis tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} {...props} />
);

export default function PagePerformance() {
  const [range, setRange] = useState('30D');
  const data = PERF_DATA[range];

  const metrics = [
    { label: 'Total Profit', value: fmtUSD(8420.21, { sign: true }), accent: '#00FF88', icon: TrendingUp, delta: 12.4 },
    { label: 'Win Rate', value: '74.9%', accent: '#00D4FF', icon: Target, delta: 2.1 },
    { label: 'Total Trades', value: '849', accent: '#8B5CF6', icon: Activity, delta: 18.6 },
    { label: 'Best Day', value: fmtUSD(1284.90, { sign: true }), accent: '#FFC857', icon: Star, delta: 4.2 },
    { label: 'Avg Daily Profit', value: fmtUSD(280.67, { sign: true }), accent: '#00FF88', icon: CalendarDays, delta: 6.0 },
    { label: 'Profit Factor', value: '2.18', accent: '#00D4FF', icon: Scale, delta: 0.4 },
  ];

  return (
    <div className="page-enter">
      <TopBar
        title="Performance"
        subtitle="Detailed analytics across all your trading bots"
        action={
          <button className="btn">
            <Download size={13} /> Export CSV
          </button>
        }
      />

      {/* Range tabs */}
      <div className="glass-2 inline-flex p-1 mb-5">
        {['7D', '30D', '90D', 'All'].map((r) => (
          <button
            key={r}
            className="px-4 py-1.5 rounded-md text-[12.5px] font-medium transition-all"
            onClick={() => setRange(r)}
            style={
              range === r
                ? { background: 'rgba(0,212,255,0.12)', color: '#67E5FF', boxShadow: '0 0 0 1px rgba(0,212,255,0.3)' }
                : { color: '#8A90A2' }
            }
          >
            {r === 'All' ? 'All Time' : r}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="glass p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon size={13} color={m.accent} />
              <div className="text-[10.5px] uppercase tracking-wider text-muted">{m.label}</div>
            </div>
            <div className="num text-[18px] font-semibold leading-none">{m.value}</div>
            <div className="text-[11px] mt-1.5 num" style={{ color: m.delta >= 0 ? '#5BFFB0' : '#FF8A98' }}>
              {m.delta >= 0 ? '+' : ''}{m.delta}% <span className="text-dim">vs prev</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cumulative chart */}
      <div className="glass p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[15px] font-semibold">Cumulative P&L</div>
            <div className="text-muted text-[12.5px] mt-0.5">Running profit over {range}</div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} /> Cumulative
            </span>
          </div>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <ChartGrid />
              <ChartAxisX dataKey="date" />
              <ChartAxisY tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                formatter={(v) => [fmtUSD(v), 'Cumulative']}
                contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                cursor={{ stroke: '#00D4FF', strokeOpacity: 0.4, strokeDasharray: '3 3' }}
              />
              <Area type="monotone" dataKey="cumulative" stroke="#00D4FF" strokeWidth={2} fill="url(#cumGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily bars + Win/Loss */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="glass p-6 lg:col-span-2">
          <div className="text-[14px] font-semibold mb-1">Daily P&L</div>
          <div className="text-muted text-[12px] mb-4">Profit and loss per day</div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={data.slice(-14)} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <ChartGrid />
                <ChartAxisX dataKey="date" />
                <ChartAxisY tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v) => [fmtUSD(v, { sign: true }), 'P&L']}
                  contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="daily" radius={[4, 4, 0, 0]}>
                  {data.slice(-14).map((d, i) => (
                    <Cell key={i} fill={d.daily >= 0 ? '#00FF88' : '#FF5A6E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass p-6">
          <div className="text-[14px] font-semibold mb-1">Win / Loss ratio</div>
          <div className="text-muted text-[12px] mb-2">All bots, last 30 days</div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={WIN_LOSS}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {WIN_LOSS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [v, n]}
                  contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {WIN_LOSS.map((w) => (
              <div key={w.name} className="glass-2 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="w-2 h-2 rounded-full" style={{ background: w.color }} /> {w.name}
                </div>
                <div className="num text-[16px] font-semibold mt-1" style={{ color: w.color }}>
                  {w.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-bot comparison */}
      <div className="glass p-6 mb-5">
        <div className="text-[14px] font-semibold mb-1">Performance by bot</div>
        <div className="text-muted text-[12px] mb-4">Total P&L per bot</div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={BOT_COMPARE} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#5A6072', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#8A90A2', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={(v) => [fmtUSD(v), 'Total P&L']}
                contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]} fill="url(#barGrad)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade history */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[14px] font-semibold">Trade history</div>
            <div className="text-muted text-[12px] mt-0.5">All executed trades across bots</div>
          </div>
          <button className="btn">
            <Download size={13} /> Export CSV
          </button>
        </div>
        <TradesTable trades={TRADES} showPagination />
      </div>
    </div>
  );
}
