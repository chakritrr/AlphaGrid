// ============================================================
// API Client — BinQuant Frontend ↔ Backend
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('binquant_token');
}

function setToken(token) {
  localStorage.setItem('binquant_token', token);
}

function clearToken() {
  localStorage.removeItem('binquant_token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('binquant_user'));
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem('binquant_user', JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem('binquant_user');
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.code = data?.error?.code;
    throw err;
  }

  return data;
}

// ── Public ──

export async function register(name, email, password) {
  const data = await request('POST', '/api/v1/auth/register', { name, email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function login(email, password) {
  const data = await request('POST', '/api/v1/auth/login', { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export function logout() {
  clearToken();
  clearUser();
}

export { getToken, setToken, getUser, setUser };

// ── Authenticated helpers ──

export async function get(path) {
  return request('GET', path);
}

export async function post(path, body) {
  return request('POST', path, body);
}

export async function patch(path, body) {
  return request('PATCH', path, body);
}

// ── User Dashboard API ──

export const dashboard = {
  stats: () => get('/api/v1/dashboard/stats'),
  pnl: (range = '30d') => get(`/api/v1/portfolio/pnl?range=${range}`),
  bots: () => get('/api/v1/bots'),
  createBot: (data) => post('/api/v1/bots', data),
  toggleBot: (id) => patch(`/api/v1/bots/${id}/toggle`),
  trades: (limit = 10, offset = 0) => get(`/api/v1/trades?limit=${limit}&offset=${offset}`),
  exchanges: () => get('/api/v1/exchanges'),
  connectExchange: (data) => post('/api/v1/exchanges', data),
  performance: (range = '30d') => get(`/api/v1/performance?range=${range}`),
  subscription: () => get('/api/v1/subscription'),
  plans: () => get('/api/v1/subscription/plans'),
  payments: () => get('/api/v1/subscription/payments'),
};

// ── Admin API ──

export const admin = {
  dashboard: () => get('/api/admin/v1/dashboard'),
  signups: (range = '30d') => get(`/api/admin/v1/signups?range=${range}`),
  revenueSplit: () => get('/api/admin/v1/revenue/split'),
  users: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/admin/v1/users${q ? '?' + q : ''}`);
  },
  updateUserStatus: (id, status) => patch(`/api/admin/v1/users/${id}/status`, { status }),
  bots: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/admin/v1/bots${q ? '?' + q : ''}`);
  },
  mrr: () => get('/api/admin/v1/subscriptions/mrr'),
  planBreakdown: () => get('/api/admin/v1/subscriptions/plans'),
  renewals: () => get('/api/admin/v1/subscriptions/renewals'),
  alerts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/admin/v1/alerts${q ? '?' + q : ''}`);
  },
  acknowledgeAlert: (id) => patch(`/api/admin/v1/alerts/${id}/acknowledge`),
};
