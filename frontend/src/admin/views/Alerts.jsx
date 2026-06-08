import { useState, useEffect } from 'react';
import { StatusPill } from '../components/ui';
import { admin } from '../../services/api';

export default function AlertsView() {
  const [tab, setTab] = useState('All');
  const [showAck, setShowAck] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const params = { kind: tab === 'All' ? '' : tab };
    if (!showAck) params.ack = 'false';
    admin.alerts(params).then((res) => {
      setList(res.alerts || []);
    }).catch(() => {});
  }, [tab, showAck]);

  const filtered = list;
  const unackCount = (kind) => list.filter((a) => !a.acknowledged && (kind === 'All' || a.kind === kind)).length;

  const kindIcon = {
    'bot_error': <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="12" rx="2.5"/><path d="M12 3v4"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M9 17h6"/></svg>,
    'failed_payment': <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>,
    'suspicious': <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z"/></svg>,
  };

  const getKind = (k) => {
    if (k === 'bot_error') return 'Bot error';
    if (k === 'failed_payment') return 'Failed payment';
    return 'Suspicious';
  };

  const ack = async (id) => {
    try {
      await admin.acknowledgeAlert(id);
      setList((l) => l.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>Operations</div>
          <h1 className="display text-[28px] font-semibold mt-1">Alert center</h1>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}>
            <span className="text-[#fb5d6f] mono">{list.filter((a) => a.severity === 'critical' && !a.acknowledged).length}</span> critical ·{' '}
            <span className="text-[#f5b754] mono">{list.filter((a) => a.severity === 'warning' && !a.acknowledged).length}</span> warning ·{' '}
            <span className="mono">{list.filter((a) => !a.acknowledged).length}</span> open
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px] mono flex items-center gap-2 cursor-pointer select-none" style={{ color: 'var(--ink-2)' }}>
            <input type="checkbox" checked={showAck} onChange={(e) => setShowAck(e.target.checked)} className="accent-[#b6ff3c]" />Show resolved
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[{ k: 'All', tone: 'acc' }, { k: 'Bot error', tone: 'bad' }, { k: 'Failed payment', tone: 'warn' }, { k: 'Suspicious', tone: 'info' }].map((t) => {
          const kind = t.k === 'All' ? 'All' : t.k === 'Bot error' ? 'bot_error' : t.k === 'Failed payment' ? 'failed_payment' : 'suspicious';
          const active = tab === kind;
          return (
            <button key={t.k} onClick={() => setTab(kind)} className={'panel rounded-xl px-4 py-3 text-left transition ' + (active ? '!border-[var(--line-2)] bg-white/[0.02]' : '')}>
              <div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-[.16em]" style={{ color: 'var(--ink-3)' }}>{t.k}</div><StatusPill tone={t.tone} dot={false}>{unackCount(kind)}</StatusPill></div>
              <div className="display text-[22px] font-semibold mt-1 tabular-nums">{unackCount(kind)}</div>
            </button>
          );
        })}
      </div>

      <div className="panel rounded-xl divide-y divide-[var(--line)]">
        {filtered.map((a) => {
          const Icon = kindIcon[a.kind] || kindIcon['bot_error'];
          const tone = a.severity === 'critical' ? 'bad' : a.severity === 'warning' ? 'warn' : 'info';
          return (
            <div key={a.id} className="px-4 py-3 flex items-start gap-4">
              <div className={'mt-0.5 w-8 h-8 rounded-md grid place-items-center shrink-0'} style={{
                background: a.severity === 'critical' ? 'rgba(251,93,111,.1)' : a.severity === 'warning' ? 'rgba(245,183,84,.1)' : 'rgba(110,231,255,.08)',
                color: a.severity === 'critical' ? '#fb5d6f' : a.severity === 'warning' ? '#f5b754' : '#6ee7ff',
                border: '1px solid ' + (a.severity === 'critical' ? 'rgba(251,93,111,.25)' : a.severity === 'warning' ? 'rgba(245,183,84,.25)' : 'rgba(110,231,255,.2)'),
              }}>{Icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusPill tone={tone}>{a.severity}</StatusPill>
                  <StatusPill tone="mute" dot={false}>{getKind(a.kind)}</StatusPill>
                  <span className="mono text-[11px]" style={{ color: 'var(--ink-3)' }}>{a.id}</span>
                  {a.acknowledged && <StatusPill tone="ok" dot={false}>resolved</StatusPill>}
                </div>
                <div className="text-[14px] mt-1.5 font-medium">{a.title}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-2)' }}>{a.detail}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] mono" style={{ color: 'var(--ink-3)' }}>{a.time}</div>
                <div className="mt-2 flex items-center gap-1 justify-end">
                  {!a.acknowledged && <button onClick={() => ack(a.id)} className="text-[11.5px] mono px-2 py-1 rounded chip hover:bg-white/[0.04]">Acknowledge</button>}
                  <button className="text-[11.5px] mono px-2 py-1 rounded chip hover:bg-white/[0.04]">Inspect</button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px]" style={{ color: 'var(--ink-3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="m5 12 4.5 4.5L19 7"/></svg>
            All clear · no open alerts in this filter
          </div>
        )}
      </div>
    </div>
  );
}
