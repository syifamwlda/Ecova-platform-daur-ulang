import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Pertukaran from './pages/Pertukaran';
import Pembayaran from './pages/Pembayaran';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        <Route path="/pertukaran" element={<PrivateRoute><Pertukaran /></PrivateRoute>} />

        <Route path="/pembayaran" element={<PrivateRoute><Pembayaran /></PrivateRoute>} />

        {/* ✅ MARKETPLACE */}
        <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />

        {/* ✅ DETAIL PRODUK */}
        <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />

        {/* ✅ CART */}
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}