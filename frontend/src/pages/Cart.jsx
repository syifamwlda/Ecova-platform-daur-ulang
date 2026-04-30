// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  updateCartQty,
  removeFromCart,
  toggleCartItem,
  toggleAllCartItems,
  calcCartTotals,
  checkout,
  formatRupiah,
  getProducts,
} from '../services/marketplaceApi';

// ─── Cart Item Row ─────────────────────────────────────────────────────────────
const CartItem = ({ item, onToggle, onQtyChange, onRemove }) => (
  <div style={s.cartItem}>
    <div style={{ ...s.checkbox, ...(item.checked ? s.checkboxChecked : {}) }}
      onClick={() => onToggle(item.id)}>
      {item.checked && <span style={s.checkMark}>✓</span>}
    </div>
    <div style={s.itemImgWrap}>
      <img src={item.image} alt={item.name} style={s.itemImg} />
    </div>
    <div style={s.itemDetails}>
      <div style={s.itemName}>{item.name}</div>
      <div style={s.itemStock}>Dalam Persediaan</div>
      <div style={s.itemPrice}>{formatRupiah(item.price)}</div>
    </div>
    <div style={s.itemQtyRow}>
      <button style={s.qtyBtn} onClick={() => onQtyChange(item.id, item.quantity - 1)}>−</button>
      <span style={s.qtyVal}>{item.quantity}</span>
      <button style={s.qtyBtn} onClick={() => onQtyChange(item.id, item.quantity + 1)}>+</button>
    </div>
    <button style={s.removeBtn} onClick={() => onRemove(item.id)} title="Hapus">✕</button>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [includeDonation, setIncludeDonation] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCart(getCart());
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const { products } = await getProducts({});
      setRecommendations(
        (Array.isArray(products) ? products : [])
          .filter((p) => !getCart().find((c) => c.id === p.id))
          .slice(0, 3)
      );
    } catch {}
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = (newCart) => setCart([...newCart]);

  const handleToggle = (id) => refresh(toggleCartItem(id));
  const handleQty = (id, qty) => {
    if (qty < 1) return handleRemove(id);
    refresh(updateCartQty(id, qty));
  };
  const handleRemove = (id) => refresh(removeFromCart(id));
  const handleToggleAll = () => {
    const allChecked = cart.every((i) => i.checked);
    refresh(toggleAllCartItems(!allChecked));
  };

  const handleApplyCoupon = () => {
    const validCoupons = ['ECORUK10', 'HIJAU20', 'GRATIS'];
    if (validCoupons.includes(coupon.toUpperCase())) {
      setCouponApplied(true);
      setCouponError('');
      showToast('Kupon berhasil diterapkan!');
    } else {
      setCouponError('Kode kupon tidak valid');
      setCouponApplied(false);
    }
  };

  const handleCheckout = () => {
  const selected = cart.filter((i) => i.checked);
  if (selected.length === 0) {
    showToast('Pilih minimal 1 produk untuk checkout', 'error');
    return;
  }
  const subtotal = selected.reduce((sum, i) => sum + i.price * i.quantity, 0);
  navigate('/checkout', {
    state: {
      cartItems: selected,
      total:     subtotal,
      itemCount: selected.reduce((sum, i) => sum + i.quantity, 0),
    },
  });
};

  const totals = calcCartTotals(cart, includeDonation);
  const allChecked = cart.length > 0 && cart.every((i) => i.checked);

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...s.toast, backgroundColor: toast.type === 'error' ? '#c0392b' : '#2d7a3a' }}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={() => navigate('/marketplace')}>←</button>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input style={s.searchInput} placeholder="Cari produk..." />
        </div>
        <div style={s.topRight}>
          <span style={s.notifBtn}>🔔</span>
          <div style={s.cartIcon}>🛒</div>
          <div style={s.userText}>
            <div style={s.userName}>Budi Santoso</div>
            <div style={s.userEmail}>budisantoso@gmail.com</div>
          </div>
          <div style={s.avatar}>BS</div>
        </div>
      </div>

      <div style={s.content}>
        <h1 style={s.pageTitle}>Shopping Cart</h1>

        <div style={s.cartLayout}>
          {/* Left: items */}
          <div style={s.itemsCol}>
            {cart.length === 0 ? (
              <div style={s.emptyCart}>
                <div style={s.emptyIcon}>🛒</div>
                <p style={s.emptyText}>Keranjang kamu kosong</p>
                <button style={s.shopNowBtn} onClick={() => navigate('/marketplace')}>
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <>
                {/* Select all */}
                <div style={s.selectAllRow}>
                  <div style={{ ...s.checkbox, ...(allChecked ? s.checkboxChecked : {}) }}
                    onClick={handleToggleAll}>
                    {allChecked && <span style={s.checkMark}>✓</span>}
                  </div>
                  <span style={s.selectAllLabel}>Pilih Semua ({cart.length})</span>
                </div>

                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                    onQtyChange={handleQty}
                    onRemove={handleRemove}
                  />
                ))}
              </>
            )}
          </div>

          {/* Right: summary */}
          <div style={s.summaryCol}>
            <div style={s.summaryCard}>
              <div style={s.summaryTitle}>Rincian Biaya</div>

              {/* Coupon */}
              <div style={s.fieldLabel}>KODE KUPON</div>
              <div style={s.couponRow}>
                <input
                  style={s.couponInput}
                  placeholder="Masukkan Kode"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError(''); setCouponApplied(false); }}
                />
                <button style={s.couponBtn} onClick={handleApplyCoupon}>Gunakan</button>
              </div>
              {couponError && <div style={s.couponError}>{couponError}</div>}
              {couponApplied && <div style={s.couponSuccess}>✓ Kupon aktif</div>}
              <div style={s.lihatPenawaran}>Lihat Penawaran yang Tersedia</div>

              <div style={s.divider} />

              {/* Cost breakdown */}
              <div style={s.costRow}>
                <span>Barang-Barang ({totals.count})</span>
                <span>{formatRupiah(totals.subtotal)}</span>
              </div>
              <div style={s.costRow}>
                <span>Pengiriman ⓘ</span>
                <span style={{ color: '#2d7a3a', fontWeight: 600 }}>
                  {totals.shipping === 0 ? 'Gratis' : formatRupiah(totals.shipping)}
                </span>
              </div>
              <div style={s.costRow}>
                <span>Perkiraan Pajak</span>
                <span>{formatRupiah(totals.tax)}</span>
              </div>

              {/* Donation toggle */}
              <div style={s.donationBox}>
                <div
                  style={{ ...s.donationCheck, ...(includeDonation ? s.donationCheckActive : {}) }}
                  onClick={() => setIncludeDonation(!includeDonation)}
                >
                  {includeDonation && <span style={s.checkMark}>✓</span>}
                </div>
                <div>
                  <div style={s.donationTitle}>Ikut Donasi Tanam Pohon</div>
                  <div style={s.donationDesc}>
                    Tambah Rp 1.500 untuk dukung pengiriman hutan dan menetralisir polusi dari pengiriman paketmu
                  </div>
                </div>
              </div>

              <div style={s.divider} />

              {/* Total */}
              <div style={s.totalRow}>
                <span style={s.totalLabel}>SUB TOTAL</span>
                <span style={s.totalValue}>{formatRupiah(totals.total)}</span>
              </div>
              <div style={s.totalNote}>Pajak dan ongkos kirim sudah termasuk</div>

              <button
                style={{ ...s.checkoutBtn, opacity: isCheckingOut || totals.count === 0 ? 0.6 : 1 }}
                onClick={handleCheckout}
                disabled={isCheckingOut || totals.count === 0}
              >
                {isCheckingOut ? 'MEMPROSES...' : 'CHECK OUT'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={s.recoSection}>
            <div style={s.recoGrid}>
              {recommendations.map((p) => (
                <div key={p.id} style={s.recoCard} onClick={() => navigate(`/products/${p.id}`)}>
                  <div style={s.recoImgWrap}>
                    <img src={p.image} alt={p.name} style={s.recoImg} />
                  </div>
                  <div style={s.recoName}>{p.name}</div>
                  <div style={s.recoPrice}>{formatRupiah(p.price)}</div>
                </div>
              ))}
            </div>
            <div style={s.pagination}>
              <button style={s.pageBtn}>{'<'}</button>
              <button style={s.pageBtn}>{'>'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div>
            <div style={s.footerLogo}>Ecoruk</div>
            <p style={s.footerTagline}>Menghubungkan pengelolaan sampah dengan dampak nyata melalui inovasi, komunitas, dan aksi berkelanjutan untuk masa depan yang lebih hijau.</p>
            <div style={s.socials}>
              {['f', 'tt', 'x', 'ig', 'g'].map((x) => (
                <div key={x} style={s.socialIcon}>{x}</div>
              ))}
            </div>
          </div>
          {[
            { head: 'NAVIGASI', links: ['Waste Tracker', 'AI Recommendation', 'Eco Marketplace', 'Community'] },
            { head: 'IMPACT', links: ['Impact Dashboard', 'Tree Contribution', 'Eco Mission', 'Growth Tracker'] },
            { head: 'LEGAL', links: ['Privacy Policy', 'Terms of Use', 'Data Protection', 'Safety'] },
          ].map((col) => (
            <div key={col.head}>
              <div style={s.footerColHead}>{col.head}</div>
              {col.links.map((l) => <div key={l} style={s.footerLink}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={s.footerBottom}>
          <span>© 2026 Ecoruk — From Waste to Impact  Built for a Greener Future</span>
          <div style={{ display: 'flex', gap: 24 }}><span>DESIGN WITH PURPOSE</span><span>NEUTRAL ORIGIN</span></div>
        </div>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh', backgroundColor: '#f0efe8', fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 999, color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },

  topBar: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 40px', backgroundColor: '#f0efe8', position: 'sticky', top: 0, zIndex: 100 },
  backBtn: { width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #e0e0d8', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 24, padding: '10px 18px', flex: 1, maxWidth: 440 },
  searchIcon: { fontSize: 14, color: '#aaa' },
  searchInput: { border: 'none', outline: 'none', fontSize: 13, color: '#555', backgroundColor: 'transparent', width: '100%' },
  topRight: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
  notifBtn: { fontSize: 20 },
  cartIcon: { fontSize: 20 },
  userText: { textAlign: 'right' },
  userName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  userEmail: { fontSize: 11, color: '#888' },
  avatar: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1a4a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },

  content: { padding: '8px 40px 40px' },
  pageTitle: { fontSize: 28, fontWeight: 700, color: '#2d7a3a', margin: '0 0 24px' },

  cartLayout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start', marginBottom: 40 },
  itemsCol: { display: 'flex', flexDirection: 'column', gap: 12 },

  emptyCart: { backgroundColor: '#fff', borderRadius: 16, padding: '60px 0', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#888', fontSize: 15, margin: '0 0 20px' },
  shopNowBtn: { padding: '12px 28px', backgroundColor: '#1a4a2e', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' },

  selectAllRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  selectAllLabel: { fontSize: 13, fontWeight: 600, color: '#555' },

  cartItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px', backgroundColor: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  checkbox: { width: 22, height: 22, border: '2px solid #c8c8c0', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#2d7a3a', borderColor: '#2d7a3a' },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: 700 },
  itemImgWrap: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f0f0e8', flexShrink: 0 },
  itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 },
  itemStock: { fontSize: 12, color: '#888', marginBottom: 6 },
  itemPrice: { fontSize: 16, fontWeight: 700, color: '#2d7a3a' },
  itemQtyRow: { display: 'flex', alignItems: 'center', border: '1.5px solid #e0e0d8', borderRadius: 8, overflow: 'hidden' },
  qtyBtn: { width: 34, height: 34, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyVal: { width: 36, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  removeBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, padding: '4px', flexShrink: 0 },

  summaryCol: {},
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', position: 'sticky', top: 80 },
  summaryTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: '#999', marginBottom: 6 },
  couponRow: { display: 'flex', gap: 8, marginBottom: 4 },
  couponInput: { flex: 1, padding: '10px 12px', border: '1.5px solid #e0e0d8', borderRadius: 8, fontSize: 13, outline: 'none', color: '#1a1a1a' },
  couponBtn: { padding: '10px 16px', backgroundColor: '#2d7a3a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  couponError: { fontSize: 12, color: '#c0392b', marginBottom: 4 },
  couponSuccess: { fontSize: 12, color: '#2d7a3a', fontWeight: 600, marginBottom: 4 },
  lihatPenawaran: { fontSize: 12, color: '#2d7a3a', cursor: 'pointer', marginBottom: 16 },
  divider: { borderTop: '1px solid #f0f0e8', margin: '16px 0' },
  costRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 10 },
  donationBox: { display: 'flex', gap: 10, backgroundColor: '#f0f9f2', borderRadius: 10, padding: '12px', alignItems: 'flex-start', marginTop: 8 },
  donationCheck: { width: 22, height: 22, border: '2px solid #c8c8c0', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: '#fff', marginTop: 2 },
  donationCheckActive: { backgroundColor: '#2d7a3a', borderColor: '#2d7a3a' },
  donationTitle: { fontSize: 13, fontWeight: 700, color: '#1a4a2e', marginBottom: 4 },
  donationDesc: { fontSize: 11, color: '#666', lineHeight: 1.5 },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  totalLabel: { fontSize: 14, fontWeight: 700, color: '#1a1a1a' },
  totalValue: { fontSize: 20, fontWeight: 800, color: '#2d7a3a' },
  totalNote: { fontSize: 11, color: '#aaa', textAlign: 'right', marginBottom: 16 },
  checkoutBtn: { width: '100%', padding: '15px', backgroundColor: '#1a4a2e', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 1 },

  recoSection: { backgroundColor: '#e8f0e0', borderRadius: 20, padding: '24px', marginBottom: 40 },
  recoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 },
  recoCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  recoImgWrap: { backgroundColor: '#f0f0e8', height: 200 },
  recoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  recoName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a', padding: '10px 12px 4px' },
  recoPrice: { fontSize: 14, fontWeight: 700, color: '#2d7a3a', padding: '0 12px 12px' },
  pagination: { display: 'flex', justifyContent: 'center', gap: 8 },
  pageBtn: { width: 40, height: 40, border: '1.5px solid #c0c0b8', borderRadius: 8, backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  footer: { backgroundColor: '#111', padding: '40px 40px 24px', color: '#fff' },
  footerTop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  footerLogo: { fontSize: 20, fontWeight: 700, marginBottom: 14 },
  footerTagline: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 260 },
  socials: { display: 'flex', gap: 8 },
  socialIcon: { width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
  footerColHead: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 14 },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10, cursor: 'pointer' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)' },
};