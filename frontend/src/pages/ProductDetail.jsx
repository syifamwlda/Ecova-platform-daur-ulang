import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProducts, addToCart, formatRupiah } from '../services/marketplaceApi';
import Sidebar from '../components/Sidebar';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// const Sidebar = ({ active }) => {
//   const navigate = useNavigate();
//   const items = [
//     { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
//     { icon: '↔', label: 'Pertukaran', path: '/pertukaran' },
//     { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
//     { icon: '📋', label: 'Pesanan', path: '/pesanan' },
//     { icon: '💳', label: 'Pembayaran', path: '/pembayaran' },
//     { icon: '👤', label: 'Profil', path: '/profil' },
//   ];
//   return (
//     <aside style={s.sidebar}>
//       <div style={s.logo}>EcoRuk</div>
//       <nav style={s.nav}>
//         {items.map((item) => (
//           <button key={item.path} onClick={() => navigate(item.path)}
//             style={{ ...s.navItem, ...(active === item.label ? s.navItemActive : {}) }}>
//             <span style={s.navIcon}>{item.icon}</span>
//             <span>{item.label}</span>
//           </button>
//         ))}
//       </nav>
//       <button style={s.logoutBtn}>↩ Keluar</button>
//     </aside>
//   );
// };

// ─── Star Rating ──────────────────────────────────────────────────────────────
// FIX: Sebelumnya logika half-star pakai emoji ⭐ yang ga konsisten tampilannya
const Stars = ({ rating, size = 14 }) => (
  <span style={{ fontSize: size, color: '#f5a623', letterSpacing: 1 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i}>{i <= Math.round(rating) ? '★' : '☆'}</span>
    ))}
  </span>
);

