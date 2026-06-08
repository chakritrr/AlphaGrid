import { useState, useEffect } from 'react';
import { Crown, CreditCard, Download, Check, X as XIcon } from 'lucide-react';
import TopBar from '../components/TopBar';
import Progress from '../components/Progress';
import { dashboard } from '../services/api';
import { PLANS, PAYMENTS } from '../data/mockData';

export default function PageSubscription() {
  const [plans, setPlans] = useState(PLANS);
  const [payments, setPayments] = useState(PAYMENTS);
  const [sub, setSub] = useState(null);
  const [selected, setSelected] = useState('pro');

  useEffect(() => {
    async function fetchData() {
      try {
        const [subRes, plansRes, paymentsRes] = await Promise.all([
          dashboard.subscription(),
          dashboard.plans(),
          dashboard.payments(),
        ]);
        setSub(subRes);
        if (plansRes.plans) setPlans(plansRes.plans);
        if (paymentsRes.payments) setPayments(paymentsRes.payments);
      } catch { /* use fallback */ }
    }
    fetchData();
  }, []);

  const currentPlan = plans.find((p) => p.id === (sub?.plan || 'pro')) || plans[1];

  return (
    <div className="page-enter">
      <TopBar title="Subscription" subtitle="Manage your plan and billing" />

      <div className="glass p-6 mb-6 relative overflow-hidden">
        <div className="aurora" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.20), rgba(139,92,246,0.20))', border: '1px solid rgba(255,255,255,0.10)' }}>
              <Crown size={22} color="#67E5FF" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1"><span className="text-[11px] uppercase tracking-wider text-dim">Current plan</span><span className="badge badge-blue">Active</span></div>
              <div className="text-[22px] font-semibold leading-none">{currentPlan.name} <span className="text-muted text-[14px] font-normal">· ${currentPlan.price}/mo</span></div>
              <div className="text-[12px] text-muted mt-1.5">Renews on June 1, 2026 · {sub?.botsLimit || currentPlan.botsLimit || '10'} bots included</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn"><CreditCard size={13} /> Update payment</button>
            <button className="btn"><XIcon size={13} /> Cancel plan</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 relative">
          {[
            { label: 'Bots used', value: `${sub?.botsUsed || 5} / ${sub?.botsLimit || 10}`, percent: 50, color: '#00D4FF' },
            { label: 'Exchanges', value: '4 / 3+', percent: 100, color: '#8B5CF6' },
            { label: 'Trades this month', value: '849 / ∞', percent: 60, color: '#00FF88' },
            { label: 'API calls', value: '12.4k / 50k', percent: 24, color: '#FFC857' },
          ].map((u) => (
            <div key={u.label}>
              <div className="flex items-center justify-between mb-1.5"><span className="text-[11px] uppercase tracking-wider text-muted">{u.label}</span><span className="num text-[12px] font-medium">{u.value}</span></div>
              <Progress value={u.percent} color={u.color} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-[14px] font-semibold mb-3">Plans</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((p) => {
          const isCurrent = p.id === (sub?.plan || 'pro');
          const isSelected = selected === p.id;
          return (
            <div key={p.id} onClick={() => setSelected(p.id)} className="glass p-6 relative cursor-pointer lift"
              style={{ ...(p.popular ? { borderColor: 'rgba(0,212,255,0.40)', boxShadow: '0 0 0 1px rgba(0,212,255,0.20), 0 20px 60px -20px rgba(0,212,255,0.30)' } : {}), ...(isSelected && !p.popular ? { borderColor: 'rgba(255,255,255,0.18)' } : {}) }}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-wider uppercase" style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)', color: '#001016' }}>⭐ Most Popular</div>}
              <div className="text-[13px] uppercase tracking-wider text-muted mb-2">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-1"><span className="num text-[36px] font-semibold leading-none">${p.price}</span><span className="text-muted text-[13px]">/mo</span></div>
              <div className="text-[12.5px] text-muted mb-5">{p.tagline}</div>
              <div className="flex flex-col gap-2 mb-5">
                {(p.features || []).map((f, i) => (<div key={i} className="flex items-center gap-2 text-[12.5px]"><Check size={12} color="#5BFFB0" /><span>{f}</span></div>))}
              </div>
              <button className={`btn w-full justify-center ${p.popular && !isCurrent ? 'btn-primary' : ''}`} disabled={isCurrent}
                style={isCurrent ? { background: 'rgba(255,255,255,0.04)', color: '#8A90A2', cursor: 'default' } : {}}>
                {isCurrent ? 'Current Plan' : p.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div><div className="text-[14px] font-semibold">Payment history</div><div className="text-muted text-[12px] mt-0.5">Your past invoices</div></div>
          <button className="btn"><Download size={13} /> Download all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead><tr className="text-left text-dim text-[11px] uppercase tracking-[0.08em]"><th className="py-2.5 pr-3 font-medium">Invoice</th><th className="py-2.5 pr-3 font-medium">Date</th><th className="py-2.5 pr-3 font-medium">Plan</th><th className="py-2.5 pr-3 font-medium text-right">Amount</th><th className="py-2.5 pr-3 font-medium">Status</th><th className="py-2.5 pr-3 font-medium text-right">Action</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-3 pr-3 mono">{p.id}</td>
                  <td className="py-3 pr-3 text-muted">{p.paidAt || p.date}</td>
                  <td className="py-3 pr-3">{p.plan || p.planId}</td>
                  <td className="py-3 pr-3 num text-right">${(p.amount || 0).toFixed(2)}</td>
                  <td className="py-3 pr-3"><span className="badge badge-running">Paid</span></td>
                  <td className="py-3 pr-3 text-right"><button className="btn !py-1 !px-2.5 text-[11.5px]"><Download size={12} /> Invoice</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
