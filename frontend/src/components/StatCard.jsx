import { TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from './Sparkline';

export default function StatCard({ label, value, delta, deltaLabel, accent = '#00D4FF', icon: Icon, sparkData }) {
  const positive = delta >= 0;
  return (
    <div className="glass lift p-5 relative overflow-hidden">
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="text-muted text-[11px] uppercase tracking-[0.1em] font-medium">{label}</div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}
        >
          <Icon size={15} color={accent} />
        </div>
      </div>
      <div className="num text-[28px] font-semibold leading-none mb-2">{value}</div>
      {delta !== undefined && (
        <div className="flex items-center gap-2 text-[12px]">
          <span
            className="num font-medium inline-flex items-center gap-0.5"
            style={{ color: positive ? '#00FF88' : '#FF5A6E' }}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {' '}{positive ? '+' : ''}{typeof delta === 'number' ? delta.toFixed(2) : delta}%
          </span>
          <span className="text-dim">{deltaLabel}</span>
        </div>
      )}
      {sparkData && (
        <div className="mt-3 -mx-2">
          <Sparkline data={sparkData} color={accent} />
        </div>
      )}
    </div>
  );
}