// ─── Mock reviews ─────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  {
    id: 1,
    user: 'Uta Suruta',
    avatar: 'US',
    date: '16 Mar 2026',
    rating: 5,
    text: 'Produk ini menarik karena dibuat dari sampah organik yang didaur ulang, jadi selain menyuburkan tanaman juga membantu mengurangi limbah. Kemasannya pun terbilang eco-friendly dengan bahan yang terasa seperti plastik daur ulang bermotif warna-warni.',
    images: [],
  },
  {
    id: 2,
    user: 'Ahmad Dono',
    avatar: 'AD',
    date: '29 Feb 2026',
    rating: 5,
    text: 'Tanaman cabai saya jadi jauh lebih subur setelah selalu pakai pupuk ini. Teksturnya sangat bagus dan tidak berbau menyengat. Lihat perbandingannya setelah 2 minggu pemakaian!',
    images: [
      'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=120&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=120&q=80',
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);
  const [reviewTab, setReviewTab] = useState('helpful');

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const p = await getProduct(id);
      setProduct(p);
      const { products } = await getProducts({ category: p.category });
      setRelated((Array.isArray(products) ? products : []).filter((r) => r.id !== p.id).slice(0, 3));
    } catch {
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Tampilkan toast dulu, BARU navigate ke cart setelah 1 detik
  // Sebelumnya: addToCart dipanggil, lalu langsung navigate('/cart') — toast ga sempat keliatan
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      navigate('/cart');
    }, 1000);
  };

  if (loading) {
    return (
      <div style={s.page}>
        <Sidebar active="Marketplace" />
        <main style={s.main}>
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
          </div>
        </main>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div style={s.page}>
      <Sidebar active="Marketplace" />

      <main style={s.main}>
        {/* Toast — sekarang bisa terlihat karena navigate di-delay 1 detik */}
        {addedToast && (
          <div style={s.toast}>✓ Produk berhasil ditambahkan ke keranjang!</div>
        )}

        {/* Back button */}
        <button style={s.backBtn} onClick={() => navigate('/marketplace')}>
          ← Kembali ke Marketplace
        </button>

        {/* Product main area */}
        <div style={s.productLayout}>
          {/* Left: image */}
          <div style={s.imageCol}>
            <div style={s.imageWrap}>
              <img src={product.image} alt={product.name} style={s.productImg} />
            </div>
          </div>

          {/* Right: info */}
          <div style={s.infoCol}>
            {product.badge && <div style={s.badgePill}>{product.badge}</div>}
            <h1 style={s.productName}>{product.name}</h1>

            {/* Rating inline */}
            <div style={s.ratingRow}>
              <Stars rating={product.rating} />
              <span style={s.ratingText}>{product.rating} ({product.review_count} ulasan)</span>
            </div>

            <div style={s.productPrice}>{formatRupiah(product.price)}</div>

            {/* Eco badges */}
            <div style={s.ecoBadges}>
              <div style={s.ecoBadge}>
                <div style={s.ecoBadgeIcon}>♻</div>
                <div>
                  <div style={s.ecoBadgeTitle}>Kemasan Daur Ulang</div>
                  <div style={s.ecoBadgeDesc}>Karung dari plastik recycle & bisa dipakai ulang</div>
                </div>
              </div>
              <div style={s.ecoBadge}>
                <div style={s.ecoBadgeIcon}>🌿</div>
                <div>
                  <div style={s.ecoBadgeTitle}>Dari Sampah Organik</div>
                  <div style={s.ecoBadgeDesc}>Dibuat dari 10kg sampah dapur yang dialihkan dari TPA</div>
                </div>
              </div>
            </div>

            {/* Formula badge */}
            <div style={s.formulaBadge}>
              <span style={s.formulaCheck}>✓</span>
              Formula bebas bahan kimia
              <span style={s.formulaTag}>Tersertifikasi</span>
            </div>

            {/* Deskripsi */}
            <div style={s.descBox}>
              <div style={s.descTitle}>Deskripsi Produk</div>
              <p style={s.descText}>{product.description}</p>
            </div>

            {/* Qty selector */}
            <div style={s.qtyRow}>
              <span style={s.qtyLabel}>Jumlah:</span>
              <div style={s.qtyControl}>
                <button style={s.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={s.qtyValue}>{qty}</span>
                <button style={s.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={s.ctaRow}>
              <button style={s.addCartBtn} onClick={handleAddToCart}>
                🛒 Masukkan ke Keranjang
              </button>
              <button style={s.buyNowBtn} onClick={() => {
                addToCart(product, qty);
                navigate('/cart');
              }}>
                Beli Sekarang
              </button>
            </div>
            <div style={s.freeShipping}>🚚 Gratis ongkir untuk pembelian di atas Rp 200.000</div>
          </div>
        </div>

        {/* Kamu Mungkin Suka */}
        {related.length > 0 && (
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Kamu Mungkin Suka</h2>
            <div style={s.relatedGrid}>
              {related.map((p) => (
                <div key={p.id} style={s.relatedCard} onClick={() => navigate(`/products/${p.id}`)}>
                  <div style={s.relatedImgWrap}>
                    <img src={p.image} alt={p.name} style={s.relatedImg} />
                  </div>
                  <div style={s.relatedInfo}>
                    <div style={s.relatedName}>{p.name}</div>
                    <div style={s.relatedSeller}>{p.seller_name}</div>
                    <div style={s.relatedPrice}>
                      {formatRupiah(p.price)}{p.unit && p.unit !== 'pcs' ? ` / ${p.unit}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Penilaian & Ulasan */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Penilaian & Ulasan</h2>
          <div style={s.reviewLayout}>
            {/* Left: score */}
            <div style={s.scoreCol}>
              <div style={s.scoreBig}>{product.rating}<span style={s.scoreOf}>/5</span></div>
              <Stars rating={product.rating} size={20} />
              <div style={s.reviewCount}>({product.review_count} Ulasan)</div>
              <div style={s.ratingBars}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} style={s.ratingBarRow}>
                    <span style={s.ratingBarLabel}>★ {star}</span>
                    <div style={s.ratingBarTrack}>
                      <div style={{
                        ...s.ratingBarFill,
                        width: star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : '3%',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <button style={s.writeReviewBtn}>Tuliskan Ulasanmu</button>
            </div>

            {/* Right: reviews */}
            <div style={s.reviewsCol}>
              <div style={s.reviewTabs}>
                {['helpful', 'newest'].map((tab) => (
                  <button key={tab} onClick={() => setReviewTab(tab)}
                    style={{ ...s.reviewTab, ...(reviewTab === tab ? s.reviewTabActive : {}) }}>
                    {tab === 'helpful' ? 'Sangat Membantu' : 'Terbaru'}
                  </button>
                ))}
              </div>
              {MOCK_REVIEWS.map((r) => (
                <div key={r.id} style={s.reviewCard}>
                  <div style={s.reviewHeader}>
                    <div style={s.reviewAvatar}>{r.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={s.reviewUser}>{r.user}</div>
                      <Stars rating={r.rating} />
                    </div>
                    <div style={s.reviewDate}>{r.date}</div>
                  </div>
                  <p style={s.reviewText}>{r.text}</p>
                  {r.images.length > 0 && (
                    <div style={s.reviewImages}>
                      {r.images.map((img, i) => (
                        <img key={i} src={img} alt="" style={s.reviewImg} />
                      ))}
                    </div>
                  )}
                  <div style={s.reviewFooter}>
                    <span style={s.reviewAction}>👍 Membantu</span>
                    <span style={s.reviewAction}>🚩 Laporkan</span>
                  </div>
                </div>
              ))}
              <button style={s.lihatLainnya}>Lihat pengalaman lainnya</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={s.footer}>
          <div style={s.footerTop}>
            <div>
              <div style={s.footerLogo}>Ecova</div>
              <p style={s.footerTagline}>Menghubungkan pengelolaan sampah dengan dampak nyata melalui inovasi, komunitas, dan aksi berkelanjutan untuk masa depan yang lebih hijau.</p>
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
            <span>© 2026 Ecova — From Waste to Impact  Built for a Greener Future</span>
            <div style={{ display: 'flex', gap: 24 }}><span>DESIGN WITH PURPOSE</span><span>NEUTRAL ORIGIN</span></div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0efe8', fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  sidebar: { width: 220, minHeight: '100vh', backgroundColor: '#1a4a2e', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, flexShrink: 0 },
  logo: { color: '#fff', fontSize: 22, fontWeight: 700, padding: '0 24px 32px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 14, textAlign: 'left' },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  logoutBtn: { margin: '16px 24px 0', padding: '10px 16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 14, textAlign: 'left' },

  main: { flex: 1, padding: '24px 40px 60px', overflowY: 'auto' },
  loadingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 },
  spinner: { width: 36, height: 36, border: '3px solid #e0e0d8', borderTop: '3px solid #2d7a3a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  // FIX: toast sekarang muncul 1 detik sebelum navigate
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 999, backgroundColor: '#2d7a3a', color: '#fff', padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 },

  backBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, marginBottom: 24, padding: 0 },

  productLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48, backgroundColor: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' },
  imageCol: {},
  imageWrap: { backgroundColor: '#f0f0e8', borderRadius: 16, overflow: 'hidden', height: 380 },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: 14 },

  badgePill: { display: 'inline-block', backgroundColor: '#f0f9f2', border: '1px solid #2d7a3a', color: '#2d7a3a', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, width: 'fit-content' },
  productName: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.3 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 8 },
  ratingText: { fontSize: 13, color: '#888' },
  productPrice: { fontSize: 28, fontWeight: 800, color: '#1a1a1a' },

  ecoBadges: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  ecoBadge: { display: 'flex', gap: 10, backgroundColor: '#f0f9f2', borderRadius: 10, padding: '10px 12px', alignItems: 'flex-start' },
  ecoBadgeIcon: { fontSize: 20, flexShrink: 0 },
  ecoBadgeTitle: { fontSize: 12, fontWeight: 700, color: '#1a4a2e', marginBottom: 2 },
  ecoBadgeDesc: { fontSize: 11, color: '#666', lineHeight: 1.4 },

  formulaBadge: { display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f0f9f2', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#1a4a2e', fontWeight: 600 },
  formulaCheck: { color: '#2d7a3a', fontWeight: 700 },
  formulaTag: { marginLeft: 'auto', backgroundColor: '#2d7a3a', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 20 },

  descBox: { backgroundColor: '#f9f9f6', borderRadius: 12, padding: 16 },
  descTitle: { fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
  descText: { fontSize: 13, color: '#555', margin: 0, lineHeight: 1.7 },

  // FIX: qtyRow dipisah jadi label + control agar lebih jelas
  qtyRow: { display: 'flex', alignItems: 'center', gap: 12 },
  qtyLabel: { fontSize: 13, color: '#555', fontWeight: 600 },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e0e0d8', borderRadius: 10, overflow: 'hidden' },
  qtyBtn: { width: 44, height: 44, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { width: 48, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1a1a1a' },

  // FIX: Ditambahkan tombol "Beli Sekarang" di samping "Masukkan ke Keranjang"
  ctaRow: { display: 'flex', gap: 10 },
  addCartBtn: { flex: 1, padding: '15px', backgroundColor: '#1a4a2e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  buyNowBtn: { flex: 1, padding: '15px', backgroundColor: 'transparent', color: '#1a4a2e', border: '2px solid #1a4a2e', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  freeShipping: { fontSize: 12, color: '#888', textAlign: 'center' },

  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', textAlign: 'center' },

  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  relatedCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'transform 0.15s' },
  relatedImgWrap: { backgroundColor: '#f0f0e8', height: 180 },
  relatedImg: { width: '100%', height: '100%', objectFit: 'cover' },
  relatedInfo: { padding: '12px 14px 14px' },
  relatedName: { fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 },
  relatedSeller: { fontSize: 11, color: '#999', marginBottom: 4 },
  relatedPrice: { fontSize: 13, fontWeight: 700, color: '#2d7a3a' },

  reviewLayout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 },
  scoreCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  scoreBig: { fontSize: 56, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 },
  scoreOf: { fontSize: 20, fontWeight: 400, color: '#999' },
  reviewCount: { fontSize: 13, color: '#888' },
  ratingBars: { display: 'flex', flexDirection: 'column', gap: 6 },
  ratingBarRow: { display: 'flex', alignItems: 'center', gap: 8 },
  ratingBarLabel: { fontSize: 12, color: '#f5a623', width: 28, flexShrink: 0 },
  ratingBarTrack: { flex: 1, height: 6, backgroundColor: '#e8e8e0', borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: '#2d7a3a', borderRadius: 3 },
  writeReviewBtn: { padding: '10px 16px', backgroundColor: 'transparent', border: '1.5px solid #2d7a3a', color: '#2d7a3a', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  reviewsCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  reviewTabs: { display: 'flex', gap: 0, borderBottom: '2px solid #e8e8e0' },
  reviewTab: { padding: '10px 20px', background: 'none', border: 'none', fontSize: 13, color: '#888', cursor: 'pointer', fontWeight: 600 },
  reviewTabActive: { color: '#2d7a3a', borderBottom: '2px solid #2d7a3a', marginBottom: -2 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1a4a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  reviewUser: { fontSize: 13, fontWeight: 700, color: '#1a1a1a' },
  reviewDate: { fontSize: 11, color: '#aaa', marginLeft: 'auto' },
  reviewText: { fontSize: 13, color: '#555', margin: '0 0 10px', lineHeight: 1.7 },
  reviewImages: { display: 'flex', gap: 8, marginBottom: 10 },
  reviewImg: { width: 80, height: 80, borderRadius: 8, objectFit: 'cover' },
  reviewFooter: { display: 'flex', gap: 16 },
  reviewAction: { fontSize: 12, color: '#999', cursor: 'pointer' },
  lihatLainnya: { padding: '12px', backgroundColor: 'transparent', border: '1.5px solid #e0e0d8', color: '#555', borderRadius: 10, fontSize: 13, cursor: 'pointer', width: '100%' },

  footer: { backgroundColor: '#1f3e2d', borderRadius: 20, padding: '40px 48px 24px', color: '#fff' },
  footerTop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  footerLogo: { fontSize: 20, fontWeight: 700, marginBottom: 14 },
  footerTagline: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 260 },
  footerColHead: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 14 },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10, cursor: 'pointer' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)' },
};