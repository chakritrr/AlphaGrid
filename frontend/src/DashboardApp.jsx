import { useState } from 'react';
import { Settings, LifeBuoy } from 'lucide-react';
import Sidebar from './components/Sidebar';
import PageDashboard from './pages/Dashboard';
import PageBots from './pages/Bots';
import PagePerformance from './pages/Performance';
import PageExchanges from './pages/Exchanges';
import PageSubscription from './pages/Subscription';
import PagePlaceholder from './pages/Placeholder';

export default function DashboardApp() {
  const [page, setPage] = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <PageDashboard onNav={setPage} />;
      case 'bots':
        return <PageBots />;
      case 'performance':
        return <PagePerformance />;
      case 'exchanges':
        return <PageExchanges />;
      case 'subscription':
        return <PageSubscription />;
      case 'settings':
        return <PagePlaceholder title="Settings" subtitle="Account preferences, security, notifications" icon={Settings} />;
      case 'help':
        return <PagePlaceholder title="Help & Support" subtitle="Docs, community and direct support" icon={LifeBuoy} />;
      default:
        return <PageDashboard onNav={setPage} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar current={page} onNav={setPage} mobileOpen={mobileNav} onClose={() => setMobileNav(false)} />
      <main className="flex-1 min-w-0 px-5 sm:px-7 lg:px-9 py-6 lg:py-8 relative">
        <div
          className="absolute top-0 left-0 right-0 h-[420px] pointer-events-none -z-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at 30% 0%, rgba(0,212,255,0.08), transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.08), transparent 60%)',
          }}
        />
        <div className="relative max-w-[1480px] mx-auto" key={page}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
