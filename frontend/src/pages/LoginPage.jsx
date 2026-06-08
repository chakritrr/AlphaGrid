import { useState } from 'react';
import { useAuth } from '../services/AuthContext';

export default function LoginPage({ mode: initialMode = 'login', onSuccess }) {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'register') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="glass w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="logo-mark" />
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-white">BinQuant</div>
            <div className="text-[10px] text-dim mono uppercase tracking-[0.15em]">Sign in to continue</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red text-[12px] bg-red/10 border border-red/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button className="btn btn-primary w-full justify-center !py-2.5" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <button type="button" className="btn btn-ghost w-full justify-center text-[12px]" onClick={switchMode}>
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>

          <div className="text-dim text-[11px] text-center border-t border-[rgba(255,255,255,0.05)] pt-4 mt-2">
            Demo: alex@example.com / user123
          </div>
        </form>
      </div>
    </div>
  );
}
