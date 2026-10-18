// src/pages/KonfirmasiPembayaran.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatRupiah } from '../services/wasteAPI';

// ─── Sidebar (shared) ─────────────────────────────────────────────────────────
const Sidebar = ({ active }) => {
  const navigate = useNavigate();
  const items = [
    { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
    { icon: '↔', label: 'Pertukaran', path: '/pertukaran' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '📋', label: 'Pesanan', path: '/pesanan' },
    { icon: '💳', label: 'Pembayaran', path: '/pembayaran' },
    { icon: '👤', label: 'Profil', path: '/profil' },
  ];
  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>EcoRuk</div>
      <nav style={s.nav}>
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{ ...s.navItem, ...(active === item.label ? s.navItemActive : {}) }}
          >
            <span style={s.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button style={s.logoutBtn}>↩ Keluar</button>
    </aside>
  );
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Diproses: {
    icon: '🔄',
    iconBg: '#fff3e0',
    color: '#e65c00',
    badgeBg: '#fff3e0',
    ringColor: '#e65c00',
    title: 'Sedang Diproses',
    desc: 'Transaksi kamu sedang dalam tahap verifikasi. Biasanya membutuhkan waktu 1×24 jam.',
    progressStep: 1,
  },
  Berhasil: {
    icon: '✓',
    iconBg: '#e6f4ea',
    color: '#2d7a3a',
    badgeBg: '#e6f4ea',
    ringColor: '#2d7a3a',
    title: 'Transaksi Berhasil!',
    desc: 'Dana telah berhasil dikirimkan ke nomor tujuan kamu.',
    progressStep: 2,
  },
  Gagal: {
    icon: '✕',
    iconBg: '#fdecea',
    color: '#c0392b',
    badgeBg: '#fdecea',
    ringColor: '#c0392b',
    title: 'Transaksi Gagal',
    desc: 'Terjadi kesalahan saat memproses transaksi. Silakan coba lagi.',
    progressStep: 0,
  },
};

