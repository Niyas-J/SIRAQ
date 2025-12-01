import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SiraqPage from './SiraqPage';
import AdminLogin from './pages/admin/login.tsx';
import AdminDashboard from './pages/admin/index.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SiraqPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;