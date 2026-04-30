import { useState, useEffect, useRef } from 'react';
import { fetchDashboard } from '../services/api';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, RadialLinearScale, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, RadialLinearScale, ArcElement,
  Title, Tooltip, Legend, Filler
);

// ── Static constants ──────────────────────────────────────────────────────────
const LOCAL_ROOTS_TOTAL = 126700;
const TREE_TARGET = 16;

const BADGES = [
  { id: 1, name: 'Pelopor Ekologi',    desc: 'Bergabung sejak fase Alpha',              icon: '🌱', unlocked: true  },
  { id: 2, name: 'Penetral Karbon',    desc: 'Mengurangi lebih dari 1 ton CO₂',          icon: '✅', unlocked: true  },
  { id: 3, name: 'Maestro Marketplace',desc: 'Penjualan barang terlaris pertama berhasil',icon: '🛍', unlocked: true  },
  { id: 4, name: 'Penjaga Hutan',      desc: 'Tanam total 20 pohon',                     icon: '🔒', unlocked: false },
];

const PLANTING_PACKAGES = [
  { label: '1 Pohon', price: 'Rp 10.000' },
  { label: '3 Pohon', price: 'Rp 25.000' },
  { label: '7 Pohon', price: 'Rp 60.000' },
];

// ── Indonesia 2020–2025 waste data (SIPSN KLHK) ───────────────────────────────
const WASTE_YEARS   = ['2020', '2021', '2022', '2023', '2024', '2025'];
const WASTE_TOTAL   = [17.93, 29.44, 35.93, 41.0,  34.2,  25.14];
const WASTE_MANAGED = [11.7,  18.2,  22.45, 25.0,  20.7,  15.3 ];
const WASTE_PLASTIC = [2.85,  4.68,  6.45,  7.38,  6.72,  5.15 ];

const WASTE_COMP_2025 = [
  { label: 'Sisa Makanan', pct: 40.76, color: '#2d7a4f' },
  { label: 'Plastik',      pct: 20.49, color: '#4a9e6b' },
  { label: 'Kayu/Ranting', pct: 13.29, color: '#6dba8b' },
  { label: 'Kertas/Karton',pct: 11.25, color: '#8fcfa8' },
  { label: 'Logam',        pct:  3.05, color: '#b0d8be' },
  { label: 'Lainnya',      pct: 11.16, color: '#d1e8d9' },
];

const YEAR_COLORS = ['#c0e0cc','#9fd4b4','#6dba8b','#4a9e6b','#2d7a4f','#1a5c34'];

const CHART_TOOLTIP_OPTS = {
  backgroundColor: '#1a3c2a',
  titleFont: { family: "'DM Sans', sans-serif", size: 11 },
  bodyFont:  { family: "'DM Sans', sans-serif", size: 11 },
  padding: 10,
  cornerRadius: 8,
};

