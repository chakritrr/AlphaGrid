import { useState, useEffect } from 'react';
import { Wallet, Users, Bot, Sparkles } from 'lucide-react';
import { ComposedChart, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KPI, SectionHead, Seg, StatusPill } from '../components/ui';
import { admin } from '../../services/api';
import { fmtUSD, fmtNum } from '../data';

export default function OverviewView({ push }) {
  const [dash, setDash] = useState(null);
  const [signups, setSignups] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, signupsRes, revRes, alertsRes] = await Promise.all([
          admin.dashboard(),
          admin.signups('30d'),
          admin.revenueSplit(),
          admin.alerts({ ack: 'false', page: '1' }),
        ]);
        setDash(dashRes);
        setSignups(signupsRes.series || []);
        setRevenue(revRes.sources || []);
        setAlerts(alertsRes.alerts || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !dash) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#b6ff3c] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const sparkRev = (signups || []).slice(-14).map((d, i) => ({ y: (d.revenue || 0) / 100, x: i }));
  const sparkSub = (signups || []).slice(-14).map((d, i) => ({ y: d.signups || 0, x: i }));
  const sparkBot = (signups || []).slice(-14).map((d, i) => ({ y: 80 + Math.sin(i / 2) * 9 + i * 1.4, x: i }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>Control room · live</div>
          <h1 className="display text-[28px] font-semibold mt-1">Good afternoon, Sasha</h1>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>
            <span className="mono">{dash.totalBots}</span> bots executing across <span className="mono">14</span> venues
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3"><KPI icon={Wallet} label="Revenue · today" value={fmtUSD(dash.revenueToday)} sub="vs $7,910 yest." delta={9.3} deltaTone="ok" accent="#b6ff3c" sparkData={sparkRev} /></div>
        <div className="col-span-12 md:col-span-3"><KPI icon={Wallet} label="Revenue · MTD" value={fmtUSD(dash.revenueMTD)} sub="goal $220k · 84%" delta={12.6} deltaTone="ok" accent="#6ee7ff" sparkData={sparkRev} /></div>
        <div className="col-span-6 md:col-span-2"><KPI icon={Users} label="Active subs" value={fmtNum(dash.activeSubs)} sub="+184 this wk" delta={5.8} deltaTone="ok" accent="#c084fc" sparkData={sparkSub} /></div>
        <div className="col-span-6 md:col-span-2"><KPI icon={Bot} label="Bots running" value={fmtNum(dash.activeBots)} sub={`of ${dash.totalBots} deployed`} delta={2.1} deltaTone="ok" accent="#f5b754" sparkData={sparkBot} /></div>
        <div className="col-span-12 md:col-span-2"><KPI icon={Sparkles} label="Revenue · YTD" value={fmtUSD(dash.revenueYTD)} sub="run-rate $2.6M" delta={31.2} deltaTone="ok" accent="#34d399" /></div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 panel rounded-xl p-5">
          <SectionHead eyebrow="Acquisition" title="New signups · last 30 days" />
          <div className="h-[260px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={signups} margin={{ top: 6, right: 14, bottom: 0, left: 0 }}>
                <defs><linearGradient id="signFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b6ff3c" stopOpacity=".4" /><stop offset="100%" stopColor="#b6ff3c" stopOpacity="0" /></linearGradient></defs>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" interval={3} tickLine={false} axisLine={false} dy={6} tick={{ fill: '#5A6072', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fill: '#5A6072', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8 }} cursor={{ stroke: '#b6ff3c', strokeOpacity: 0.3, strokeDasharray: '2 4' }} />
                <Bar dataKey="churn" fill="#fb5d6f" fillOpacity={0.55} barSize={6} radius={[2, 2, 0, 0]} />
                <Area type="monotone" dataKey="signups" stroke="#b6ff3c" strokeWidth={2} fill="url(#signFill)" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 panel rounded-xl p-5">
          <SectionHead eyebrow="Revenue mix" title="Sources · MTD" />
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenue} dataKey="value" innerRadius={60} outerRadius={86} paddingAngle={2} stroke="none">
                  {revenue.map((e, i) => (<Cell key={i} fill={['#b6ff3c', '#6ee7ff', '#c084fc', '#f5b754'][i]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0b0e13', border: '1px solid #232936', borderRadius: 8 }} formatter={(v) => fmtUSD(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10px] uppercase tracking-[.18em]" style={{ color: 'var(--ink-3)' }}>Total MTD</div>
              <div className="display text-[22px] font-semibold tabular-nums mt-0.5">{fmtUSD(revenue.reduce((a, b) => a + (b.value || 0), 0))}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {revenue.map((s, i) => {
              const t = revenue.reduce((a, b) => a + (b.value || 0), 0);
              const pct = t > 0 ? ((s.value / t) * 100).toFixed(1) : '0';
              return (
                <div key={s.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-sm" style={{ background: ['#b6ff3c', '#6ee7ff', '#c084fc', '#f5b754'][i] }} />{s.name}</span>
                  <span className="mono tabular-nums" style={{ color: 'var(--ink-2)' }}>{fmtUSD(s.value)} · <span className="text-white">{pct}%</span></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 panel rounded-xl p-5">
          <SectionHead eyebrow="Health" title="Alert center" right={
            <button onClick={() => push('alerts')} className="text-[12px] mono flex items-center gap-1 hover:text-white" style={{ color: 'var(--ink-2)' }}>View all <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>
          } />
          <div className="space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="panel-2 rounded-md px-3 py-2.5 flex items-start gap-3">
                <div className="mt-0.5"><StatusPill tone={a.severity === 'critical' ? 'bad' : a.severity === 'warning' ? 'warn' : 'info'} dot={true}>{a.severity}</StatusPill></div>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-medium truncate">{a.title}</div><div className="text-[11.5px] mt-0.5 truncate" style={{ color: 'var(--ink-3)' }}>{a.detail}</div></div>
                <div className="text-[11px] mono shrink-0" style={{ color: 'var(--ink-3)' }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
