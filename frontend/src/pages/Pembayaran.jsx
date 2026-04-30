// src/pages/Pembayaran.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../services/wasteApi';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  { id: 1, status: 'Berhasil', nominal: 50000, metode: 'Tarik Saldo Ke DANA', tanggal: '13 Oktober 2025, 14.30' },
  { id: 2, status: 'Diproses', nominal: 100000, metode: 'Tarik Saldo Ke DANA', tanggal: '20 Oktober 2025, 14.30' },
  { id: 3, status: 'Berhasil', nominal: 550000, metode: 'Tarik Saldo Ke DANA', tanggal: '17 Oktober 2025, 14.30' },
];

const WITHDRAWAL_METHODS = [
  { id: 'ewallet', icon: '💸', label: 'E Wallet', desc: 'Dana, OVO, Gopay, Shopeepay' },
  { id: 'bank', icon: '🏦', label: 'Bank Transfer', desc: 'Bank BRI, BCA, Mandiri dll' },
  { id: 'voucher', icon: '🎟', label: 'Voucher Belanja', desc: 'Indomaret, Alfamart, Superindo' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Berhasil: { bg: '#e6f4ea', color: '#2d7a3a', dot: '#2d7a3a' },
    Diproses: { bg: '#fff3e0', color: '#e65c00', dot: '#e65c00' },
    Gagal: { bg: '#fdecea', color: '#c0392b', dot: '#c0392b' },
  };
  const style = map[status] || map['Diproses'];
  return (
    <span style={{ ...s.badge, backgroundColor: style.bg, color: style.color }}>
      <span style={{ ...s.dot, backgroundColor: style.dot }} />
      {status}
    </span>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTanggal = () => {
  const now = new Date();
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const tgl = now.getDate();
  const bln = bulan[now.getMonth()];
  const thn = now.getFullYear();
  const jam = String(now.getHours()).padStart(2, '0');
  const mnt = String(now.getMinutes()).padStart(2, '0');
  return `${tgl} ${bln} ${thn}, ${jam}.${mnt}`;
};

const METHOD_LABEL = {
  ewallet: 'Tarik Saldo Ke E-Wallet',
  bank: 'Tarik Saldo Ke Bank',
  voucher: 'Tukar Voucher Belanja',
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Pembayaran() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('ewallet');
  const [nominal, setNominal] = useState('');
  const [tujuan, setTujuan] = useState('0812367398');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [newRowId, setNewRowId] = useState(null);

  // Stats derived from transactions
  const totalSaldo = transactions
    .filter((t) => t.status === 'Berhasil')
    .reduce((sum, t) => sum + t.nominal, 0);
  const prosesCount = transactions.filter((t) => t.status === 'Diproses').length;
  const sampahTerkumpul = 12;

  // Read pending reward from exchange flow
  useEffect(() => {
    const pending = sessionStorage.getItem('pending_reward');
    if (pending) {
      setNominal(pending);
      sessionStorage.removeItem('pending_reward');
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

 const handleTarik = async () => {
  if (!nominal || parseInt(nominal) < 10000) {
    showToast('Nominal minimum Rp 10.000', 'error');
    return;
  }

  if (!tujuan) {
    showToast('Masukkan nomor tujuan', 'error');
    return;
  }

  setIsLoading(true);
  await new Promise((r) => setTimeout(r, 1400));

  const newTx = {
    id: Date.now(),
    status: 'Diproses',
    nominal: parseInt(nominal),
    metode: METHOD_LABEL[selectedMethod] || 'Penarikan',
    tujuan,
    tanggal: formatTanggal(),
    isNew: true,
  };

  setTransactions((prev) => [newTx, ...prev]);
  setNewRowId(newTx.id);

  setIsLoading(false);

  navigate('/konfirmasi-pembayaran', {
    state: {
      transaction: newTx,
    },
  });

    setIsLoading(false);
    showToast('Penarikan berhasil diproses! Status: Diproses');
    setNominal('');
  };

  return (
    <div style={s.page}>
      <Sidebar active="Pembayaran" />

      <main style={s.main}>
        {/* Toast */}
        {toast && (
          <div style={{ ...s.toast, backgroundColor: toast.type === 'error' ? '#c0392b' : '#2d7a3a' }}>
            {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
          </div>
        )}

        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.topLeft}>
            <div style={s.searchWrap}>
              <span style={s.searchIcon}>🔍</span>
              <input style={s.searchInput} placeholder="Cari transaksi..." />
            </div>
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

        {/* Hero banner */}
        <div style={s.heroBanner}>
          <div style={s.heroContent}>
            <h1 style={s.heroTitle}>Tukar Sampahmu Jadi<br />Uang</h1>
            <p style={s.heroDesc}>
              Ubah sampah yang kamu kumpulkan menjadi saldo nyata dengan<br />
              Proses yang mudah cepat dan transparan
            </p>
            <button style={s.heroCta} onClick={() => navigate('/pertukaran')}>
              Mulai Tukar Sekarang
            </button>
          </div>
          <div style={s.heroImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80"
              alt="Recycling"
              style={s.heroImg}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div style={s.statRow}>
          {[
            { label: 'TOTAL SAMPAH', value: formatRupiah(totalSaldo), sub: '↗ +Rp 5.000 Minggu Ini', icon: '♻️', iconBg: '#e6f4ea', iconColor: '#2d7a3a' },
            { label: 'SAMPAH TERKUMPUL', value: `${sampahTerkumpul}kg`, sub: '🎯 Target Bulan Ini 20kg', icon: '🗑️', iconBg: '#e6f4ea', iconColor: '#2d7a3a' },
            { label: 'PROSES', value: `${prosesCount} Transaksi`, sub: '⚠️ Sedang Verifikasi', icon: '🔄', iconBg: '#fff3e0', iconColor: '#e65c00', subColor: '#e65c00' },
          ].map((c) => (
            <div key={c.label} style={s.statCard}>
              <div style={s.statTop}>
                <div>
                  <div style={s.statLabel}>{c.label}</div>
                  <div style={s.statValue}>{c.value}</div>
                </div>
                <div style={{ ...s.statIcon, backgroundColor: c.iconBg }}>{c.icon}</div>
              </div>
              <div style={{ ...s.statSub, color: c.subColor || '#888' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Cara Kerja</h2>
          <p style={s.sectionDesc}>Hanya butuh 4 langkah ini untuk mulai menarik uang</p>
          <div style={s.howGrid}>
            {[
              { icon: '🗑️', title: 'Kumpul Sampah', desc: 'Pisahkan Sampah Anorganik Di Rumah Mu' },
              { icon: '📍', title: 'Datang Ke Lokasi', desc: 'Cari Drop Point Terdekat Dari Rumahmu' },
              { icon: '↔️', title: 'Datang Ke Lokasi', desc: 'Petugas Akan Scan Tas Digital Kamu' },
              { icon: '💰', title: 'Dapatkan Saldo', desc: 'Saldo Akan Masuk Ke Dompet Digital Mu Secara Instan' },
            ].map((item, i) => (
              <div key={i} style={s.howCard}>
                <div style={s.howIconWrap}>
                  <div style={s.howIcon}>{item.icon}</div>
                </div>
                <strong style={s.howTitle}>{item.title}</strong>
                <p style={s.howDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Withdrawal section */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Metode Penarikan</h2>
          <div style={s.withdrawRow}>
            {/* Left: methods */}
            <div style={s.methodsCol}>
              {WITHDRAWAL_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  style={{
                    ...s.methodCard,
                    ...(selectedMethod === m.id ? s.methodCardActive : {}),
                  }}
                >
                  <div style={s.methodIcon}>{m.icon}</div>
                  <div style={s.methodText}>
                    <div style={s.methodLabel}>{m.label}</div>
                    <div style={s.methodDesc}>{m.desc}</div>
                  </div>
                  {selectedMethod === m.id && (
                    <div style={s.methodCheck}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Right: form */}
            <div style={s.formCard}>
              <div style={s.formTitle}>Form Penarikan Saldo</div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>PILIH METODE</label>
                <select
                  style={s.select}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                >
                  <option value="0812367398">DANA (0812367398)</option>
                  <option value="0821000000">OVO (0821000000)</option>
                  <option value="08113456789">GoPay (08113456789)</option>
                </select>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>NOMINAL MIN RP 10.000</label>
                <div style={s.inputWrap}>
                  <span style={s.inputPrefix}>Rp</span>
                  <input
                    style={s.input}
                    type="number"
                    placeholder="0"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    min="10000"
                  />
                </div>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>NOMOR TUJUAN</label>
                <input
                  style={s.inputFull}
                  placeholder="Masukan Nomor Rekening Atau Nomor HP"
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                />
              </div>

              <button
                style={{ ...s.tarikBtn, opacity: isLoading ? 0.7 : 1 }}
                onClick={handleTarik}
                disabled={isLoading}
              >
                {isLoading ? '⟳ Memproses...' : 'Tarik Sekarang'}
              </button>
            </div>
          </div>
        </section>

        {/* Transaction history */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Riwayat Transaksi</h2>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['STATUS', 'NOMINAL', 'METODE', 'TANGGAL'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{
                    ...s.tr,
                    ...(newRowId === tx.id ? s.trNew : {}),
                  }}>
                    <td style={s.td}><StatusBadge status={tx.status} /></td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{formatRupiah(tx.nominal)}</td>
                    <td style={{ ...s.td, color: '#555' }}>{tx.metode}</td>
                    <td style={{ ...s.td, color: '#888', fontSize: 13 }}>{tx.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Impact CTA */}
        <section style={s.impactBanner}>
          <div style={s.impactContent}>
            <h2 style={s.impactTitle}>Gunakan Untuk Dampak</h2>
            <p style={s.impactDesc}>
              Ingin Buat Langkah Memajukan Lingkungan Yang Lebih Asri Dan Hijau ? Donasikan Hasil
              Membuang Sampah Mu Untuk Membuat Lingkungan Menjadi Lebih Asri Dan Bersih Untuk Penanaman Pohon
            </p>
            <button style={s.impactBtn}>Tanam Pohon Rp 10.000</button>
          </div>
          <div style={s.impactImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80"
              alt="Plant a tree"
              style={s.impactImg}
            />
          </div>
        </section>

        {/* Footer */}
        <footer style={s.footer}>
          <div style={s.footerTop}>
            <div style={s.footerBrand}>
              <div style={s.footerLogo}>Ecova</div>
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
            <span>© 2026 Ecova — From Waste to Impact  Built for a Greener Future</span>
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

  // Toast
  toast: {
    position: 'fixed', top: 20, right: 20, zIndex: 999,
    color: '#fff', padding: '12px 20px', borderRadius: 10,
    fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },

  // Top bar
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 0 24px',
  },
  topLeft: {},
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

  // Hero
  heroBanner: {
    backgroundColor: '#1a4a2e', borderRadius: 20, padding: '40px 48px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 28, overflow: 'hidden', position: 'relative',
  },
  heroContent: { flex: 1, zIndex: 1 },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.25 },
  heroDesc: { color: 'rgba(255,255,255,0.72)', fontSize: 13, margin: '0 0 24px', lineHeight: 1.7 },
  heroCta: {
    padding: '13px 28px', backgroundColor: '#fff', color: '#1a4a2e',
    border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
    display: 'inline-block',
  },
  heroImgWrap: {
    width: 200, height: 140, borderRadius: 14, overflow: 'hidden',
    flexShrink: 0, marginLeft: 32,
  },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },

  // Stats
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 },
  statCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  statLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#999', marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: 700, color: '#1a1a1a' },
  statIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  statSub: { fontSize: 12 },

  // Section
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' },
  sectionDesc: { color: '#888', fontSize: 13, margin: '0 0 20px' },

  // How it works
  howGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  howCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: '24px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
  },
  howIconWrap: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: '#e8f5eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
  },
  howIcon: {},
  howTitle: { fontSize: 14, color: '#1a1a1a', fontWeight: 600 },
  howDesc: { fontSize: 12, color: '#888', margin: 0, lineHeight: 1.55 },

  // Withdrawal
  withdrawRow: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' },
  methodsCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  methodCard: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
    backgroundColor: '#fff', border: '2px solid transparent', borderRadius: 14,
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  methodCardActive: { borderColor: '#2d7a3a', backgroundColor: '#f0f9f2' },
  methodIcon: { fontSize: 22, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9f2', borderRadius: 10 },
  methodText: { flex: 1 },
  methodLabel: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  methodDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  methodCheck: {
    width: 24, height: 24, borderRadius: '50%', backgroundColor: '#2d7a3a',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
  },

  formCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: '24px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  },
  formTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: '#999', marginBottom: 6 },
  select: {
    width: '100%', padding: '11px 14px', backgroundColor: '#f7f7f4',
    border: '1.5px solid #e8e8e0', borderRadius: 10, fontSize: 13, color: '#1a1a1a',
    outline: 'none', cursor: 'pointer',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    backgroundColor: '#f7f7f4', border: '1.5px solid #e8e8e0', borderRadius: 10, overflow: 'hidden',
  },
  inputPrefix: { padding: '11px 14px', fontSize: 13, color: '#888', borderRight: '1px solid #e8e8e0' },
  input: {
    flex: 1, padding: '11px 14px', border: 'none', backgroundColor: 'transparent',
    fontSize: 13, color: '#1a1a1a', outline: 'none',
  },
  inputFull: {
    width: '100%', padding: '11px 14px', backgroundColor: '#f7f7f4',
    border: '1.5px solid #e8e8e0', borderRadius: 10, fontSize: 13, color: '#1a1a1a',
    outline: 'none', boxSizing: 'border-box',
  },
  tarikBtn: {
    width: '100%', padding: '14px', backgroundColor: '#1a4a2e', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
    marginTop: 4,
  },

  // Table
  tableWrap: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 20px', fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
    color: '#999', textAlign: 'left', backgroundColor: '#fafaf7',
    borderBottom: '1px solid #f0f0e8',
  },
  tr: { borderBottom: '1px solid #f5f5ef', transition: 'background 0.8s' },
  trNew: { backgroundColor: '#e6f4ea', transition: 'background 0s' },
  td: { padding: '16px 20px', fontSize: 14, color: '#1a1a1a' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
  },
  dot: { width: 6, height: 6, borderRadius: '50%' },

  // Impact banner
  impactBanner: {
    backgroundColor: '#e8f0e8', borderRadius: 20, padding: '36px 48px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 48,
  },
  impactContent: { flex: 1, maxWidth: 520 },
  impactTitle: { fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' },
  impactDesc: { fontSize: 13, color: '#555', margin: '0 0 24px', lineHeight: 1.7 },
  impactBtn: {
    padding: '12px 24px', backgroundColor: '#b0c8b0', color: '#2d4a2d',
    border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  impactImgWrap: { width: 160, height: 120, borderRadius: 14, overflow: 'hidden', flexShrink: 0, marginLeft: 32 },
  impactImg: { width: '100%', height: '100%', objectFit: 'cover' },

  // Footer
  footer: { backgroundColor: '#182c13', borderRadius: 20, padding: '40px 48px 24px', color: '#fff' },
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