// ── IndonesiaWasteChart ───────────────────────────────────────────────────────
function IndonesiaWasteChart() {
  const [chartType, setChartType] = useState('bar');   // 'bar' | 'line' | 'multi'
  const [activeMetric, setActiveMetric] = useState('total');

  const metricMap = {
    total:   { data: WASTE_TOTAL,   color: '#2d7a4f', label: 'Total timbulan (jt ton)' },
    managed: { data: WASTE_MANAGED, color: '#4a9e6b', label: 'Terkelola (jt ton)'      },
    plastic: { data: WASTE_PLASTIC, color: '#1a5c34', label: 'Sampah plastik (jt ton)' },
  };

  const buildSingleDataset = () => {
    const m = metricMap[activeMetric];
    if (chartType === 'bar') {
      return {
        type: 'bar',
        label: m.label,
        data: m.data,
        backgroundColor: YEAR_COLORS,
        borderRadius: 6,
        borderSkipped: false,
      };
    }
    return {
      type: 'line',
      label: m.label,
      data: m.data,
      borderColor: m.color,
      backgroundColor: m.color + '22',
      borderWidth: 2.5,
      pointRadius: 5,
      pointBackgroundColor: YEAR_COLORS,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: true,
    };
  };

  const multiDatasets = [
    { type: 'bar',  label: 'Total timbulan', data: WASTE_TOTAL,   backgroundColor: '#2d7a4fcc', borderRadius: 5, borderSkipped: false },
    { type: 'bar',  label: 'Terkelola',      data: WASTE_MANAGED, backgroundColor: '#6dba8bcc', borderRadius: 5, borderSkipped: false },
    {
      type: 'line', label: 'Plastik', data: WASTE_PLASTIC,
      borderColor: '#1a5c34', backgroundColor: 'transparent',
      borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#1a5c34',
      pointBorderColor: '#fff', pointBorderWidth: 2, tension: 0.4,
    },
  ];

  const chartData = {
    labels: WASTE_YEARS,
    datasets: chartType === 'multi' ? multiDatasets : [buildSingleDataset()],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_OPTS,
        callbacks: { label: (c) => ` ${c.formattedValue} jt ton` },
      },
    },
    scales: {
      x: {
        ticks: { font: { family: "'DM Sans', sans-serif", size: 11 }, color: '#94a3b8' },
        grid:  { display: false },
        border:{ display: false },
      },
      y: {
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: '#94a3b8',
          callback: (v) => v + ' jt',
        },
        grid:  { color: 'rgba(0,0,0,0.05)' },
        border:{ display: false },
        suggestedMax: 45,
      },
    },
  };

  const legends = chartType === 'multi'
    ? [
        { color: '#2d7a4f', label: 'Total timbulan' },
        { color: '#6dba8b', label: 'Terkelola' },
        { color: '#1a5c34', label: 'Plastik (garis)' },
      ]
    : [{ color: metricMap[activeMetric].color, label: metricMap[activeMetric].label }];

  return (
    <div className="db-iw-card">
      <div className="db-iw-header">
        <div>
          <h2 className="db-iw-title">Tren sampah Indonesia 2020–2025</h2>
          <p className="db-iw-sub">Sumber: SIPSN · Kementerian Lingkungan Hidup dan Kehutanan</p>
        </div>
        <div className="db-iw-controls">
          {['bar','line','multi'].map((t) => (
            <button
              key={t}
              className={`db-ctrl-btn ${chartType === t ? 'active' : ''}`}
              onClick={() => setChartType(t)}
            >
              {t === 'bar' ? 'Batang' : t === 'line' ? 'Garis' : 'Multi'}
            </button>
          ))}
        </div>
      </div>

      {chartType !== 'multi' && (
        <div className="db-iw-metrics">
          {Object.entries(metricMap).map(([key, m]) => (
            <button
              key={key}
              className={`db-iw-metric ${activeMetric === key ? 'active' : ''}`}
              onClick={() => setActiveMetric(key)}
            >
              <span className="db-iw-metric__dot" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      )}

      <div className="db-iw-legend">
        {legends.map((l) => (
          <span key={l.label} className="db-iw-legend-item">
            <span className="db-iw-legend-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      <div className="db-iw-canvas-wrap">
        {(chartType === 'bar' || chartType === 'multi') ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="db-iw-comp">
        <p className="db-iw-comp-title">Komposisi jenis sampah 2025</p>
        {WASTE_COMP_2025.map((w) => (
          <div key={w.label} className="db-iw-comp-row">
            <span className="db-iw-comp-label">{w.label}</span>
            <div className="db-iw-comp-track">
              <div
                className="db-iw-comp-fill"
                style={{ width: `${w.pct}%`, background: w.color }}
              />
            </div>
            <span className="db-iw-comp-pct">{w.pct}%</span>
          </div>
        ))}
      </div>

      <p className="db-iw-note">
        *Variasi angka antar tahun karena perbedaan jumlah kab/kota pelapor. 2024: 317 kab/kota; 2025: 244 kab/kota.
      </p>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [data, setData]             = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [animIn, setAnimIn]         = useState(false);

  useEffect(() => {
    fetchDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat data dashboard.'))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setAnimIn(true), 50);
      });
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

  const { summary, monthly: monthlyRaw, waste_by_type, user } = data;
  const monthly = Array.isArray(monthlyRaw) ? monthlyRaw : [];
  const monthlyData = monthly.length > 0 ? monthly : [
  { month: 'Okt', weight: 12.4, co2: 8.2 },
  { month: 'Nov', weight: 18.7, co2: 12.4 },
  { month: 'Des', weight: 15.2, co2: 10.1 },
  { month: 'Jan', weight: 22.5, co2: 14.9 },
  { month: 'Feb', weight: 19.8, co2: 13.1 },
  { month: 'Mar', weight: 28.3, co2: 18.7 },
  { month: 'Apr', weight: 31.0, co2: 20.5 },
];

  const treeProgress = Math.min((summary.tree_impact_display / TREE_TARGET) * 100, 100);

  // Monthly impact chart
  const monthlyChartData = {
  labels: monthlyData.map((m) => m.month),
  datasets: [
    {
      label: 'Sampah (kg)',
      data: monthlyData.map((m) => m.weight ?? 0),
      backgroundColor: '#2d7a4fcc',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'CO₂ (kg)',
      data: monthlyData.map((m) => m.co2 ?? 0),
      type: 'line',
      borderColor: '#1a5c34',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#1a5c34',
      tension: 0.4,
    },
  ],
};

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...CHART_TOOLTIP_OPTS },
    },
    scales: {
      x: { ticks: { font: { size: 10 }, color: '#94a3b8' }, grid: { display: false }, border: { display: false } },
      y: { ticks: { font: { size: 10 }, color: '#94a3b8' }, grid: { color: 'rgba(0,0,0,0.05)' }, border: { display: false } },
    },
  };

  return (
    <div className="db-layout">
      <Sidebar />

      <main className={`db-main ${animIn ? 'db-main--in' : ''}`}>

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <h1 className="db-header__title">
              Selamat datang, {user?.name ?? 'Sahabat Bumi'} 👋
            </h1>
            <p className="db-header__sub">Ringkasan kontribusi lingkungan Anda hari ini</p>
          </div>
          <div className="db-header-badge">
            <span className="db-live-dot" />
            Data Terkini 2025
          </div>
        </div>

        {/* ── Indonesia Waste Chart ── */}
        <IndonesiaWasteChart />

        {/* ── Summary Cards ── */}
        <div className="db-cards-row">
          <div className="db-summary-card">
            <span className="db-summary-icon">👥</span>
            <div className="db-summary-val">{summary.active_users.toLocaleString()}</div>
            <div className="db-summary-label">Pengguna Aktif</div>
            <span className="db-summary-badge">↑ 8.4%</span>
          </div>
          <div className="db-summary-card">
            <span className="db-summary-icon">🌫</span>
            <div className="db-summary-val">
              {summary.co2_reduction_ton >= 1
                ? `${summary.co2_reduction_ton.toFixed(1)} Ton`
                : `${summary.co2_reduction_kg.toFixed(1)} kg`}
            </div>
            <div className="db-summary-label">CO₂ Dikurangi</div>
            <span className="db-summary-badge">↑ 12%</span>
          </div>
          <div className="db-summary-card">
            <span className="db-summary-icon">🌊</span>
            <div className="db-summary-val">~{(summary.total_weight * 9.6).toFixed(0)} kg</div>
            <div className="db-summary-label">Sampah Dicegah ke Laut</div>
            <span className="db-summary-badge">↑ 18%</span>
          </div>
        </div>

        {/* ── Digital Forest + Tree ── */}
        <div className="db-forest-row">
          <div className="db-forest-card">
            <div className="db-forest-card__overlay" />
            <div className="db-forest-card__content">
              <span className="db-forest-badge">🌿 Pertumbuhan: 12% minggu ini</span>
              <h2 className="db-forest-title">Your Digital Forest<br />is Blooming</h2>
              <div className="db-forest-stats">
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">Pengurangan CO₂</span>
                  <span className="db-forest-stat__value">{summary.co2_reduction_ton.toFixed(2)} Ton</span>
                </div>
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">Sampah Teralihkan</span>
                  <span className="db-forest-stat__value">{summary.total_weight} kg</span>
                </div>
                <div className="db-forest-stat">
                  <span className="db-forest-stat__label">Eco Credits</span>
                  <span className="db-forest-stat__value">{Math.round(summary.eco_credits)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="db-tree-card">
            <div className="db-tree-icon">🍃</div>
            <div className="db-tree-number">{summary.tree_impact_display}</div>
            <p className="db-tree-label">Pohon yang Tertanam</p>
            <div className="db-tree-bar-bg">
              <div className="db-tree-bar-fill" style={{ width: `${treeProgress}%` }} />
            </div>
            <p className="db-tree-target">{treeProgress.toFixed(0)}% menuju target {TREE_TARGET} pohon</p>
          </div>
        </div>

        {/* ── Local Roots + Planting ── */}
        <div className="db-roots-row">
          <div className="db-roots-card">
            <span className="db-roots-badge">🌿 Local Roots</span>
            <div className="db-roots-number">{LOCAL_ROOTS_TOTAL.toLocaleString('id-ID')}</div>
            <p className="db-roots-desc">Pohon yang ditanam oleh komunitas kami di seluruh Indonesia.</p>
            <div className="db-roots-contrib">
              <div className="db-roots-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none" stroke="#4a9e6b" strokeWidth="10"
                    strokeDasharray={`${treeProgress * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1.2s ease' }}
                  />
                </svg>
                <div className="db-roots-ring-label">
                  <span>{summary.tree_impact_display}</span>
                  <small>Pohon</small>
                </div>
              </div>
              <div>
                <p className="db-roots-contrib-title">Kontribusiku</p>
                <p className="db-roots-contrib-sub">{(100 - treeProgress).toFixed(0)}% lagi untuk mencapai targetmu</p>
              </div>
            </div>
          </div>

          <div className="db-plant-card">
            <h3 className="db-plant-title">Tanam Pohon Berikutnya</h3>
            <p className="db-plant-desc">Pilih jumlah donasi untuk mengimbangi jejak karbon kamu.</p>
            <div className="db-plant-packages">
              {PLANTING_PACKAGES.map((pkg) => (
                <button
                  key={pkg.label}
                  className={`db-plant-pkg ${selectedPkg === pkg.label ? 'db-plant-pkg--selected' : ''}`}
                  onClick={() => setSelectedPkg(pkg.label)}
                >
                  <span className="db-plant-pkg__label">{pkg.label}</span>
                  <span className="db-plant-pkg__price">{pkg.price}</span>
                </button>
              ))}
            </div>
            <div className="db-plant-progress">
              <div className="db-plant-progress__bar-bg">
                <div className="db-plant-progress__bar-fill" style={{ width: `${(summary.tree_impact_display / TREE_TARGET) * 100}%` }} />
              </div>
              <div className="db-plant-progress__info">
                <span>Kemajuan ke {TREE_TARGET} Pohon</span>
                <span>{summary.tree_impact_display}/{TREE_TARGET} Pohon</span>
              </div>
              <p className="db-plant-progress__note">
                Hanya {Math.max(TREE_TARGET - summary.tree_impact_display, 0)} pohon lagi untuk membuka lencana <strong>Penjaga Hutan!</strong>
              </p>
            </div>
            {selectedPkg && (
              <button className="db-plant-cta">
                Donasi {selectedPkg} Sekarang →
              </button>
            )}
          </div>
        </div>

        {/* ── Monthly Impact + Badges ── */}
        <div className="db-bottom-row">
          <div className="db-impact-card">
            <div className="db-impact-header">
              <h3 className="db-impact-title">Dampak Bulananku</h3>
              <div className="db-impact-legend">
                <span><span className="db-legend-sq" style={{ background: '#2d7a4f' }} />Sampah (kg)</span>
                <span><span className="db-legend-sq" style={{ background: '#1a5c34' }} />CO₂ (kg)</span>
              </div>
            </div>
            <div className="db-impact-canvas">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>

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
                  {b.unlocked && <span className="db-badge-check">✓</span>}
                </div>
              ))}
            </div>
            <button className="db-badges-gallery-btn">Lihat Semua Lencana →</button>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}