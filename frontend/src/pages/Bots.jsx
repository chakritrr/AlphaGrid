import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import BotCard from '../components/BotCard';
import { dashboard } from '../services/api';
import { BOTS as FALLBACK_BOTS } from '../data/mockData';

export default function PageBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchBots() {
      try {
        const res = await dashboard.bots();
        setBots(res.bots || []);
      } catch {
        setBots(FALLBACK_BOTS);
      } finally {
        setLoading(false);
      }
    }
    fetchBots();
  }, []);

  const filtered = filter === 'all' ? bots : bots.filter((b) => b.status === filter);

  const toggle = async (bot) => {
    try {
      const res = await dashboard.toggleBot(bot.id);
      setBots((bs) => bs.map((b) => (b.id === bot.id ? { ...b, status: res.status } : b)));
    } catch {
      // Optimistic local toggle
      setBots((bs) =>
        bs.map((b) => (b.id === bot.id ? { ...b, status: b.status === 'running' ? 'paused' : 'running' } : b))
      );
    }
  };

  if (loading) {
    return (
      <div className="page-enter">
        <TopBar title="My Bots" subtitle="Loading..." />
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <TopBar
        title="My Bots"
        subtitle={`${bots.filter((b) => b.status === 'running').length} running · ${bots.length} total`}
      />

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { id: 'all', label: 'All', count: bots.length },
          { id: 'running', label: 'Running', count: bots.filter((b) => b.status === 'running').length },
          { id: 'paused', label: 'Paused', count: bots.filter((b) => b.status === 'paused').length },
          { id: 'error', label: 'Error', count: bots.filter((b) => b.status === 'error').length },
        ].map((f) => (
          <button key={f.id} className="btn" style={filter === f.id ? { background: 'rgba(0,212,255,0.10)', borderColor: 'rgba(0,212,255,0.30)', color: '#67E5FF' } : {}}
            onClick={() => setFilter(f.id)}>
            {f.label} <span className="text-dim mono text-[11px]">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((b) => (<BotCard key={b.id} bot={b} onToggle={toggle} />))}
      </div>
    </div>
  );
}
