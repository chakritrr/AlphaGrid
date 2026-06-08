import { Bot, Settings2, ArrowUpRight, Pause, Play } from 'lucide-react';
import { fmtUSD } from '../data/mockData';
import ExchangeLogo from './ExchangeLogo';
import { StatusBadge, StrategyBadge } from './StatusBadge';
import Progress from './Progress';
import { showToast } from '../services/toast';

export default function BotCard({ bot, compact = false, onToggle, onDetails }) {
  const handleDetails = () => {
    if (onDetails) { onDetails(bot); return; }
    showToast(`${bot.name}: +${bot.todayPnl >= 0 ? '' : ''}${fmtUSD(bot.todayPnl, { sign: true })} today · ${bot.winRate}% win rate`, 'info');
  };
  const handleEdit = () => {
    showToast(`Editing ${bot.name} — coming soon`, 'info');
  };
  const positive = bot.todayPnl >= 0;
  return (
    <div className="glass lift p-5 relative overflow-hidden flex flex-col">
      {/* top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(139,92,246,0.18))',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <Bot size={18} color="#67E5FF" />
            </div>
            {bot.status === 'running' && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full pulse-dot"
                style={{
                  background: '#00FF88',
                  boxShadow: '0 0 10px #00FF88',
                  border: '2px solid #12141A',
                }}
              />
            )}
          </div>
          <div>
            <div className="text-[14px] font-semibold leading-tight">{bot.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <StrategyBadge strategy={bot.strategy} />
              <span className="text-dim text-[11px] mono">{bot.runtime}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={bot.status} />
      </div>

      {/* exchange + pair */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ExchangeLogo name={bot.exchange} size={16} />
          <span className="text-[11.5px] text-muted">{bot.exchange}</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md mono"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-[11.5px]">{bot.pair}</span>
        </div>
      </div>

      {/* P&L */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-2 p-3">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">Today</div>
          <div
            className="num text-[16px] font-semibold"
            style={{ color: positive ? '#5BFFB0' : '#FF8A98' }}
          >
            {fmtUSD(bot.todayPnl, { sign: true })}
          </div>
        </div>
        <div className="glass-2 p-3">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">Total</div>
          <div
            className="num text-[16px] font-semibold"
            style={{ color: bot.totalPnl >= 0 ? '#5BFFB0' : '#FF8A98' }}
          >
            {fmtUSD(bot.totalPnl, { sign: true })}
          </div>
        </div>
      </div>

      {/* Win rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted uppercase tracking-wider">Win rate</span>
          <span className="num text-[12px] font-semibold">{bot.winRate}%</span>
        </div>
        <Progress
          value={bot.winRate}
          color={bot.winRate > 70 ? '#00FF88' : bot.winRate > 55 ? '#00D4FF' : '#FFC857'}
        />
      </div>

      {/* actions */}
      {!compact && (
        <div className="flex items-center gap-2 mt-auto">
          <button
            className="btn flex-1 justify-center"
            onClick={() => onToggle?.(bot)}
            style={
              bot.status === 'running'
                ? { background: 'rgba(255,200,87,0.10)', borderColor: 'rgba(255,200,87,0.35)', color: '#FFD680' }
                : { background: 'rgba(0,255,136,0.10)', borderColor: 'rgba(0,255,136,0.35)', color: '#5BFFB0' }
            }
          >
            {bot.status === 'running' ? <Pause size={13} /> : <Play size={13} />}
            {bot.status === 'running' ? 'Pause' : 'Start'}
          </button>
          <button className="btn !px-3" title="Edit" onClick={handleEdit}>
            <Settings2 size={14} />
          </button>
          <button className="btn !px-3" title="Details" onClick={handleDetails}>
            <ArrowUpRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
