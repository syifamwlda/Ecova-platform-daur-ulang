import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '⊞' },
  { to: '/pertukaran',   label: 'Pertukaran',   icon: '⇄' },
  { to: '/marketplace',  label: 'Marketplace',  icon: '🛍' },
  { to: '/pesanan',      label: 'Pesanan',      icon: '📋' },
  { to: '/pembayaran',   label: 'Pembayaran',   icon: '💳' },
  { to: '/profil',       label: 'Profil',       icon: '👤' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__leaf">🌿</span>
        <span className="sidebar__logo">Ecovan</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <span className="sidebar__icon">⇥</span>
        <span>Keluar</span>
      </button>
    </aside>
  );
}
