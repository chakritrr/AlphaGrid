import { useState, useEffect, useMemo } from 'react';
import { admin } from '../../services/api';
import { showToast } from '../../services/toast';
import { FilterChip, Avatar, StatusPill } from '../components/ui';
import { fmtUSD } from '../data';

export default function UsersView() {
  const [q, setQ] = useState('');
  const [plan, setPlan] = useState('All');
  const [status, setStatus] = useState('All');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState('rev');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    admin.users({ search: q, plan, status, sort: sortKey, order: sortDir, page }).then((res) => {
      setUsers(res.users || []);
      setTotal(res.total || 0);
    }).catch(() => {});
  }, [q, plan, status, sortKey, sortDir, page]);

  const filtered = useMemo(() => users, [users]);

  const toggle = (id) => { setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const toggleAll = () => { setSelected((s) => (s.size === filtered.length ? new Set() : new Set(filtered.map((u) => u.id)))); };

  const Th = ({ k, children, align = 'left' }) => (
    <th className={'text-[10.5px] uppercase tracking-[.16em] font-medium px-3 py-2.5 cursor-pointer select-none ' + (align === 'right' ? 'text-right' : '')}
      onClick={() => { setSortDir(sortKey === k && sortDir === 'desc' ? 'asc' : 'desc'); setSortKey(k); }} style={{ color: 'var(--ink-3)' }}>
      <span className={'inline-flex items-center gap-1 ' + (align === 'right' ? 'flex-row-reverse' : '')}>
        {children}
        {sortKey === k && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={sortDir === 'asc' ? 'rotate-180 transition' : 'transition'}><path d="m6 9 6 6 6-6"/></svg>}
      </span>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[.2em]" style={{ color: 'var(--ink-3)' }}>Members</div>
          <h1 className="display text-[28px] font-semibold mt-1">User management</h1>
          <div className="text-[13px] mt-1" style={{ color: 'var(--ink-2)' }}><span className="mono">{total}</span> total</div>
        </div>
      </div>

      <div className="panel rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md flex-1 min-w-[260px]" style={{ background: '#0b0e13', border: '1px solid var(--line-2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, user-id…" className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-[var(--ink-3)]" style={{ color: 'var(--ink)' }} />
          {q && <button onClick={() => setQ('')} className="text-[var(--ink-3)] hover:text-white"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>}
        </div>
        <FilterChip label="Plan" value={plan} onChange={setPlan} options={['All', 'Starter', 'Pro', 'Elite']} />
        <FilterChip label="Status" value={status} onChange={setStatus} options={['All', 'Active', 'Trial', 'Past due', 'Suspended']} />
        <div className="text-[11.5px] mono px-2" style={{ color: 'var(--ink-3)' }}>{filtered.length} match{filtered.length === 1 ? '' : 'es'}</div>
      </div>

      <div className="panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="border-b hairline"><tr>
              <th className="w-9 pl-4"><input type="checkbox" onChange={toggleAll} checked={selected.size > 0 && selected.size === filtered.length} className="accent-[#b6ff3c]" /></th>
              <Th k="name">User</Th><Th k="plan">Plan</Th><Th k="bots">Bots active</Th><Th k="rev" align="right">Revenue · LT</Th><Th k="status">Status</Th>
              <th className="px-3 py-2.5 text-right text-[10.5px] uppercase tracking-[.16em] font-medium" style={{ color: 'var(--ink-3)' }}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((u) => {
                const planTone = u.plan === 'Elite' ? 'acc' : u.plan === 'Pro' ? 'ok' : 'mute';
                const stTone = u.status === 'Active' ? 'ok' : u.status === 'Trial' ? 'info' : u.status === 'Past due' ? 'warn' : 'bad';
                return (
                  <tr key={u.id} className="row border-b hairline last:border-0 transition">
                    <td className="pl-4"><input type="checkbox" checked={selected.has(u.id)} onChange={() => toggle(u.id)} className="accent-[#b6ff3c]" /></td>
                    <td className="px-3 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} /><div className="min-w-0"><div className="font-medium truncate">{u.name}</div><div className="text-[11.5px] mono truncate" style={{ color: 'var(--ink-3)' }}>{u.email}</div></div></div></td>
                    <td className="px-3"><StatusPill tone={planTone} dot={false}>{u.plan}</StatusPill></td>
                    <td className="px-3 mono tabular-nums"><span className="text-white">{u.bots}</span></td>
                    <td className="px-3 text-right mono tabular-nums">{fmtUSD(u.rev)}</td>
                    <td className="px-3"><StatusPill tone={stTone}>{u.status}</StatusPill></td>
                    <td className="px-3 text-right"><div className="inline-flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-white/[0.06]" title="View"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
                      <button className="p-1.5 rounded hover:bg-white/[0.06]" title="More"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/></svg></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-[11.5px] mono border-t hairline" style={{ color: 'var(--ink-3)' }}>
          <span>Showing 1–{filtered.length} of {total}</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded hover:bg-white/[0.04]" onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Prev</button>
            <button className="px-2 py-1 rounded bg-white/[0.06] text-white">{page}</button>
            <button className="px-2 py-1 rounded hover:bg-white/[0.04]" onClick={() => setPage((p) => p + 1)}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
