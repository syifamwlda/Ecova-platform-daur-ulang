// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatRupiah } from '../services/marketplaceApi';

const formatTanggal = () => {
  const now = new Date();
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,'0')}.${String(now.getMinutes()).padStart(2,'0')}`;
};

const SHIPPING_OPTIONS = [
  { id: 'regular', label: 'Regular', desc: 'Estimasi 2–3 hari', price: 12000 },
  { id: 'express', label: 'Express', desc: 'Estimasi 1 hari',   price: 25000 },
];

const PAYMENT_METHODS = {
  ewallet: ['DANA', 'OVO', 'GoPay'],
};

const ECO_POINTS = 2500;
const ECO_POINTS_VALUE = 2500; // 1 poin = Rp 1

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // State passed from Cart
  const cartItems  = location.state?.cartItems  || [];
  const subtotal   = location.state?.total      || 0;
  const itemCount  = location.state?.itemCount  || cartItems.length || 1;

  const [shipping,    setShipping]    = useState('regular');
  const [payment,     setPayment]     = useState('OVO');
  const [usePoints,   setUsePoints]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);

  const shippingCost  = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 12000;
  const ecoDiscount   = usePoints ? ECO_POINTS_VALUE : 0;
  const total         = subtotal + shippingCost - ecoDiscount;

  const handleBayar = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);

    const newTx = {
      id:      Date.now(),
      status:  'Diproses',
      nominal: total,
      metode:  `Bayar via ${payment}`,
      tujuan:  payment,
      tanggal: formatTanggal(),
    };

    navigate('/konfirmasi-pembayaran', { state: { transaction: newTx } });
  };

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={() => navigate('/cart')}>←</button>
        <div style={s.topBarBrand}>EcoMarket</div>
        <nav style={s.topNav}>
          <span style={s.topNavItem}>Shop</span>
          <span style={s.topNavItem}>Impact</span>
          <span style={{ ...s.topNavItem, ...s.topNavActive }}>Account</span>
        </nav>
        <div style={s.topBarRight}>
          <span style={s.topBarIcon}>🛒</span>
          <span style={s.topBarIcon}>🔔</span>
          <div style={s.avatar}>BS</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={s.body}>

        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.sideUser}>
            <div style={s.sideUserAvatar}>BS</div>
            <div>
              <div style={s.sideUserName}>Sustainability Steward</div>
              <div style={s.sideUserRole}>Gold Member</div>
            </div>
          </div>
          <nav style={s.sideNav}>
            {[
              { icon: '📋', label: 'Orders',      path: '/pesanan' },
              { icon: '🌿', label: 'Eco-Points',  path: '/eco-points' },
              { icon: '⚙️', label: 'Settings',    path: '/settings' },
              { icon: '❓', label: 'Support',     path: '/support' },
            ].map(item => (
              <button key={item.label} style={s.sideNavItem} onClick={() => navigate(item.path)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={s.sideImpact}>
            <div style={s.sideImpactLabel}>IMPACT STATUS</div>
            <button style={s.sideImpactBtn}>Carbon Report</button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={s.main}>
          <h1 style={s.pageTitle}>Konfirmasi Pesanan</h1>
          <p style={s.pageSubtitle}>Periksa kembali pesananmu sebelum melanjutkan ke pembayaran.</p>

          <div style={s.grid}>
            {/* ── Left column ── */}
            <div style={s.leftCol}>

              {/* Alamat Pengiriman */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardHeaderLeft}>
                    <span style={s.cardHeaderIcon}>📍</span>
                    <span style={s.cardHeaderTitle}>Alamat Pengiriman</span>
                  </div>
                  <button style={s.linkBtn}>Ubah Alamat</button>
                </div>
                <div style={s.addressBox}>
                  <div style={s.addressName}>Budi Santoso</div>
                  <div style={s.addressLine}>Jl. Kemuning Raya No. 42, Kelurahan Menteng, Jakarta Pusat, DKI Jakarta 10310</div>
                  <div style={s.addressPhone}>0812-3456-7890</div>
                </div>
              </div>

              {/* Pesanan Kamu */}
              <div style={s.card}>
                <div style={s.cardSimpleHeader}>Pesanan Kamu</div>
                {cartItems.length > 0 ? cartItems.map(item => (
                  <OrderItem key={item.id} item={item} />
                )) : (
                  // fallback preview item
                  <OrderItem item={{
                    image: 'https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=200&q=80',
                    brand: 'ECOCRAFT',
                    name:  'Tas Daur Ulang Plastik',
                    variant: 'Forest Green',
                    price: subtotal || 45000,
                    quantity: itemCount,
                  }} />
                )}
              </div>

              {/* Metode Pengiriman */}
              <div style={s.card}>
                <div style={s.cardSimpleHeader}>Metode Pengiriman</div>
                <div style={s.shippingOptions}>
                  {SHIPPING_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      style={{
                        ...s.shippingCard,
                        ...(shipping === opt.id ? s.shippingCardActive : {}),
                      }}
                      onClick={() => setShipping(opt.id)}
                    >
                      {shipping === opt.id && <span style={s.shippingCheck}>✓</span>}
                      <div style={s.shippingLabel}>{opt.label}</div>
                      <div style={s.shippingPrice}>{formatRupiah(opt.price)}</div>
                      <div style={s.shippingDesc}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eco Points Toggle */}
              <div style={s.ecoPointsCard}>
                <div style={s.ecoPointsLeft}>
                  <div style={s.ecoPointsIcon}>🌿</div>
                  <span style={s.ecoPointsText}>
                    Kamu punya <strong style={{ color: '#2d7a3a' }}>{ECO_POINTS.toLocaleString('id')} Poin</strong> dari hasil daur ulang.
                  </span>
                </div>
                <div
                  style={{ ...s.toggle, ...(usePoints ? s.toggleOn : {}) }}
                  onClick={() => setUsePoints(p => !p)}
                >
                  <div style={{ ...s.toggleKnob, ...(usePoints ? s.toggleKnobOn : {}) }} />
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div style={s.card}>
                <div style={s.cardSimpleHeader}>Metode Pembayaran</div>
                <div style={s.paymentLabel}>E-WALLET</div>
                <div style={s.paymentBtns}>
                  {PAYMENT_METHODS.ewallet.map(m => (
                    <button
                      key={m}
                      style={{
                        ...s.paymentBtn,
                        ...(payment === m ? s.paymentBtnActive : {}),
                      }}
                      onClick={() => setPayment(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div style={s.paymentLabel2}>LAINNYA</div>
                {['Transfer Bank', 'COD (Bayar di Tempat)'].map(m => (
                  <button
                    key={m}
                    style={{
                      ...s.paymentOther,
                      ...(payment === m ? s.paymentOtherActive : {}),
                    }}
                    onClick={() => setPayment(m)}
                  >
                    <span style={s.paymentOtherIcon}>{m.startsWith('Transfer') ? '🏦' : '💵'}</span>
                    <span style={s.paymentOtherLabel}>{m}</span>
                    <span style={s.paymentOtherArrow}>›</span>
                  </button>
                ))}
              </div>

            </div>

            {/* ── Right column: summary ── */}
            <div style={s.rightCol}>
              <div style={s.summaryCard}>
                <div style={s.summaryTitle}>Ringkasan Pembayaran</div>

                <div style={s.summaryRow}>
                  <span style={s.summaryRowLabel}>Harga Barang ({itemCount} item)</span>
                  <span style={s.summaryRowVal}>{formatRupiah(subtotal || 45000)}</span>
                </div>
                <div style={s.summaryRow}>
                  <span style={s.summaryRowLabel}>Biaya Pengiriman</span>
                  <span style={s.summaryRowVal}>{formatRupiah(shippingCost)}</span>
                </div>
                {usePoints && (
                  <div style={s.summaryRow}>
                    <span style={s.summaryRowLabel}>Diskon Eco-Poin</span>
                    <span style={{ ...s.summaryRowVal, color: '#c0392b' }}>- {formatRupiah(ecoDiscount)}</span>
                  </div>
                )}

                <div style={s.summaryDivider} />

                <div style={s.summaryTotal}>
                  <span>Total Tagihan</span>
                  <span style={s.summaryTotalVal}>{formatRupiah(total)}</span>
                </div>

                <button
                  style={{ ...s.bayarBtn, opacity: isLoading ? 0.7 : 1 }}
                  onClick={handleBayar}
                  disabled={isLoading}
                >
                  {isLoading ? '⟳ Memproses...' : 'Bayar Sekarang'}
                </button>

                <div style={s.secureNote}>
                  <span>🔒</span>
                  <span>TRANSAKSI AMAN DAN TERLINDUNGI</span>
                </div>
              </div>

              {/* Eco Impact */}
              <div style={s.ecoImpactCard}>
                <div style={s.ecoImpactTop}>
                  <span style={s.ecoImpactIcon}>🌱</span>
                  <div>
                    <div style={s.ecoImpactTitle}>ECO IMPACT</div>
                    <div style={s.ecoImpactDesc}>Pembelian ini menyelamatkan 2kg sampah plastik dari lautan.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Order Item sub-component ─────────────────────────────────────────────────
const OrderItem = ({ item }) => (
  <div style={si.wrap}>
    <div style={si.imgWrap}>
      <img src={item.image} alt={item.name} style={si.img} />
    </div>
    <div style={si.info}>
      <div style={si.brand}>{item.brand || 'ECOCRAFT'}</div>
      <div style={si.name}>{item.name}</div>
      {item.variant && <div style={si.variant}>Varian: {item.variant}</div>}
      <div style={si.price}>{formatRupiah(item.price)}</div>
    </div>
    <div style={si.qtyRow}>
      <button style={si.qtyBtn}>−</button>
      <span style={si.qtyVal}>{item.quantity || 1}</span>
      <button style={si.qtyBtn}>+</button>
    </div>
  </div>
);

const si = {
  wrap:   { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: '1px solid #f0f0e8' },
  imgWrap:{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f0f0e8', flexShrink: 0 },
  img:    { width: '100%', height: '100%', objectFit: 'cover' },
  info:   { flex: 1 },
  brand:  { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#2d7a3a', marginBottom: 2 },
  name:   { fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 },
  variant:{ fontSize: 12, color: '#888', marginBottom: 4 },
  price:  { fontSize: 15, fontWeight: 700, color: '#2d7a3a' },
  qtyRow: { display: 'flex', alignItems: 'center', border: '1.5px solid #e0e0d8', borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { width: 30, height: 30, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyVal: { width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh', backgroundColor: '#f5f5f0', fontFamily: '"DM Sans", "Segoe UI", sans-serif' },

  // Top bar
  topBar: { display: 'flex', alignItems: 'center', gap: 20, padding: '14px 40px', backgroundColor: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 },
  backBtn: { width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e0e0d8', background: '#fff', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  topBarBrand: { fontSize: 17, fontWeight: 800, color: '#1a4a2e', letterSpacing: '-0.5px' },
  topNav: { display: 'flex', gap: 28, marginLeft: 'auto' },
  topNavItem: { fontSize: 14, color: '#888', cursor: 'pointer', padding: '4px 0' },
  topNavActive: { color: '#1a4a2e', fontWeight: 600, borderBottom: '2px solid #1a4a2e' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 14 },
  topBarIcon: { fontSize: 18, cursor: 'pointer' },
  avatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1a4a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },

  // Body layout
  body: { display: 'flex', gap: 0 },

  // Sidebar
  sidebar: { width: 200, minHeight: 'calc(100vh - 65px)', backgroundColor: '#fff', borderRight: '1px solid #eee', padding: '24px 0', flexShrink: 0 },
  sideUser: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px 20px', borderBottom: '1px solid #f0f0e8', marginBottom: 12 },
  sideUserAvatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1a4a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  sideUserName: { fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 },
  sideUserRole: { fontSize: 11, color: '#888' },
  sideNav: { display: 'flex', flexDirection: 'column', padding: '0 0 20px' },
  sideNavItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', background: 'none', border: 'none', fontSize: 13, color: '#444', cursor: 'pointer', textAlign: 'left' },
  sideImpact: { margin: '16px 16px 0', backgroundColor: '#1a4a2e', borderRadius: 12, padding: '14px 16px' },
  sideImpactLabel: { fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  sideImpactBtn: { width: '100%', padding: '8px 0', backgroundColor: '#fff', color: '#1a4a2e', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' },

  // Main
  main: { flex: 1, padding: '32px 40px 60px' },
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' },
  pageSubtitle: { fontSize: 13, color: '#888', margin: '0 0 28px' },

  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 90 },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardHeaderLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  cardHeaderIcon: { fontSize: 16 },
  cardHeaderTitle: { fontSize: 15, fontWeight: 700, color: '#1a1a1a' },
  cardSimpleHeader: { fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 14 },
  linkBtn: { fontSize: 12, fontWeight: 600, color: '#2d7a3a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },

  // Address
  addressBox: { backgroundColor: '#f7f7f4', borderRadius: 10, padding: '14px 16px' },
  addressName: { fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  addressLine: { fontSize: 12, color: '#555', lineHeight: 1.55, marginBottom: 4 },
  addressPhone: { fontSize: 12, color: '#888' },

  // Shipping
  shippingOptions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  shippingCard: {
    padding: '14px 16px', backgroundColor: '#f7f7f4', border: '2px solid transparent',
    borderRadius: 12, cursor: 'pointer', textAlign: 'left', position: 'relative',
  },
  shippingCardActive: { borderColor: '#2d7a3a', backgroundColor: '#f0f9f2' },
  shippingCheck: { position: 'absolute', top: 10, right: 12, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2d7a3a', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  shippingLabel: { fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  shippingPrice: { fontSize: 14, fontWeight: 700, color: '#2d7a3a', marginBottom: 2 },
  shippingDesc: { fontSize: 11, color: '#888' },

  // Eco points toggle
  ecoPointsCard: { backgroundColor: '#fff', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  ecoPointsLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  ecoPointsIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1a4a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  ecoPointsText: { fontSize: 13, color: '#444', lineHeight: 1.4 },
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleOn: { backgroundColor: '#2d7a3a' },
  toggleKnob: { position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' },
  toggleKnobOn: { left: 23 },

  // Payment
  paymentLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#aaa', marginBottom: 10 },
  paymentLabel2: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#aaa', margin: '16px 0 10px' },
  paymentBtns: { display: 'flex', gap: 10 },
  paymentBtn: { flex: 1, padding: '11px 0', backgroundColor: '#f7f7f4', border: '2px solid transparent', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#555' },
  paymentBtnActive: { borderColor: '#2d7a3a', color: '#2d7a3a', backgroundColor: '#f0f9f2' },
  paymentOther: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '13px 14px', backgroundColor: '#f7f7f4', border: '2px solid transparent', borderRadius: 10, cursor: 'pointer', marginBottom: 8 },
  paymentOtherActive: { borderColor: '#2d7a3a', backgroundColor: '#f0f9f2' },
  paymentOtherIcon: { fontSize: 16 },
  paymentOtherLabel: { flex: 1, fontSize: 13, fontWeight: 600, color: '#1a1a1a', textAlign: 'left' },
  paymentOtherArrow: { fontSize: 16, color: '#bbb' },

  // Summary card
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: '22px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' },
  summaryTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 10 },
  summaryRowLabel: {},
  summaryRowVal: { fontWeight: 600, color: '#1a1a1a' },
  summaryDivider: { borderTop: '1px solid #f0f0e8', margin: '14px 0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 },
  summaryTotalVal: { fontSize: 22, fontWeight: 800, color: '#1a4a2e' },
  bayarBtn: { width: '100%', padding: '14px', backgroundColor: '#1a4a2e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  secureNote: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: '#aaa' },

  // Eco impact
  ecoImpactCard: { backgroundColor: '#f0f9f2', border: '1.5px solid #c8e6cc', borderRadius: 14, padding: '16px' },
  ecoImpactTop: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  ecoImpactIcon: { fontSize: 20, flexShrink: 0 },
  ecoImpactTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#2d7a3a', marginBottom: 4 },
  ecoImpactDesc: { fontSize: 12, color: '#555', lineHeight: 1.55 },
};