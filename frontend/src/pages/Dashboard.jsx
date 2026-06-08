import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Bot, Activity, Plus } from 'lucide-react';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import BotCard from '../components/BotCard';
import TradesTable from '../components/TradesTable';
import { dashboard } from '../services/api';
import { fmtUSD, computeStats, BOTS, TRADES, PNL_30D } from '../data/mockData';

const ChartGrid = () => (
  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" vertical={false} />
);
const ChartAxisX = (props) => (
  <XAxis tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} {...props} />
);
const ChartAxisY = (props) => (
  <YAxis tick={{ fill: '#5A6072', fontSize: 11 }} axisLine={false} tickLine={false} {...props} />
);

export default function PageDashboard({ onNav }) {
  const [stats, setStats] = useState(null);
  const [pnlData, setPnlData] = useState([]);
  const [bots, setBots] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, pnlRes, botsRes, tradesRes] = await Promise.all([
          dashboard.stats(),
          dashboard.pnl('30d'),
          dashboard.bots(),
          dashboard.trades(5, 0),
        ]);
        setStats(statsRes);
        setPnlData(pnlRes.series || []);
        setBots(botsRes.bots || []);
        setTrades(tradesRes.trades || []);
      } catch (err) {
        // Fallback to mock data
        const s = computeStats();
        setStats(s);
        setPnlData(PNL_30D);
        setBots(BOTS);
        setTrades(TRADES.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-enter">
        <TopBar title="Welcome back" subtitle="Loading your dashboard..." />
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const activeBots = bots.filter((b) => b.status === 'running').slice(0, 3);

  return (
    <div className="page-enter">
      <TopBar
        title="Welcome back, Alex"
        subtitle="Your trading desk · Markets are open · Last sync 12 seconds ago"
        action={
          <button className="btn btn-primary" onClick={() => onNav('bots')}>
            <Plus size={14} color="#001016" /> New Bot
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Portfolio Value"
          value={fmtUSD(stats.portfolioValue)}
          delta={stats.change30d}
          deltaLabel="vs 30d ago"
          accent="#00D4FF"
          icon={Wallet}
          sparkData={pnlData.map((d) => ({ value: d.value }))}
        />
        <StatCard
          label="Today's P&L"
          value={fmtUSD(stats.todayPnl, { sign: true })}
          delta={(stats.todayPnl / stats.portfolioValue) * 100}
          deltaLabel="of portfolio"
          accent={stats.todayPnl >= 0 ? '#00FF88' : '#FF5A6E'}
          icon={stats.todayPnl >= 0 ? TrendingUp : TrendingDown}
        />
        <StatCard
          label="Active Bots"
          value={`${stats.activeBots}`}
          delta={20}
          deltaLabel="this week"
          accent="#8B5CF6"
          icon={Bot}
        />
        <StatCard
          label="Trades This Month"
          value={stats.monthTrades.toLocaleString()}
          delta={8.4}
          deltaLabel="vs last month"
          accent="#FFC857"
          icon={Activity}
        />
      </div>

      {/* Portfolio P&L */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="text-[15px] font-semibold">Portfolio P&L</div>
            <div className="text-muted text-[12.5px] mt-0.5">Last 30 days · USDT equivalent</div>
          </div>
          <div className="flex items-center gap-1.5">
            {['7D', '30D', '90D', '1Y'].map((t, i) => (
              <button key={t} className="btn !py-1.5 !px-3 text-[11.5px]"
                style={i === 1 ? { background: 'rgba(0,212,255,0.10)', borderColor: 'rgba(0,212,255,0.30)', color: '#67E5FF' } : {}}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={pnlData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ChartGrid />
              <ChartAxisX dataKey="date" />
              <ChartAxisY tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ background: 'rgba(14,16,22,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}
                formatter={(v) => [fmtUSD(v), 'Value']}
                cursor={{ stroke: '#00D4FF', strokeDasharray: '3 3', strokeOpacity: 0.4 }} />
              <Area type="monotone" dataKey="value" stroke="#00D4FF" strokeWidth={2} fill="url(#pnlGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active bots + Recent trades */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-semibold">Active bots</div>
            <button className="text-[12px] text-blue hover:underline" onClick={() => onNav('bots')}>View all →</button>
          </div>
          <div className="flex flex-col gap-3">
            {activeBots.map((b) => (<BotCard key={b.id} bot={b} compact />))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[14px] font-semibold">Recent trades</div>
            <button className="text-[12px] text-blue hover:underline">View all →</button>
          </div>
          <div className="glass p-4">
            <TradesTable trades={trades} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
