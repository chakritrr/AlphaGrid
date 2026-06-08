import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { fmtUSD } from '../data/mockData';

export default function TradesTable({ trades, compact = false, showPagination = false }) {
  const [page, setPage] = useState(0);
  const perPage = 8;
  const totalPages = Math.ceil(trades.length / perPage);
  const paged = showPagination ? trades.slice(page * perPage, (page + 1) * perPage) : trades;

  return (
    <div>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-[12.5px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr className="text-left text-dim text-[11px] uppercase tracking-[0.08em]">
              <th className="py-2.5 pr-3 font-medium">Date</th>
              {!compact && <th className="py-2.5 pr-3 font-medium">Bot</th>}
              <th className="py-2.5 pr-3 font-medium">Pair</th>
              <th className="py-2.5 pr-3 font-medium">Side</th>
              {!compact && <th className="py-2.5 pr-3 font-medium text-right">Entry</th>}
              {!compact && <th className="py-2.5 pr-3 font-medium text-right">Exit</th>}
              <th className="py-2.5 pr-3 font-medium text-right">P&L</th>
              {!compact && <th className="py-2.5 pr-3 font-medium">Duration</th>}
              <th className="py-2.5 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-white/[0.02] transition-colors"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <td className="py-3 pr-3 mono text-[12px] text-muted whitespace-nowrap">{t.date}</td>
                {!compact && <td className="py-3 pr-3 whitespace-nowrap">{t.bot}</td>}
                <td className="py-3 pr-3 mono whitespace-nowrap">{t.pair}</td>
                <td className="py-3 pr-3">
                  <span className={`badge ${t.side === 'Long' ? 'badge-running' : 'badge-error'}`}>
                    {t.side === 'Long' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {t.side}
                  </span>
                </td>
                {!compact && (
                  <td className="py-3 pr-3 num text-right">
                    ${t.entry.toFixed(t.entry < 10 ? 3 : 2)}
                  </td>
                )}
                {!compact && (
                  <td className="py-3 pr-3 num text-right">
                    ${t.exit.toFixed(t.exit < 10 ? 3 : 2)}
                  </td>
                )}
                <td
                  className="py-3 pr-3 num text-right font-semibold"
                  style={{ color: t.pnl >= 0 ? '#5BFFB0' : '#FF8A98' }}
                >
                  {fmtUSD(t.pnl, { sign: true })}
                </td>
                {!compact && (
                  <td className="py-3 pr-3 mono text-[11.5px] text-muted">{t.duration}</td>
                )}
                <td className="py-3 pr-3">
                  <span className={`badge ${t.status === 'win' ? 'badge-running' : 'badge-error'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="text-[12px] text-muted">
            Showing{' '}
            <span className="num text-white">
              {page * perPage + 1}–{Math.min((page + 1) * perPage, trades.length)}
            </span>{' '}
            of <span className="num text-white">{trades.length}</span> trades
          </div>
          <div className="flex items-center gap-1">
            <button
              className="btn !px-3"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              style={{ opacity: page === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className="btn !px-3 mono"
                onClick={() => setPage(i)}
                style={
                  i === page
                    ? { background: 'rgba(0,212,255,0.10)', borderColor: 'rgba(0,212,255,0.30)', color: '#67E5FF' }
                    : {}
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn !px-3"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              style={{ opacity: page >= totalPages - 1 ? 0.4 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
