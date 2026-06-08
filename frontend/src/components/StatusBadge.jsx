const STATUS_MAP = {
  running: { label: 'Running', cls: 'badge-running', dot: '#00FF88' },
  paused: { label: 'Paused', cls: 'badge-paused', dot: '#FFC857' },
  error: { label: 'Error', cls: 'badge-error', dot: '#FF5A6E' },
};

export function StatusBadge({ status }) {
  const m = STATUS_MAP[status] || STATUS_MAP.running;
  return (
    <span className={`badge ${m.cls}`}>
      <span
        className="pulse-dot"
        style={{ width: 6, height: 6, borderRadius: 999, background: m.dot, boxShadow: `0 0 8px ${m.dot}` }}
      />
      {m.label}
    </span>
  );
}

const STRATEGY_MAP = {
  Scalping: { cls: 'badge-blue' },
  Grid: { cls: 'badge-purple' },
  DCA: { cls: 'badge-running' },
  Arbitrage: { cls: 'badge-paused' },
};

export function StrategyBadge({ strategy }) {
  const m = STRATEGY_MAP[strategy] || { cls: 'badge-soft' };
  return <span className={`badge ${m.cls}`}>{strategy}</span>;
}

export function RiskBadge({ risk }) {
  const map = { Low: 'badge-running', Medium: 'badge-paused', High: 'badge-error' };
  return <span className={`badge ${map[risk] || 'badge-soft'}`}>{risk} risk</span>;
}
