import { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import LoginPage from '../pages/LoginPage';
import OverviewView from './views/Overview';
import UsersView from './views/Users';
import FleetView from './views/Fleet';
import SubsView from './views/Subscriptions';
import AlertsView from './views/Alerts';
import { StatusPill } from './components/ui';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'fleet', label: 'Bot fleet', icon: 'bot' },
  { id: 'subs', label: 'Subscriptions', icon: 'card' },
  { id: 'alerts', label: 'Alert center', icon: 'bell' },
];

function Sidebar({ route, setRoute }) {
  const icons = {
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15 20c0-2.5 1.8-4.6 4-5"/></svg>,
    bot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="12" rx="2.5"/><path d="M12 3v4"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M9 17h6"/></svg>,
    card: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>,
    bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  };

  const { user, logout } = useAuth();

  return (
    <aside className="w-[232px] shrink-0 h-screen sticky top-0 border-r hairline flex flex-col" style={{ background: '#08090d' }}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-md grid place-items-center"
            style={{ background: 'linear-gradient(135deg, #b6ff3c 0%, #6ee7ff 100%)', boxShadow: '0 0 24px rgba(182,255,60,.25)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#07090d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18 L9 11 L13 14 L20 5"/><path d="M4 21 L20 21"/></svg>
          </div>
          <div>
            <div className="display text-[15px] font-semibold leading-none">BinQuant</div>
            <div className="text-[10px] mono mt-0.5" style={{ color: 'var(--ink-3)' }}>admin · v4.12</div>
          </div>
        </div>
      </div>

      {user && (
        <div className="mx-3 mb-3 chip rounded-md px-2.5 py-2 flex items-center gap-2">
          <div className="flex-1 leading-tight">
            <div className="text-[11px] mono uppercase tracking-[.1em]" style={{ color: 'var(--ink-3)' }}>Signed in as</div>
            <div className="text-[12.5px] truncate">{user.email}</div>
          </div>
          <button onClick={logout} className="text-[var(--ink-3)] hover:text-white p-1" title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/></svg>
          </button>
        </div>
      )}

      <nav className="px-2 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[.2em] px-3 mt-2 mb-1.5" style={{ color: 'var(--ink-3)' }}>Workspace</div>
        {NAV.map((n) => {
          const active = route === n.id;
          const badge = n.id === 'alerts' ? 4 : null;
          return (
            <button key={n.id} onClick={() => setRoute(n.id)}
              className={'nav-item w-full text-left px-3 py-2 rounded-md text-[13px] flex items-center gap-2.5 mt-0.5 transition ' +
                (active ? 'active bg-white/[0.04] text-white' : 'text-[var(--ink-2)] hover:bg-white/[0.025] hover:text-white')}>
              <span className={active ? 'text-[var(--acc)]' : ''}>{icons[n.icon]}</span>
              <span className="flex-1">{n.label}</span>
              {badge && <span className="text-[10px] mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(251,93,111,.12)', color: '#fb5d6f', border: '1px solid rgba(251,93,111,.3)' }}>{badge}</span>}
            </button>
          );
        })}
        <div className="text-[10px] uppercase tracking-[.2em] px-3 mt-5 mb-1.5" style={{ color: 'var(--ink-3)' }}>Insights</div>
        {['Strategies', 'Marketplace', 'Affiliates', 'Audit log'].map((x) => (
          <button key={x} className="w-full text-left px-3 py-2 rounded-md text-[13px] text-[var(--ink-2)] hover:bg-white/[0.025] hover:text-white mt-0.5 flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--ink-3)' }} />{x}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t hairline">
        <div className="panel-2 rounded-md p-3">
          <div className="text-[10.5px] uppercase tracking-[.16em]" style={{ color: 'var(--ink-3)' }}>System</div>
          <div className="mt-1.5 flex items-center justify-between text-[12px]"><span>API latency</span><span className="mono text-[#34d399]">42ms</span></div>
          <div className="flex items-center justify-between text-[12px]"><span>Queue</span><span className="mono">0.3% util</span></div>
          <div className="flex items-center justify-between text-[12px]"><span>WS clients</span><span className="mono">12,041</span></div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ route }) {
  const titleMap = { overview: 'Overview', users: 'Users', fleet: 'Bot fleet', subs: 'Subscriptions', alerts: 'Alerts' };
  return (
    <div className="h-12 border-b hairline px-5 flex items-center gap-4 sticky top-0 z-30" style={{ background: 'rgba(7,9,13,.85)', backdropFilter: 'blur(12px)' }}>
      <div className="text-[12px] mono flex items-center gap-1.5" style={{ color: 'var(--ink-3)' }}>
        Admin <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>{' '}
        <span className="text-white">{titleMap[route]}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md w-[280px] hidden md:flex" style={{ background: '#0b0e13', border: '1px solid var(--line-2)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>
        <input placeholder="Search users, bots, invoices…   ⌘ K" className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[var(--ink-3)]" style={{ color: 'var(--ink)' }} />
      </div>
      <button className="relative chip rounded-md p-1.5 hover:bg-white/[0.04]" title="Alerts">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#fb5d6f', boxShadow: '0 0 0 2px #07090d' }} />
      </button>
      <div className="vsep h-5" />
      <StatusPill tone="acc" dot={true}>All systems · operational</StatusPill>
    </div>
  );
}

export default function AdminApp() {
  const { isAuthenticated, user, logout } = useAuth();
  const [route, setRoute] = useState('overview');

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => {}} />;
  }

  // Check admin role - if not admin, redirect to /app
  if (user?.role !== 'admin') {
    window.location.href = '/app';
    return null;
  }

  const renderView = () => {
    switch (route) {
      case 'overview': return <OverviewView push={setRoute} />;
      case 'users': return <UsersView />;
      case 'fleet': return <FleetView />;
      case 'subs': return <SubsView />;
      case 'alerts': return <AlertsView />;
      default: return <OverviewView push={setRoute} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar route={route} />
        <div className="p-6 flex-1 min-w-0">{renderView()}</div>
        <div className="px-6 pb-4 pt-2 text-[11px] mono flex items-center justify-between" style={{ color: 'var(--ink-3)' }}>
          <span>© 2026 BinQuant Labs · Internal</span>
          <span>build a4b2c · region us-east-1</span>
        </div>
      </main>
    </div>
  );
}
