import { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// ── Status Pill ──
export function StatusPill({ tone = 'ok', children, dot = true, className = '' }) {
  const map = {
    ok: { bg: 'rgba(52,211,153,.08)', fg: '#34d399', bd: 'rgba(52,211,153,.25)' },
    bad: { bg: 'rgba(251,93,111,.08)', fg: '#fb5d6f', bd: 'rgba(251,93,111,.28)' },
    warn: { bg: 'rgba(245,183,84,.08)', fg: '#f5b754', bd: 'rgba(245,183,84,.28)' },
    info: { bg: 'rgba(110,231,255,.08)', fg: '#6ee7ff', bd: 'rgba(110,231,255,.28)' },
    mute: { bg: 'rgba(155,163,178,.06)', fg: '#9aa3b2', bd: 'rgba(155,163,178,.18)' },
    acc: { bg: 'rgba(182,255,60,.08)', fg: '#b6ff3c', bd: 'rgba(182,255,60,.28)' },
  };
  const s = map[tone] || map.mute;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] mono font-medium ${className}`}
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: s.fg }} />}
      {children}
    </span>
  );
}

// ── Avatar from initials ──
export function Avatar({ name = '?', size = 28 }) {
  const initials = name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const hue = (name.charCodeAt(0) * 7 + name.charCodeAt(1 || 0) * 11) % 360;
  return (
    <div
      className="flex items-center justify-center rounded-full text-[11px] font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 70% 28%), hsl(${(hue + 40) % 360} 80% 18%))`,
        color: '#e7ecf3',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)',
      }}
    >
      {initials}
    </div>
  );
}

// ── KPI Card ──
export function KPI({ label, value, delta, deltaTone = 'ok', sub, accent, sparkData, icon: Icon }) {
  return (
    <div className="panel rounded-xl p-5 relative overflow-hidden group">
      {accent && (
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-20 blur-2xl"
          style={{ background: accent }}
        />
      )}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[.14em]" style={{ color: 'var(--ink-3)' }}>
          {Icon && <Icon size={13} />}
          <span>{label}</span>
        </div>
        {delta != null && (
          <StatusPill tone={deltaTone} dot={false} className="!py-px !px-1.5">
            {deltaTone === 'ok' ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </StatusPill>
        )}
      </div>
      <div className="mt-3 flex items-end gap-3 relative">
        <div className="display text-[34px] leading-none font-semibold tabular-nums">{value}</div>
        {sub && (
          <div className="text-[12px] mono pb-1.5" style={{ color: 'var(--ink-3)' }}>
            {sub}
          </div>
        )}
      </div>
      {sparkData && (
        <div className="-mx-1 -mb-1 mt-3 h-9">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
              <defs>
                <linearGradient id={'admin-sp-' + label.replace(/\s/g, '')} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={accent || '#b6ff3c'} stopOpacity=".5" />
                  <stop offset="100%" stopColor={accent || '#b6ff3c'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <Area
                dataKey="y"
                stroke={accent || '#b6ff3c'}
                strokeWidth={1.4}
                fill={`url(#admin-sp-${label.replace(/\s/g, '')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ── Section Header ──
export function SectionHead({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <div className="text-[10.5px] uppercase tracking-[.18em]" style={{ color: 'var(--ink-3)' }}>
          {eyebrow}
        </div>
        <div className="display text-[18px] font-semibold mt-0.5">{title}</div>
      </div>
      {right}
    </div>
  );
}

// ── Segmented Control ──
export function Seg({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-md p-0.5 chip text-[11.5px] mono">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={
            'px-2.5 py-1 rounded-[5px] transition ' +
            (value === o ? 'bg-white/[0.06] text-white' : 'text-[var(--ink-3)] hover:text-white')
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ── KPI Block (simpler version for subs page) ──
export function KPIBlock({ label, value, sub, delta, deltaTone = 'ok', className = '' }) {
  return (
    <div className={'panel rounded-xl p-4 ' + className}>
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] uppercase tracking-[.16em]" style={{ color: 'var(--ink-3)' }}>
          {label}
        </div>
        {delta != null && (
          <StatusPill tone={delta >= 0 ? 'ok' : 'bad'} dot={false} className="!py-px !px-1.5">
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </StatusPill>
        )}
      </div>
      <div className="display text-[26px] font-semibold tabular-nums mt-1">{value}</div>
      <div className="text-[11.5px] mono mt-0.5" style={{ color: 'var(--ink-3)' }}>
        {sub}
      </div>
    </div>
  );
}

// ── Filter Chip Dropdown ──
export function FilterChip({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="chip rounded-md px-2.5 py-1.5 text-[12px] mono flex items-center gap-1.5 hover:bg-white/[0.04]"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16l-6 8v6l-4-2v-4z" /></svg>
        {label}: <span className="text-white">{value}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 panel rounded-md py-1 min-w-[150px] text-[12.5px]">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={
                'w-full text-left px-2.5 py-1.5 hover:bg-white/[0.04] flex items-center justify-between ' +
                (value === o ? 'text-white' : 'text-[var(--ink-2)]')
              }
            >
              {o}{' '}
              {value === o && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b6ff3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.5 4.5L19 7" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
