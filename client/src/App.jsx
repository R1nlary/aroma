import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import POSPage from './pages/POSPage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import FinancePage from './pages/FinancePage';
import DashboardPage from './pages/DashboardPage';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><LandingPage /></>} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><Navbar /><AdminPage /></ProtectedRoute>} />
      <Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Navbar /><SalesPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Navbar /><InventoryPage /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><Navbar /><FinancePage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
