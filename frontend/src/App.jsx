import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing';
import DashboardApp from './DashboardApp';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<DashboardApp />} />
        <Route path="/admin/*" element={
          <div className="admin-panel">
            <AdminApp />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
