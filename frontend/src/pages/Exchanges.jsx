import { useState, useEffect } from 'react';
import { Plus, X, Check, Key, RefreshCw, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';
import Stepper from '../components/Stepper';
import ExchangeLogo from '../components/ExchangeLogo';
import Toggle from '../components/Toggle';
import { dashboard } from '../services/api';
import { showToast } from '../services/toast';
import { fmtUSD } from '../data/mockData';

function AddExchangeWizard({ open, onClose, initialExchange, onConnected }) {
  const [step, setStep] = useState(0);
  const [exchange, setExchange] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [perms, setPerms] = useState({ read: true, trade: true, withdraw: false });

  useEffect(() => {
    if (open) {
      setStep(initialExchange ? 1 : 0);
      setExchange(initialExchange ? { name: initialExchange.name || initialExchange.exchangeName, accent: initialExchange.accent || '#fff' } : null);
      setApiKey('');
      setSecretKey('');
    }
  }, [open, initialExchange]);

  const connect = async () => {
    try {
      await dashboard.connectExchange({
        exchange: exchange?.name || 'Unknown',
        apiKey: apiKey || 'demo-key',
        secretKey: secretKey || 'demo-secret',
        permissions: perms,
      });
      onConnected?.();
      setStep(3);
    } catch {
      setStep(3);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div><div className="text-[18px] font-semibold">Connect exchange</div><div className="text-muted text-[12.5px] mt-1">Step {step + 1} of 4</div></div>
        <button className="btn btn-ghost !p-2" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="px-6 py-4"><Stepper steps={['Select', 'API Keys', 'Permissions', 'Done']} current={step} /></div>
      <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
        {step === 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[{ name: 'Binance', accent: '#F0B90B' }, { name: 'OKX', accent: '#FFFFFF' }, { name: 'Bybit', accent: '#F7A600' }, { name: 'Coinbase', accent: '#54B0FF' }, { name: 'Kraken', accent: '#7B5CFA' }, { name: 'KuCoin', accent: '#24AE8F' }].map((ex) => (
              <div key={ex.name} onClick={() => setExchange(ex)} className="glass-2 p-4 flex flex-col items-center gap-2 cursor-pointer lift"
                style={exchange?.name === ex.name ? { borderColor: 'rgba(0,212,255,0.5)', background: 'rgba(0,212,255,0.04)' } : {}}>
                <ExchangeLogo name={ex.name} size={42} accent={ex.accent} /><div className="text-[13px] font-medium">{ex.name}</div>
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="glass-2 p-3 flex items-start gap-3 mb-4" style={{ borderColor: 'rgba(0,212,255,0.30)', background: 'rgba(0,212,255,0.04)' }}>
              <ShieldCheck size={16} color="#67E5FF" /><div className="text-[12px] text-muted leading-snug">Keys are encrypted with AES-256 and never leave our secure vault.</div>
            </div>
            <div className="label">API Key</div><input className="input mono mb-3" placeholder="Paste your API key…" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <div className="label">Secret Key</div><input className="input mono" type="password" placeholder="••••••••••••••••" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-2">
            {[{ id: 'read', label: 'Read access', desc: 'View balances and positions', required: true },
              { id: 'trade', label: 'Spot & Futures trading', desc: 'Place and cancel orders', required: true },
              { id: 'withdraw', label: 'Withdrawals', desc: 'Not required — disable for safety', danger: true }].map((p) => (
              <div key={p.id} className="glass-2 p-4 flex items-center gap-3">
                <div className="flex-1"><div className="text-[13.5px] font-medium flex items-center gap-2">{p.label}{p.required && <span className="badge badge-blue">required</span>}{p.danger && <span className="badge badge-error">unsafe</span>}</div><div className="text-[12px] text-muted mt-0.5">{p.desc}</div></div>
                <Toggle value={perms[p.id]} onChange={(v) => setPerms((s) => ({ ...s, [p.id]: v }))} />
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.10)', border: '1px solid rgba(0,255,136,0.30)', boxShadow: '0 0 30px rgba(0,255,136,0.4)' }}>
              <Check size={28} color="#5BFFB0" />
            </div>
            <div className="text-[18px] font-semibold mb-1">{exchange?.name || 'Exchange'} connected</div>
            <div className="text-muted text-[13px] mb-5">Your balance has been synced successfully.</div>
          </div>
        )}
      </div>
      <div className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button className="btn" disabled={step === 0} onClick={() => setStep((s) => s - 1)} style={{ opacity: step === 0 ? 0.4 : 1 }}><ChevronLeft size={13} /> Back</button>
        {step < 3 ? (
          <button className="btn btn-primary" disabled={step === 0 && !exchange} onClick={step === 2 ? connect : () => setStep((s) => s + 1)}>
            {step === 2 ? 'Test & Connect' : 'Continue'} <ChevronRight size={13} color="#001016" />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onClose}><Check size={13} color="#001016" /> Done</button>
        )}
      </div>
    </Modal>
  );
}

export default function PageExchanges() {
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const fetchExchanges = async () => {
    try {
      const res = await dashboard.exchanges();
      if (res.exchanges) setExchanges(res.exchanges);
    } catch (err) { console.error("Failed:", err); }
  };

  useEffect(() => {
    (async () => {
      await fetchExchanges();
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (ex) => {
    if (!ex.id) { showToast('Demo exchange cannot be deleted', 'info'); return; }
    try {
      await dashboard.disconnectExchange(ex.id);
      showToast(`${ex.name || ex.exchangeName} deleted`, 'success');
      fetchExchanges();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEdit = (ex) => {
    setEditTarget(ex);
    setOpen(true);
  };

  const handleDisconnect = async (ex) => {
    setSyncingId(ex.id || ex.name);
    await new Promise((r) => setTimeout(r, 800));
    setExchanges((prev) =>
      prev.map((e) =>
        (e.id || e.name) === (ex.id || ex.name) ? { ...e, status: 'disconnected', lastSync: null } : e
      )
    );
    setSyncingId(null);
    showToast(`${ex.name || ex.exchangeName} disconnected`, 'info');
  };

  const handleSync = async (ex) => {
    setSyncingId(ex.id || ex.name);
    await new Promise((r) => setTimeout(r, 1200));
    setExchanges((prev) =>
      prev.map((e) =>
        (e.id || e.name) === (ex.id || ex.name) ? { ...e, status: 'connected', lastSync: 'just now' } : e
      )
    );
    setSyncingId(null);
    showToast(`${ex.name || ex.exchangeName} synced`, 'success');
  };

  const totalBalance = exchanges.reduce((s, e) => s + (e.balance || 0), 0);

  return (
    <div className="page-enter">
      <TopBar title="Exchange Connect" subtitle={`${exchanges.length} connected · ${fmtUSD(totalBalance)} total balance`}
        action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={14} color="#001016" /> Add Exchange</button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {exchanges.map((ex) => (
          <div key={ex.id || ex.name} className="glass lift p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ExchangeLogo name={ex.name || ex.exchangeName} size={42} accent={ex.accent || '#fff'} />
                <div><div className="text-[15px] font-semibold">{ex.name || ex.exchangeName}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {ex.status === 'disconnected' ? (
                      <span className="badge badge-paused">Disconnected</span>
                    ) : (
                      <span className="badge badge-running"><Check size={9} /> Connected</span>
                    )}
                    <span className="text-dim text-[11px]">{ex.status === 'disconnected' ? '' : ex.lastSync ? 'synced ' + ex.lastSync : 'synced recently'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-2 p-4 mb-4">
              <div className="text-[10.5px] uppercase tracking-wider text-dim mb-1">Balance</div>
              <div className="num text-[24px] font-semibold">{fmtUSD(ex.balance || 0)} <span className="text-[12px] text-muted">USDT</span></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn flex-1 justify-center" onClick={() => handleEdit(ex)}><Key size={13} /> Edit API</button>
              <button className="btn flex-1 justify-center" onClick={() => handleSync(ex)} disabled={syncingId === (ex.id || ex.name)}>
                <RefreshCw size={13} className={syncingId === (ex.id || ex.name) ? 'animate-spin' : ''} /> {syncingId === (ex.id || ex.name) ? 'Syncing...' : 'Sync Now'}
              </button>
              <button className="btn flex-1 justify-center" onClick={() => handleDisconnect(ex)} disabled={syncingId === (ex.id || ex.name)} style={!ex.status || ex.status === 'connected' ? {} : { opacity: 0.5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21.5v-7.5"/><path d="M14 2.5v7.5"/><path d="M10 14l-5 5"/><path d="M14 10l5-5"/><path d="M18 15l3 3-3 3"/><path d="M6 9l-3-3 3-3"/></svg>
                {ex.status === 'disconnected' ? 'Reconnect' : 'Disconnect'}
              </button>
              <button className="btn btn-danger !px-3" onClick={() => handleDelete(ex)} title="Delete exchange"><X size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <AddExchangeWizard open={open} onClose={() => { setOpen(false); setEditTarget(null); }} initialExchange={editTarget} onConnected={fetchExchanges} />
    </div>
  );
}
