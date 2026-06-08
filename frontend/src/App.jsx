import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import LandingPage from './pages/Landing';
import DashboardApp from './DashboardApp';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={<DashboardApp />} />
          <Route path="/admin/*" element={
            <div className="admin-panel">
              <AdminApp />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
