import { useState, useEffect } from 'react';
import { fetchDashboard } from '../services/api';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

// ── Static constants & Mock data ──────────────────────────────────────────────
const LOCAL_ROOTS_TOTAL = 126700;
const TREE_TARGET = 16;

const BADGES = [
  { id: 1, name: 'Pelopor Ekologi',     desc: 'Bergabung sejak fase Alpha',               icon: '🏛️', unlocked: true  },
  { id: 2, name: 'Penetral Karbon',     desc: 'Mengurangi lebih dari 1 ton CO₂',           icon: '🛡️', unlocked: true  },
  { id: 3, name: 'Maestro Marketplace', desc: 'Penjualan barang terlaris pertama berhasil', icon: '🛍️', unlocked: true  },
  { id: 4, name: 'Penjaga Hutan',       desc: 'Tanam total 20 pohon',                      icon: '🔒', unlocked: false },
];

const PLANTING_PACKAGES = [
  { label: '1 Pohon', price: 'Rp 10.000' },
  { label: '3 Pohon', price: 'Rp 25.000' },
  { label: '7 Pohon', price: 'Rp 60.000' },
];

// ── Indonesia 2020–2026 Waste Clustered Bar Data ──────────────────────────────
const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const YEAR_COLORS = [
  '#C0E8C8',
  '#A8DCB4',
  '#86CA97',
  '#5FB576',
  '#3E9958',
  '#277F42',
  '#165A2C',
];

// Values for [Total Timbulan, Total Terkelola] per year
const YEAR_VALUES = {
  '2020': [17.9, 11.7],
  '2021': [22.4, 14.5],
  '2022': [29.4, 18.2],
  '2023': [25.0, 16.1],
  '2024': [24.2, 16.5],
  '2025': [22.1, 15.3],
  '2026': [27.5, 17.8], // Projected
};

