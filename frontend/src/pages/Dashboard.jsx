import { useState, useEffect } from 'react';
import { fetchDashboard } from '../services/api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import IndonesiaWasteChart from '../components/IndonesiaWasteChart';
import ImpactChart from '../components/ImpactChart';
import Footer from '../components/Footer';
import './Dashboard.css';

// ──────────────────────────────────────────
// Dummy / static data
// ──────────────────────────────────────────
const LOCAL_ROOTS_TOTAL = 126700;
const TREE_TARGET = 16;

const BADGES = [
  {
    id: 1,
    name: 'Pelopor Ekologi',
    desc: 'Bergabung sejak fase Alpha',
    icon: '🌱',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Penetral Karbon',
    desc: 'Mengurangi lebih dari 1 ton CO2',
    icon: '✅',
    unlocked: true,
  },
  {
    id: 3,
    name: 'Maestro Marketplace',
    desc: 'Penjualan barang terlaris pertama berhasil',
    icon: '🛍',
    unlocked: true,
  },
  {
    id: 4,
    name: 'Penjaga Hutan',
    desc: 'Tanam total 20 pohon',
    icon: '🔒',
    unlocked: false,
  },
];

const PLANTING_PACKAGES = [
  { label: '1 Pohon', price: 'Rp 10.000' },
  { label: '3 Pohon', price: 'Rp 25.000' },
  { label: '7 Pohon', price: 'Rp 60.000' },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  useEffect(() => {
    fetchDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="db-layout">
      <Sidebar />
      <div className="db-loading">
        <div className="db-spinner" />
        <p>Memuat dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="db-layout">
      <Sidebar />
      <div className="db-error">
        <p>⚠️ {error}</p>
        <button onClick={() => window.location.reload()}>Coba Lagi</button>
      </div>
    </div>
  );

  const { summary, monthly, waste_by_type, indonesia_statistics, user } = data;

  const treeProgress = Math.min(
    (summary.tree_impact_display / TREE_TARGET) * 100,
    100
  );

  return (
    <div className="db-layout">
      <Sidebar />

      <main className="db-main">
        {/* Header */}
        <div className="db-header">
          <div>
            <h1 className="db-header__title">
              Selamat datang, {user?.name ?? 'EcoWarrior'} 👋
            </h1>
            <p className="db-header__sub">Ringkasan kontribusi lingkungan Anda hari ini</p>
          </div>
        </div>

        {/* ── Indonesia Chart ── */}
        <IndonesiaWasteChart data={indonesia_statistics} />

        {/* ── Summary Cards ── */}
        <div className="db-cards-row">
          <DashboardCard
            label="Partisipasi Masyarakat"
            value={`${summary.active_users.toLocaleString()} User Aktif`}
            badge="+ 8.4%"
            icon="👥"
          />
          <DashboardCard
            label="Pengurangan Emisi CO₂"
            value={`~${summary.co2_reduction_ton >= 1
              ? summary.co2_reduction_ton.toFixed(1) + ' Ton'
              : summary.co2_reduction_kg.toFixed(1) + ' kg'}`}
            badge="+12%"
            icon="🌫"
          />
          <DashboardCard
            label="Sampah Dicegah ke Laut"
            value={`~${(summary.total_weight * 9.6).toFixed(0)} kg`}
            badge="+18%"
            icon="🌊"
          />
        </div>

        {/* ── Digital Forest + Tree Card ── */}
        <div className="db-forest-row">
          {/* Digital Forest */}
          <div className="db-forest-card">
            <div className="db-forest-card__overlay" />
            <div className="db-forest-card__content">
              <span className="db-forest-badge">🌿 Pertumbuhan: 12% minggu ini</span>
              <h2 className="db-forest-title">Your Digital Forest<br />is Blooming</h2>

              <div className="db-forest-stats">
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">PENGURANGAN CO2</span>
                  <span className="db-forest-stat__value">
                    {summary.co2_reduction_ton.toFixed(2)} Ton
                  </span>
                </div>
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">SAMPAH TERALIHKAN</span>
                  <span className="db-forest-stat__value">
                    {summary.total_weight} kg
                  </span>
                </div>
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">ECO CREDITS</span>
                  <span className="db-forest-stat__value">
                    {Math.round(summary.eco_credits)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tree Card */}
          <div className="db-tree-card">
            <div className="db-tree-icon">🍃</div>
            <div className="db-tree-number">{summary.tree_impact_display}</div>
            <p className="db-tree-label">POHON YANG TERTANAM</p>
            <div className="db-tree-bar-bg">
              <div
                className="db-tree-bar-fill"
                style={{ width: `${treeProgress}%` }}
              />
            </div>
            <p className="db-tree-target">{treeProgress.toFixed(0)}% untuk mencapai target</p>
          </div>
        </div>

        {/* ── Local Roots + Planting ── */}
        <div className="db-roots-row">
          {/* Local Roots */}
          <div className="db-roots-card">
            <div className="db-roots-header">
              <span className="db-roots-badge">🌿 LOCAL ROOTS</span>
            </div>
            <div className="db-roots-number">
              {LOCAL_ROOTS_TOTAL.toLocaleString('id-ID')}
            </div>
            <p className="db-roots-desc">
              Pohon yang ditanam oleh komunitas kami di seluruh Indonesia.
            </p>

            <div className="db-roots-contrib">
              <div className="db-roots-ring">
                <svg viewBox="0 0 100 100" className="db-roots-svg">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#4a8c5c"
                    strokeWidth="10"
                    strokeDasharray={`${treeProgress * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="db-roots-ring-label">
                  <span>{summary.tree_impact_display}</span>
                  <small>Pohon</small>
                </div>
              </div>
              <div className="db-roots-contrib-info">
                <p className="db-roots-contrib-title">Kontribusiku</p>
                <p className="db-roots-contrib-sub">75% lagi untuk mencapai targetmu</p>
              </div>
            </div>
          </div>

          {/* Planting Packages */}
          <div className="db-plant-card">
            <h3 className="db-plant-title">Tanam Pohon Berikutnya</h3>
            <p className="db-plant-desc">
              Pilih jumlah donasi untuk mengimbangi jejak karbon kamu.
            </p>

            <div className="db-plant-packages">
              {PLANTING_PACKAGES.map((pkg) => (
                <button key={pkg.label} className="db-plant-pkg">
                  <span className="db-plant-pkg__label">{pkg.label}</span>
                  <span className="db-plant-pkg__price">{pkg.price}</span>
                </button>
              ))}
            </div>

            <div className="db-plant-progress">
              <div className="db-plant-progress__bar-bg">
                <div
                  className="db-plant-progress__bar-fill"
                  style={{ width: `${(summary.tree_impact_display / TREE_TARGET) * 100}%` }}
                />
              </div>
              <div className="db-plant-progress__info">
                <span>Kemajuan ke {TREE_TARGET} Pohon</span>
                <span>{summary.tree_impact_display}/{TREE_TARGET} Pohon</span>
              </div>
              <p className="db-plant-progress__note">
                Hanya {Math.max(TREE_TARGET - summary.tree_impact_display, 0)} pohon lagi
                untuk membuka lencana <strong>Penjaga Hutan!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ── Analytics + Badges ── */}
        <div className="db-bottom-row">
          <ImpactChart wasteByType={waste_by_type} monthly={monthly} />

          {/* Badges */}
          <div className="db-badges-card">
            <h3 className="db-badges-title">Penghargaan</h3>
            <div className="db-badges-list">
              {BADGES.map((b) => (
                <div
                  key={b.id}
                  className={`db-badge-item ${b.unlocked ? 'db-badge-item--unlocked' : 'db-badge-item--locked'}`}
                >
                  <span className="db-badge-icon">{b.icon}</span>
                  <div className="db-badge-info">
                    <p className="db-badge-name">{b.name}</p>
                    <p className="db-badge-desc">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="db-badges-gallery-btn">View Badge Gallery</button>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
