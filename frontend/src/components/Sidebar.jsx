import { X, Sparkles, Zap } from 'lucide-react';
import { NAV } from '../data/mockData';
import { LogOut } from 'lucide-react';

// Map icon names to lucide components (dynamic import workaround)
import {
  LayoutDashboard, Bot, TrendingUp, Plug, Crown, Settings, LifeBuoy,
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  Bot,
  TrendingUp,
  Plug,
  Crown,
  Settings,
  LifeBuoy,
};

export default function Sidebar({ current, onNav, mobileOpen, onClose }) {
  return (
    <>
      {/* mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-10 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: 248,
          background: 'linear-gradient(180deg, #0E1016, #0A0B0F)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="logo-mark" />
            <div>
              <div className="text-[15px] font-semibold tracking-tight">BinQuant</div>
              <div className="text-[10px] text-dim mono uppercase tracking-[0.15em]">v3.2 · Live</div>
            </div>
          </div>
          <button className="lg:hidden btn-ghost btn p-1.5" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* User card */}
        <div className="px-3 pt-3">
          <div className="glass-2 p-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px]"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
                color: '#00121A',
              }}
            >
              AK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">Alex Karpov</div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] mono px-1.5 py-[1px] rounded"
                  style={{
                    background: 'rgba(139,92,246,0.18)',
                    color: '#B7A2FF',
                    border: '1px solid rgba(139,92,246,0.35)',
                  }}
                >
                  PRO
                </span>
                <span className="text-[10px] text-dim">5 / 10 bots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 pt-4 flex-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[0.15em] text-dim font-semibold px-3 mb-2">
            Workspace
          </div>
          <div className="flex flex-col gap-0.5">
            {NAV.slice(0, 5).map((item) => {
              const IconComponent = ICON_MAP[item.icon];
              return (
                <div
                  key={item.id}
                  className={`nav-item ${current === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onNav(item.id);
                    onClose();
                  }}
                >
                  {IconComponent && <IconComponent size={16} />}
                  <span>{item.label}</span>
                  {item.id === 'bots' && (
                    <span
                      className="ml-auto text-[10px] mono px-1.5 py-[1px] rounded"
                      style={{
                        background: 'rgba(0,255,136,0.10)',
                        color: '#5BFFB0',
                        border: '1px solid rgba(0,255,136,0.30)',
                      }}
                    >
                      5
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-dim font-semibold px-3 mb-2 mt-5">
            Account
          </div>
          <div className="flex flex-col gap-0.5">
            {NAV.slice(5).map((item) => {
              const IconComponent = ICON_MAP[item.icon];
              return (
                <div
                  key={item.id}
                  className={`nav-item ${current === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onNav(item.id);
                    onClose();
                  }}
                >
                  {IconComponent && <IconComponent size={16} />}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Plan upsell */}
        <div className="px-3 pb-3">
          <div
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(0,212,255,0.10))',
              border: '1px solid rgba(139,92,246,0.30)',
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'radial-gradient(circle at top right, rgba(139,92,246,0.4), transparent 60%)',
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={13} color="#B7A2FF" />
                <span className="text-[11px] font-semibold tracking-wide" style={{ color: '#B7A2FF' }}>
                  UPGRADE TO ELITE
                </span>
              </div>
              <div className="text-[12px] text-muted leading-snug mb-3">
                Unlimited bots, priority signals & dedicated success manager.
              </div>
              <button
                className="btn w-full justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)' }}
                onClick={() => {
                  onNav('subscription');
                  onClose();
                }}
              >
                <Zap size={13} color="#00D4FF" /> See plans
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div
          className="px-3 pb-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}
        >
          <div className="nav-item" style={{ color: '#FF8A98' }}>
            <LogOut size={16} color="#FF8A98" />
            <span>Log out</span>
          </div>
        </div>
      </aside>
    </>
  );
}