function IndonesiaWasteDualChart() {
  const chartData = {
    labels: ['Total Timbulan', 'Total Terkelola'],
    datasets: YEARS.map((year, idx) => ({
      label: year,
      data: YEAR_VALUES[year],
      backgroundColor: YEAR_COLORS[idx],
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.85,
      categoryPercentage: 0.75,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#144327',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (c) => ` ${c.dataset.label}: ${c.raw} Juta Ton`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: 'bold' }, color: '#4A6352' },
        border: { display: false },
      },
      y: {
        suggestedMax: 35,
        grid: { color: 'rgba(46, 125, 50, 0.08)' },
        ticks: {
          font: { size: 11 },
          color: '#718A7A',
          callback: (v) => `${v} jt`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="db-waste-hero-card">
      <div className="db-waste-header">
        <h2 className="db-waste-title">Timbulan Sampah Indonesia 2020-2026</h2>
        <p className="db-waste-subtitle">
          *2026 merupakan proyeksi berdasarkan tren data 2020-2025*
        </p>
      </div>

      <div className="db-waste-chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Year legend dots */}
      <div className="db-waste-year-legend">
        {YEARS.map((y, idx) => (
          <div key={y} className="legend-year-pill">
            <span className="year-dot" style={{ background: YEAR_COLORS[idx] }}></span>
            <span>{y}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard Component ──────────────────────────────────────────────────
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState('1 Pohon');

  useEffect(() => {
    fetchDashboard()
      .then((res) => setData(res.data))
      .catch(() => {
        // Fallback mock data when offline or backend mock
        setData({
          summary: {
            active_users: 9225,
            co2_reduction_ton: 0.12,
            co2_reduction_kg: 120,
            total_weight: 48,
            eco_credits: 919,
            tree_impact_display: 12,
          },
          waste_by_type: {
            organik: 19.2,
            plastik: 12.0,
            kertas: 7.2,
            kardus: 4.8,
            lainnya: 4.8,
          },
          user: { name: 'Sahabat Bumi' },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="db-layout-root">
        <Sidebar />
        <div className="db-loading-state">
          <div className="db-loading-spinner" />
          <p>Memuat dashboard Ecova…</p>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    active_users: 9225,
    co2_reduction_ton: 0.12,
    total_weight: 48,
    eco_credits: 919,
    tree_impact_display: 12,
  };

  const treeCount = summary.tree_impact_display || 12;
  const progressPercent = Math.min(Math.round((treeCount / TREE_TARGET) * 100), 100);

  // Donut Material Breakdown Chart Data
  const donutData = {
    labels: ['Sampah Organik', 'Plastik', 'Kertas/Karton', 'Kardus', 'Lainnya'],
    datasets: [
      {
        data: [40, 25, 15, 10, 10],
        backgroundColor: ['#2E7D32', '#144327', '#66BB6A', '#8D6E63', '#A5D6A7'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#144327',
        callbacks: {
          label: (c) => ` ${c.label}: ${c.raw}%`,
        },
      },
    },
  };

  return (
    <div className="db-layout-root">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <main className="db-main-content">
        {/* Top Big Chart: Timbulan Sampah 2020-2026 */}
        <IndonesiaWasteDualChart />

        {/* ── 3 Summary Metrics ── */}
        <div className="db-summary-triplet">
          {/* Card 1 */}
          <div className="db-triplet-card">
            <div className="triplet-header-row">
              <span className="triplet-tag">PARTISIPASI MASYARAKAT</span>
              <span className="triplet-icon-box">👥</span>
            </div>
            <div className="triplet-main-row">
              <span className="triplet-number">9.225 User Aktif</span>
              <span className="triplet-growth-badge">+8.4%</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="db-triplet-card">
            <div className="triplet-header-row">
              <span className="triplet-tag">PENGURANGAN EMISI CO₂</span>
              <span className="triplet-icon-box">🍃</span>
            </div>
            <div className="triplet-main-row">
              <span className="triplet-number">~138 Ton</span>
              <span className="triplet-growth-badge">+12%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="db-triplet-card">
            <div className="triplet-header-row">
              <span className="triplet-tag">SAMPAH DICEGAH KE LAUT</span>
              <span className="triplet-icon-box">🌊</span>
            </div>
            <div className="triplet-main-row">
              <span className="triplet-number">~461 Ton</span>
              <span className="triplet-growth-badge">+18%</span>
            </div>
          </div>
        </div>

        {/* ── Middle Row: Digital Forest & Tree Progress ── */}
        <div className="db-forest-row-grid">
          {/* Left Forest Visual Card */}
          <div className="db-digital-forest-card">
            <div className="forest-top-pill">
              <span className="pill-leaf-dot">🌱</span>
              Pertumbuhan 12.5 minggu ini
            </div>
            <h2 className="forest-headline">
              Your Digital Forest<br />is Blooming
            </h2>

            <div className="forest-translucent-boxes">
              <div className="translucent-stat-box">
                <span className="stat-label-small">PENGURANGAN CO₂</span>
                <strong className="stat-val-bold">0,12 Ton</strong>
              </div>
              <div className="translucent-stat-box">
                <span className="stat-label-small">SAMPAH TERKELOLA</span>
                <strong className="stat-val-bold">{summary.total_weight || 48} kg</strong>
              </div>
              <div className="translucent-stat-box">
                <span className="stat-label-small">ECO CREDITS</span>
                <strong className="stat-val-bold">{summary.eco_credits || 919}</strong>
              </div>
            </div>
          </div>

          {/* Right Tree Progress Card */}
          <div className="db-tree-target-card">
            <div className="tree-big-circle-icon">🍃</div>
            <div className="tree-big-number">{treeCount}</div>
            <span className="tree-unit-label">POHON YANG TERTANAM</span>

            <div className="tree-progress-track">
              <div
                className="tree-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="tree-progress-caption">
              {progressPercent}% menuju target {TREE_TARGET} pohon
            </p>
          </div>
        </div>

        {/* ── Row 3: Local Roots & Tanam Pohon Berikutnya ── */}
        <div className="db-roots-planting-grid">
          {/* Left: Local Roots */}
          <div className="db-local-roots-card">
            <div className="roots-tag-pill">
              <span>📍</span> LOCAL ROOTS
            </div>
            <div className="roots-big-count">{LOCAL_ROOTS_TOTAL.toLocaleString('id-ID')}</div>
            <p className="roots-description">
              Pohon yang ditanam oleh komunitas kami di seluruh Indonesia.
            </p>

            <div className="roots-meter-box">
              <div className="roots-donut-wrap">
                <svg viewBox="0 0 100 100" className="roots-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#D1E4CF" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="8"
                    strokeDasharray="238"
                    strokeDashoffset={238 - (238 * progressPercent) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="roots-meter-text">
                  <strong>{treeCount}</strong>
                  <small>Pohon</small>
                </div>
              </div>
              <div className="roots-meter-meta">
                <strong>Kontribusiku</strong>
                <p>Bagian dari restorasi ekosistem nasional</p>
              </div>
            </div>
          </div>

          {/* Right: Tanam Pohon Berikutnya */}
          <div className="db-planting-card">
            <h3 className="planting-card-title">Tanam Pohon Berikutnya</h3>
            <p className="planting-card-desc">
              Pilih paket donasi untuk mengimbangi jejak karbon kamu.
            </p>

            <div className="planting-pills-row">
              {PLANTING_PACKAGES.map((pkg) => (
                <button
                  key={pkg.label}
                  type="button"
                  className={`planting-pkg-pill ${selectedPkg === pkg.label ? 'active' : ''}`}
                  onClick={() => setSelectedPkg(pkg.label)}
                >
                  <span className="pkg-name">{pkg.label}</span>
                  <span className="pkg-cost">{pkg.price}</span>
                </button>
              ))}
            </div>

            <div className="planting-milestone-box">
              <div className="milestone-text-row">
                <span>Kemajuan Ke-{TREE_TARGET} Pohon</span>
                <strong>{treeCount}/{TREE_TARGET} Pohon</strong>
              </div>
              <div className="milestone-track">
                <div
                  className="milestone-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="milestone-footer-note">
                Setiap pohon ditanam di kawasan restorasi hutan terverifikasi KLHK.
              </p>
            </div>
          </div>
        </div>

        {/* ── Row 4: Analisis Dampak & Penghargaan ── */}
        <div className="db-analytics-badges-grid">
          {/* Left: Analisis Dampak */}
          <div className="db-analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-title">Analisis Dampak</h3>
              <button className="btn-timeframe-dropdown" type="button">
                Tampilan Bulanan ▾
              </button>
            </div>

            <div className="monthly-target-banner">
              <div className="target-text-row">
                <span>Target Bulanan</span>
                <strong>Pengalihan 20kg</strong>
              </div>
              <div className="target-bar-track">
                <div className="target-bar-fill" style={{ width: '60%' }} />
              </div>
              <p className="target-hint-text">
                12 kg didaur ulang bulan ini. Sisa 8 kg lagi untuk mencapai target!
              </p>
            </div>

            {/* Donut Chart & Materials Breakdown */}
            <div className="materials-breakdown-row">
              <div className="donut-chart-wrapper">
                <Doughnut data={donutData} options={donutOptions} />
                <div className="donut-center-overlay">
                  <span className="donut-total-label">TOTAL</span>
                  <strong className="donut-total-weight">{summary.total_weight || 48}kg</strong>
                </div>
              </div>

              <div className="materials-legend-column">
                <span className="material-legend-title">Top Materials</span>
                <div className="material-pill-item">
                  <span className="mat-dot" style={{ background: '#2E7D32' }}></span>
                  <span className="mat-name">Sampah Organik</span>
                  <span className="mat-pct">40%</span>
                </div>
                <div className="material-pill-item">
                  <span className="mat-dot" style={{ background: '#144327' }}></span>
                  <span className="mat-name">Plastik</span>
                  <span className="mat-pct">25%</span>
                </div>
                <div className="material-pill-item">
                  <span className="mat-dot" style={{ background: '#66BB6A' }}></span>
                  <span className="mat-name">Kertas/Karton</span>
                  <span className="mat-pct">15%</span>
                </div>
                <div className="material-pill-item">
                  <span className="mat-dot" style={{ background: '#8D6E63' }}></span>
                  <span className="mat-name">Kardus</span>
                  <span className="mat-pct">10%</span>
                </div>
                <div className="material-pill-item">
                  <span className="mat-dot" style={{ background: '#A5D6A7' }}></span>
                  <span className="mat-name">Lainnya</span>
                  <span className="mat-pct">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Penghargaan */}
          <div className="db-badges-award-card">
            <h3 className="badges-card-title">Penghargaan</h3>
            <div className="badges-vertical-list">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`badge-row-card ${badge.unlocked ? 'is-unlocked' : 'is-locked'}`}
                >
                  <div className="badge-symbol-box">{badge.icon}</div>
                  <div className="badge-meta-box">
                    <h4 className="badge-item-name">{badge.name}</h4>
                    <p className="badge-item-desc">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-view-all-badges"
              onClick={() => alert('Semua 12 lencana dapat dibuka melalui aksi daur ulang rutin!')}
            >
              Lihat semua badge →
            </button>
          </div>
        </div>

        {/* Global Footer */}
        <Footer />
      </main>
    </div>
  );
}