const PROGRESS_STEPS = ['Pengajuan', 'Verifikasi', 'Selesai'];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function KonfirmasiPembayaran() {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction;

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // trigger entrance animation
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Guard: no transaction state → redirect
  if (!transaction) {
    return (
      <div style={s.page}>
        <Sidebar active="Pembayaran" />
        <main style={s.main}>
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>Data transaksi tidak ditemukan.</p>
            <button style={s.btnPrimary} onClick={() => navigate('/pembayaran')}>
              Kembali ke Pembayaran
            </button>
          </div>
        </main>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[transaction.status] || STATUS_CONFIG['Diproses'];

  return (
    <div style={s.page}>
      <Sidebar active="Pembayaran" />

      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input style={s.searchInput} placeholder="Cari transaksi..." />
          </div>
          <div style={s.userInfo}>
            <span style={s.notifBtn}>🔔</span>
            <div style={s.userText}>
              <div style={s.userName}>Budi Santoso</div>
              <div style={s.userEmail}>budisantoso@gmail.com</div>
            </div>
            <div style={s.avatar}>BS</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={s.breadcrumb}>
          <span style={s.breadcrumbLink} onClick={() => navigate('/pembayaran')}>Pembayaran</span>
          <span style={s.breadcrumbSep}>›</span>
          <span style={s.breadcrumbCurrent}>Konfirmasi</span>
        </div>

        {/* Page title */}
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Konfirmasi Pembayaran</h1>
          <p style={s.pageSubtitle}>Detail transaksi penarikan saldo kamu</p>
        </div>

        <div
          style={{
            ...s.contentGrid,
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {/* ── Left column ── */}
          <div style={s.leftCol}>

            {/* Status Card */}
            <div style={s.statusCard}>
              {/* Animated ring */}
              <div
                style={{
                  ...s.statusRing,
                  borderColor: cfg.ringColor,
                  backgroundColor: cfg.iconBg,
                }}
              >
                <span style={{ ...s.statusIcon, color: cfg.color }}>{cfg.icon}</span>
              </div>

              <div style={{ ...s.statusBadge, backgroundColor: cfg.badgeBg, color: cfg.color }}>
                <span style={{ ...s.statusDot, backgroundColor: cfg.color }} />
                {transaction.status}
              </div>

              <h2 style={{ ...s.statusTitle, color: cfg.color }}>{cfg.title}</h2>
              <p style={s.statusDesc}>{cfg.desc}</p>

              {/* Progress bar */}
              <div style={s.progressWrap}>
                {PROGRESS_STEPS.map((step, i) => (
                  <div key={step} style={s.progressItem}>
                    <div
                      style={{
                        ...s.progressDot,
                        backgroundColor: i <= cfg.progressStep ? cfg.color : '#e0e0d8',
                        ...(i === cfg.progressStep ? s.progressDotActive : {}),
                      }}
                    >
                      {i < cfg.progressStep ? '✓' : i + 1}
                    </div>
                    <div
                      style={{
                        ...s.progressLabel,
                        color: i <= cfg.progressStep ? cfg.color : '#bbb',
                        fontWeight: i === cfg.progressStep ? 700 : 400,
                      }}
                    >
                      {step}
                    </div>
                    {i < PROGRESS_STEPS.length - 1 && (
                      <div
                        style={{
                          ...s.progressLine,
                          backgroundColor: i < cfg.progressStep ? cfg.color : '#e0e0d8',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Card */}
            <div style={s.detailCard}>
              <div style={s.detailHeader}>
                <span style={s.detailHeaderIcon}>📄</span>
                <span style={s.detailHeaderTitle}>Detail Transaksi</span>
              </div>

              <div style={s.detailDivider} />

              {[
                { label: 'ID Transaksi', value: `#TRX${String(transaction.id).slice(-8).toUpperCase()}` },
                { label: 'Metode', value: transaction.metode },
                { label: 'Nomor Tujuan', value: transaction.tujuan || '-' },
                { label: 'Tanggal', value: transaction.tanggal },
              ].map(({ label, value }) => (
                <div key={label} style={s.detailRow}>
                  <span style={s.detailLabel}>{label}</span>
                  <span style={s.detailValue}>{value}</span>
                </div>
              ))}

              <div style={s.detailDivider} />

              {/* Nominal highlight */}
              <div style={s.nominalRow}>
                <span style={s.nominalLabel}>Total Penarikan</span>
                <span style={{ ...s.nominalValue, color: cfg.color }}>
                  {formatRupiah(transaction.nominal)}
                </span>
              </div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div style={s.rightCol}>

            {/* Info card */}
            <div style={s.infoCard}>
              <div style={s.infoIconWrap}>
                <span style={s.infoIcon}>ℹ️</span>
              </div>
              <div>
                <div style={s.infoTitle}>Estimasi Waktu</div>
                <p style={s.infoDesc}>
                  {transaction.status === 'Berhasil'
                    ? 'Dana sudah masuk ke akun tujuan kamu.'
                    : 'Dana akan masuk dalam waktu 1–3 hari kerja setelah verifikasi selesai.'}
                </p>
              </div>
            </div>

            {/* Eco Impact card */}
            <div style={s.ecoCard}>
              <div style={s.ecoTop}>
                <span style={s.ecoEmoji}>🌱</span>
                <div style={s.ecoTextWrap}>
                  <div style={s.ecoTitle}>Dampak Lingkungan</div>
                  <div style={s.ecoDesc}>Dari transaksi daur ulang kamu</div>
                </div>
              </div>
              <div style={s.ecoStats}>
                <div style={s.ecoStat}>
                  <div style={s.ecoStatValue}>2 kg</div>
                  <div style={s.ecoStatLabel}>Sampah Terkelola</div>
                </div>
                <div style={s.ecoStatDivider} />
                <div style={s.ecoStat}>
                  <div style={s.ecoStatValue}>0.8 kg</div>
                  <div style={s.ecoStatLabel}>CO₂ Dikurangi</div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={s.ctaGroup}>
              <button style={s.btnPrimary} onClick={() => navigate('/pesanan')}>
                📋 Lihat Pesanan
              </button>
              <button style={s.btnSecondary} onClick={() => navigate('/marketplace')}>
                🛒 Kembali ke Marketplace
              </button>
              <button style={s.btnGhost} onClick={() => navigate('/pembayaran')}>
                ← Kembali ke Pembayaran
              </button>
            </div>

            {/* Security note */}
            <div style={s.secureNote}>
              <span style={s.secureIcon}>🔒</span>
              <span style={s.secureText}>Transaksi aman dan terlindungi oleh enkripsi SSL</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer style={s.footer}>
          <div style={s.footerTop}>
            <div style={s.footerBrand}>
              <div style={s.footerLogo}>Ecoruk</div>
              <p style={s.footerTagline}>
                Menghubungkan pengelolaan sampah dengan dampak nyata melalui
                inovasi, komunitas, dan aksi berkelanjutan untuk masa depan yang lebih hijau.
              </p>
              <div style={s.socials}>
                {['f', 'tt', 'x', 'ig', 'g'].map((s2) => (
                  <div key={s2} style={s.socialIcon}>{s2}</div>
                ))}
              </div>
            </div>
            {[
              { heading: 'NAVIGASI', links: ['Waste Tracker', 'AI Recommendation', 'Eco Marketplace', 'Community'] },
              { heading: 'IMPACT', links: ['Impact Dashboard', 'Tree Contribution', 'Eco Mission', 'Growth Tracker'] },
              { heading: 'LEGAL', links: ['Privacy Policy', 'Terms of Use', 'Data Protection', 'Safety'] },
            ].map((col) => (
              <div key={col.heading} style={s.footerCol}>
                <div style={s.footerColHead}>{col.heading}</div>
                {col.links.map((l) => (
                  <div key={l} style={s.footerLink}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={s.footerBottom}>
            <span>© 2026 Ecoruk — From Waste to Impact  Built for a Greener Future</span>
            <div style={s.footerBottomRight}>
              <span>DESIGN WITH PURPOSE</span>
              <span>NEUTRAL ORIGIN</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0efe8',
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
  },

  // Sidebar
  sidebar: {
    width: 220,
    minHeight: '100vh',
    backgroundColor: '#1a4a2e',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: 700, padding: '0 24px 32px', letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)',
    cursor: 'pointer', fontSize: 14, textAlign: 'left', transition: 'all 0.15s',
  },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  logoutBtn: {
    margin: '16px 24px 0', padding: '10px 16px', background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 14, textAlign: 'left',
  },

  // Main
  main: { flex: 1, padding: '0 40px 60px', overflowY: 'auto' },

  // Top bar
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 0 24px',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 10, padding: '10px 16px',
    width: 280, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  searchIcon: { fontSize: 14, color: '#aaa' },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13, color: '#555',
    backgroundColor: 'transparent', width: '100%',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  notifBtn: { fontSize: 18, cursor: 'pointer' },
  userText: { textAlign: 'right' },
  userName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  userEmail: { fontSize: 11, color: '#888' },
  avatar: {
    width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1a4a2e',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
  },

  // Breadcrumb
  breadcrumb: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: '#888', marginBottom: 16,
  },
  breadcrumbLink: { color: '#2d7a3a', cursor: 'pointer', fontWeight: 500 },
  breadcrumbSep: { color: '#ccc' },
  breadcrumbCurrent: { color: '#444' },

  // Page header
  pageHeader: { marginBottom: 28 },
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: 13, color: '#888', margin: 0 },

  // Content grid
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: 24,
    alignItems: 'start',
    marginBottom: 48,
  },

  leftCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },

  // Status card
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: '40px 36px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  statusRing: {
    width: 80, height: 80, borderRadius: '50%',
    border: '3px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0 0 0 8px rgba(0,0,0,0.04)',
  },
  statusIcon: { fontSize: 28, fontWeight: 700 },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    letterSpacing: 0.3, marginBottom: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: '50%' },
  statusTitle: { fontSize: 20, fontWeight: 700, margin: '0 0 8px' },
  statusDesc: { fontSize: 13, color: '#888', margin: '0 0 28px', lineHeight: 1.6, maxWidth: 360 },

  // Progress
  progressWrap: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    gap: 0, width: '100%', maxWidth: 320,
  },
  progressItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative',
  },
  progressDot: {
    width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6, zIndex: 1,
    transition: 'background 0.3s',
  },
  progressDotActive: {
    boxShadow: '0 0 0 4px rgba(45,122,58,0.18)',
  },
  progressLabel: { fontSize: 11, letterSpacing: 0.3 },
  progressLine: {
    position: 'absolute',
    top: 16, left: '50%', width: '100%', height: 2,
    zIndex: 0, transition: 'background 0.3s',
  },

  // Detail card
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: '28px 32px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  detailHeader: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
  },
  detailHeaderIcon: { fontSize: 18 },
  detailHeaderTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a' },
  detailDivider: { borderTop: '1px solid #f0f0e8', margin: '16px 0' },
  detailRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0',
  },
  detailLabel: { fontSize: 13, color: '#999' },
  detailValue: { fontSize: 13, fontWeight: 600, color: '#1a1a1a', textAlign: 'right', maxWidth: '60%' },
  nominalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  nominalLabel: { fontSize: 15, fontWeight: 700, color: '#1a1a1a' },
  nominalValue: { fontSize: 22, fontWeight: 800 },

  // Info card
  infoCard: {
    backgroundColor: '#f7f9f7',
    border: '1.5px solid #d4ebd8',
    borderRadius: 16, padding: '18px 20px',
    display: 'flex', gap: 14, alignItems: 'flex-start',
  },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#e6f4ea',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    fontSize: 16,
  },
  infoIcon: {},
  infoTitle: { fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  infoDesc: { fontSize: 12, color: '#666', lineHeight: 1.55, margin: 0 },

  // Eco card
  ecoCard: {
    backgroundColor: '#1a4a2e',
    borderRadius: 16, padding: '20px',
  },
  ecoTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  ecoEmoji: { fontSize: 22 },
  ecoTextWrap: {},
  ecoTitle: { fontSize: 13, fontWeight: 700, color: '#fff' },
  ecoDesc: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  ecoStats: {
    display: 'flex', gap: 0,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden',
  },
  ecoStat: {
    flex: 1, padding: '14px 16px', textAlign: 'center',
  },
  ecoStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  ecoStatValue: { fontSize: 18, fontWeight: 800, color: '#a8e6b8' },
  ecoStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2, letterSpacing: 0.3 },

  // CTA
  ctaGroup: { display: 'flex', flexDirection: 'column', gap: 10 },
  btnPrimary: {
    width: '100%', padding: '14px', backgroundColor: '#1a4a2e', color: '#fff',
    border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnSecondary: {
    width: '100%', padding: '13px', backgroundColor: '#fff', color: '#1a4a2e',
    border: '2px solid #1a4a2e', borderRadius: 12, fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnGhost: {
    width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#888',
    border: '1.5px solid #e0e0d8', borderRadius: 12, fontWeight: 500, fontSize: 13,
    cursor: 'pointer',
  },

  // Secure note
  secureNote: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontSize: 11, color: '#aaa', padding: '4px 0',
  },
  secureIcon: { fontSize: 12 },
  secureText: {},

  // Empty state
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: 16, textAlign: 'center',
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 15, color: '#888' },

  // Footer (shared with Pembayaran.jsx)
  footer: { backgroundColor: '#111', borderRadius: 20, padding: '40px 48px 24px', color: '#fff' },
  footerTop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  footerBrand: {},
  footerLogo: { fontSize: 20, fontWeight: 700, marginBottom: 14 },
  footerTagline: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 260 },
  socials: { display: 'flex', gap: 8 },
  socialIcon: {
    width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
  },
  footerCol: {},
  footerColHead: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 14 },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10, cursor: 'pointer' },
  footerBottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)',
  },
  footerBottomRight: { display: 'flex', gap: 24 },
};