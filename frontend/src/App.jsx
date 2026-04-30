import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Pertukaran from './pages/Pertukaran';
import Pembayaran from './pages/Pembayaran';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import KonfirmasiPembayaran from './pages/KonfirmasiPembayaran';
import Pesanan from './pages/Pesanan';
import Profil from './pages/Profil'; // ✅ TAMBAHAN

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
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/pertukaran" element={<PrivateRoute><Pertukaran /></PrivateRoute>} />
        <Route path="/pembayaran" element={<PrivateRoute><Pembayaran /></PrivateRoute>} />
        <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/konfirmasi-pembayaran" element={<PrivateRoute><KonfirmasiPembayaran /></PrivateRoute>} />
        <Route path="/pesanan" element={<PrivateRoute><Pesanan /></PrivateRoute>} />
        <Route path="/profil"  element={<PrivateRoute><Profil /></PrivateRoute>} /> {/* ✅ TAMBAHAN */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}