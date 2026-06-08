import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export default function TopBar({ title, subtitle, onMenu, action }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden btn-ghost btn !p-2" onClick={onMenu}>
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <div className="text-[22px] sm:text-[26px] font-semibold leading-none tracking-tight truncate">
            {title}
          </div>
          {subtitle && <div className="text-muted text-[13px] mt-1.5">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Search - visible on md+ */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={14} color="#5A6072" />
          <input
            className="bg-transparent text-[13px] outline-none placeholder:text-dim w-40"
            placeholder="Search bots, trades…"
          />
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.04)', color: '#8A90A2', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            ⌘K
          </span>
        </div>
        <button className="btn btn-ghost !p-2 relative">
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }}
          />
        </button>
        {action}
      </div>
    </div>
  );
}
