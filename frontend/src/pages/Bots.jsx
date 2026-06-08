import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Rocket, X, Key, ShieldAlert, TrendingUp } from 'lucide-react';
import TopBar from '../components/TopBar';
import BotCard from '../components/BotCard';
import Modal from '../components/Modal';
import Stepper from '../components/Stepper';
import ExchangeLogo from '../components/ExchangeLogo';
import { RiskBadge } from '../components/StatusBadge';
import { dashboard } from '../services/api';
import { STRATEGIES, AVAILABLE_EXCHANGES, TRADING_PAIRS } from '../data/mockData';

function CreateBotWizard({ open, onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [strategy, setStrategy] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [pair, setPair] = useState('BTC/USDT');
  const [investment, setInvestment] = useState(2500);
  const [risk, setRisk] = useState(50);
  const [tp, setTp] = useState(2.5);
  const [sl, setSl] = useState(1.5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (open) { setStep(0); setError(''); } }, [open]);

  const canNext = () => {
    if (step === 0) return !!strategy;
    if (step === 1) return !!exchange;
    return true;
  };

  const handleLaunch = async () => {
    setSaving(true);
    setError('');
    try {
      await dashboard.createBot({
        strategy: strategy?.name || 'Grid',
        exchange: exchange?.name || 'Binance',
        pair,
        investment,
        risk,
        takeProfit: tp,
        stopLoss: sl,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth={760}>
      <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div><div className="text-[18px] font-semibold">Create new bot</div><div className="text-muted text-[12.5px] mt-1">Step {step + 1} of 4</div></div>
        <button className="btn btn-ghost !p-2" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="px-6 py-4"><Stepper steps={['Strategy', 'Exchange', 'Configure', 'Review']} current={step} /></div>
      <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(STRATEGIES || []).map((s) => (
              <div key={s.id} onClick={() => setStrategy(s)} className="glass-2 p-4 cursor-pointer transition-all lift"
                style={strategy?.id === s.id ? { borderColor: 'rgba(0,212,255,0.5)', background: 'rgba(0,212,255,0.04)', boxShadow: '0 0 0 1px rgba(0,212,255,0.3)' } : {}}>
                <div className="flex items-start justify-between mb-2"><div className="text-[15px] font-semibold">{s.name}</div><RiskBadge risk={s.risk} /></div>
                <div className="text-[12.5px] text-blue font-medium mb-2">{s.tagline}</div>
                <div className="text-[12.5px] text-muted leading-snug mb-3">{s.desc}</div>
                <div className="flex items-center gap-2 text-[11.5px]"><TrendingUp size={12} color="#5BFFB0" /><span className="num text-green">{s.expected}</span></div>
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="label">Choose Exchange</div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(AVAILABLE_EXCHANGES || []).slice(0, 6).map((ex) => (
                <div key={ex.name} onClick={() => setExchange(ex)} className="glass-2 p-4 flex flex-col items-center gap-2 cursor-pointer lift"
                  style={exchange?.name === ex.name ? { borderColor: 'rgba(0,212,255,0.5)', background: 'rgba(0,212,255,0.04)' } : {}}>
                  <ExchangeLogo name={ex.name} size={36} accent={ex.accent} />
                  <div className="text-[12.5px] font-medium">{ex.name}</div>
                  <div className="badge badge-running">connected</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div><div className="label">Trading Pair</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(TRADING_PAIRS || []).slice(0, 6).map((p) => (
                  <button key={p} className="btn justify-center mono text-[12px]" onClick={() => setPair(p)}
                    style={pair === p ? { background: 'rgba(0,212,255,0.10)', borderColor: 'rgba(0,212,255,0.30)', color: '#67E5FF' } : {}}>{p}</button>
                ))}
              </div>
            </div>
            <div><div className="label">Investment Amount (USDT)</div>
              <div className="relative">
                <input type="number" className="input mono pr-14" value={investment} onChange={(e) => setInvestment(+e.target.value)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] mono text-muted">USDT</span>
              </div>
              <div className="flex gap-1.5 mt-2">{ [500, 1000, 2500, 5000].map((v) => (<button key={v} className="btn !py-1 !px-2 text-[11px] mono" onClick={() => setInvestment(v)}>${v}</button>)) }</div>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2"><div className="label !mb-0">Risk Level</div>
                <div className="num text-[12px] font-semibold" style={{ color: risk < 33 ? '#5BFFB0' : risk < 66 ? '#FFC857' : '#FF8A98' }}>
                  {risk < 33 ? 'Conservative' : risk < 66 ? 'Balanced' : 'Aggressive'} · {risk}</div>
              </div>
              <input type="range" min="0" max="100" value={risk} onChange={(e) => setRisk(+e.target.value)} className="w-full" />
            </div>
            <div><div className="label">Take Profit %</div><input type="number" step="0.1" className="input mono" value={tp} onChange={(e) => setTp(+e.target.value)} /></div>
            <div><div className="label">Stop Loss %</div><input type="number" step="0.1" className="input mono" value={sl} onChange={(e) => setSl(+e.target.value)} /></div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="glass-2 p-5 mb-3">
              <div className="text-[11px] uppercase tracking-wider text-dim mb-3">Configuration summary</div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[13px]">
                <div className="text-muted">Strategy</div><div className="font-medium">{strategy?.name || '—'}</div>
                <div className="text-muted">Exchange</div><div className="font-medium">{exchange?.name || '—'}</div>
                <div className="text-muted">Pair</div><div className="mono">{pair}</div>
                <div className="text-muted">Investment</div><div className="mono">${investment.toLocaleString()} USDT</div>
                <div className="text-muted">Risk Level</div><div className="num">{risk} / 100</div>
                <div className="text-muted">Take Profit</div><div className="num text-green">+{tp}%</div>
                <div className="text-muted">Stop Loss</div><div className="num text-red">−{sl}%</div>
              </div>
            </div>
            {error && <div className="text-red text-[12px] bg-red/10 border border-red/30 rounded-lg px-3 py-2 mb-3">{error}</div>}
            <div className="glass-2 p-3 flex items-start gap-3" style={{ borderColor: 'rgba(255,200,87,0.30)', background: 'rgba(255,200,87,0.04)' }}>
              <ShieldAlert size={16} color="#FFC857" /><div className="text-[12px] text-muted leading-snug">Trading bots execute on real funds. Past simulated returns do not guarantee future results.</div>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button className="btn" disabled={step === 0} onClick={() => setStep((s) => s - 1)} style={{ opacity: step === 0 ? 0.4 : 1 }}><ChevronLeft size={13} /> Back</button>
        {step < 3 ? (
          <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep((s) => s + 1)} style={{ opacity: canNext() ? 1 : 0.5 }}>Continue <ChevronRight size={13} color="#001016" /></button>
        ) : (
          <button className="btn btn-primary" disabled={saving} onClick={handleLaunch}><Rocket size={13} color="#001016" /> {saving ? 'Launching...' : 'Launch bot'}</button>
        )}
      </div>
    </Modal>
  );
}

export default function PageBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);

  const fetchBots = async () => {
    try {
      const res = await dashboard.bots();
      setBots(res.bots || []);
    } catch (err) {
      console.error("Failed to fetch bots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBots(); }, []);

  const filtered = filter === 'all' ? bots : bots.filter((b) => b.status === filter);

  const toggle = async (bot) => {
    try {
      const res = await dashboard.toggleBot(bot.id);
      setBots((bs) => bs.map((b) => (b.id === bot.id ? { ...b, status: res.status } : b)));
    } catch {
      setBots((bs) => bs.map((b) => (b.id === bot.id ? { ...b, status: b.status === 'running' ? 'paused' : 'running' } : b)));
    }
  };

  if (loading) {
    return (<div className="page-enter"><TopBar title="My Bots" subtitle="Loading..." /><div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div></div>);
  }

  return (
    <div className="page-enter">
      <TopBar title="My Bots" subtitle={`${bots.filter((b) => b.status === 'running').length} running · ${bots.length} total`}
        action={<button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Plus size={14} color="#001016" /> Create New Bot</button>} />
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[{ id: 'all', label: 'All', count: bots.length }, { id: 'running', label: 'Running', count: bots.filter((b) => b.status === 'running').length }, { id: 'paused', label: 'Paused', count: bots.filter((b) => b.status === 'paused').length }, { id: 'error', label: 'Error', count: bots.filter((b) => b.status === 'error').length }].map((f) => (
          <button key={f.id} className="btn" style={filter === f.id ? { background: 'rgba(0,212,255,0.10)', borderColor: 'rgba(0,212,255,0.30)', color: '#67E5FF' } : {}} onClick={() => setFilter(f.id)}>
            {f.label} <span className="text-dim mono text-[11px]">{f.count}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length > 0 ? filtered.map((b) => (<BotCard key={b.id} bot={b} onToggle={toggle} />)) : (
          <div className="col-span-full glass-2 p-8 text-center text-dim text-[13px]">No bots yet. Click "Create New Bot" to get started.</div>
        )}
      </div>
      <CreateBotWizard open={createOpen} onClose={() => setCreateOpen(false)} onCreated={fetchBots} />
    </div>
  );
}
