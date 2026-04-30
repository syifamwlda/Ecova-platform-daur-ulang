// src/pages/Marketplace.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, formatRupiah, getCartCount } from '../services/marketplaceApi';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onClick }) => (
  <div style={s.productCard} onClick={() => onClick(product.id)}>
    <div style={s.productImgWrap}>
      <img src={product.image} alt={product.name} style={s.productImg} />
      {product.badge && <span style={s.productBadge}>{product.badge}</span>}
    </div>
    <div style={s.productInfo}>
      <div style={s.productName}>{product.name}</div>
      <div style={s.productSeller}>{product.seller_name}</div>
      <div style={s.productPrice}>
        {formatRupiah(product.price)}
        {product.unit && product.unit !== 'pcs' ? ` / ${product.unit}` : ''}
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: '', label: 'Semua', icon: '✦' },
  { key: 'plastik', label: 'Plastik', icon: '♻' },
  { key: 'tekstil', label: 'Tekstil', icon: '👕' },
  { key: 'organik', label: 'Organik', icon: '🌿' },
  { key: 'kardus', label: 'Kardus', icon: '📦' },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    loadFeatured();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadFeatured = async () => {
    try {
      const { products } = await getProducts({ featured: true });
      setFeatured(Array.isArray(products) ? products.slice(0, 3) : []);
    } catch {}
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { products } = await getProducts({ category: activeCategory || undefined });
      setProducts(Array.isArray(products) ? products : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { products } = await getProducts({ search });
      setProducts(Array.isArray(products) ? products : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <Sidebar active="Marketplace" />

      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topBar}>
          <form onSubmit={handleSearch} style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Cari produk eco-friendly..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div style={s.topRight}>
            <span style={s.notifBtn}>🔔</span>
            <div style={s.cartBtn} onClick={() => navigate('/cart')}>
              🛒
              {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
            </div>
            <div style={s.userText}>
              <div style={s.userName}>Budi Santoso</div>
              <div style={s.userEmail}>budisantoso@gmail.com</div>
            </div>
            <div style={s.avatar}>BS</div>
          </div>
        </div>

        {/* Hero Banner */}
        <div style={s.heroBanner}>
          <div style={s.heroOverlay} />
          <img
            src="https://i.ibb.co.com/xKzz0Zsm/Group-149-1.png"
            alt="Forest"
            style={s.heroBg}
          />
          <div style={s.heroContent}>
            <h1 style={s.heroTitle}>Belanja<br />Sekarang</h1>
            <p style={s.heroDesc}>
              Dari kerajinan plastik bekas hingga fashion<br />
              thrift, temukan produk ramah lingkungan dari<br />
              penjual lokal terverifikasi.
            </p>
          </div>

        </div>

        {/* Filter Berdasarkan Bahan */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Filter Berdasarkan Bahan</h2>
          <p style={s.sectionDesc}>Pilih bahan di atas untuk menemukan koleksi spesifik di arsip berkelanjutan kami</p>
          <div style={s.filterGrid}>
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(activeCategory === cat.key ? '' : cat.key)}
                style={{
                  ...s.filterCard,
                  ...(activeCategory === cat.key ? s.filterCardActive : {}),
                }}
              >
                <div style={s.filterIcon}>{cat.icon}</div>
                <div style={{ ...s.filterLabel, ...(activeCategory === cat.key ? { color: '#2d7a3a' } : {}) }}>
                  {cat.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Produk Unggulan */}
        {featured.length > 0 && (
          <section style={s.section}>
            <div style={s.sectionHeader}>
              <div>
                <h2 style={s.sectionTitle}>Produk Unggulan</h2>
                <p style={s.sectionDesc}>Barang berkualitas yang dibuat dari apa yang orang lain tinggalkan.</p>
              </div>
              <button style={s.lihatSemua} onClick={() => setActiveCategory('')}>
                Lihat Semua →
              </button>
            </div>
            <div style={s.featuredGrid}>
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onClick={(id) => navigate(`/products/${id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Grid Produk */}
        <section style={s.section}>
          {loading ? (
            <div style={s.loadingState}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={s.skeletonCard}>
                  <div style={s.skeletonImg} />
                  <div style={s.skeletonLine} />
                  <div style={{ ...s.skeletonLine, width: '60%' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>🌿</div>
              <p>Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div style={s.productGrid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onClick={(id) => navigate(`/products/${id}`)} />
              ))}
            </div>
          )}
        </section>

        {/* Circular Economy CTA */}
        <div style={s.ctaBanner}>
          <div style={s.ctaOverlay} />
          <img
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80"
            alt="Circular economy"
            style={s.ctaBg}
          />
          <div style={s.ctaContent}>
            <h2 style={s.ctaTitle}>Ekonomi Sirkular:<br />Sampah Jadi Karya</h2>
            <p style={s.ctaDesc}>
              Temukan bagaimana kami menutup siklus limbah.<br />
              Dari kayu palet bekas hingga plastik laut, setiap<br />
              produk di platform kami membawa kisah daur ulang<br />
              dan desain yang bermakna.
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}


// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { display: 'flex', minHeight: '100vh', backgroundColor: '#f0efe8', fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  sidebar: { width: 220, minHeight: '100vh', backgroundColor: '#1a4a2e', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, flexShrink: 0 },
  logo: { color: '#fff', fontSize: 22, fontWeight: 700, padding: '0 24px 32px', letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 14, textAlign: 'left' },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' },
  navIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  logoutBtn: { margin: '16px 24px 0', padding: '10px 16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 14, textAlign: 'left' },

  main: { flex: 1, padding: '0 40px 60px', overflowY: 'auto' },

  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 24px' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 24, padding: '10px 18px', width: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  searchIcon: { fontSize: 14, color: '#aaa' },
  searchInput: { border: 'none', outline: 'none', fontSize: 13, color: '#555', backgroundColor: 'transparent', width: '100%' },
  topRight: { display: 'flex', alignItems: 'center', gap: 12 },
  notifBtn: { fontSize: 20, cursor: 'pointer' },
  cartBtn: { position: 'relative', fontSize: 20, cursor: 'pointer' },
  cartBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#2d7a3a', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  userText: { textAlign: 'right' },
  userName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  userEmail: { fontSize: 11, color: '#888' },
  avatar: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1a4a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },

  heroBanner: { position: 'relative', borderRadius: 20, overflow: 'hidden', height: 240, marginBottom: 40, display: 'flex', alignItems: 'center' },
  heroBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(15,40,20,0.65)', zIndex: 1 },
  heroContent: { position: 'relative', zIndex: 2, padding: '0 48px', flex: 1 },
  heroTitle: { color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.15 },
  heroDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0, lineHeight: 1.7 },
  heroImgRight: { position: 'relative', zIndex: 2, width: 160, height: 200, marginRight: 48, flexShrink: 0 },
  heroPersonImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 },

  section: { marginBottom: 40 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' },
  sectionDesc: { color: '#888', fontSize: 13, margin: '0 0 20px' },
  lihatSemua: { background: 'none', border: 'none', color: '#2d7a3a', fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  filterCard: { backgroundColor: '#fff', border: '2px solid transparent', borderRadius: 16, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  filterCardActive: { borderColor: '#2d7a3a', backgroundColor: '#f0f9f2' },
  filterIcon: { fontSize: 32 },
  filterLabel: { fontSize: 15, fontWeight: 600, color: '#1a1a1a' },

  featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },

  productCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  productImgWrap: { position: 'relative', backgroundColor: '#f0f0e8', height: 160 },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  productBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#2d7a3a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 },
  productInfo: { padding: '12px 14px 14px' },
  productName: { fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 },
  productSeller: { fontSize: 11, color: '#999', marginBottom: 6 },
  productPrice: { fontSize: 14, fontWeight: 700, color: '#2d7a3a' },

  loadingState: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  skeletonCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', padding: '0 0 14px' },
  skeletonImg: { backgroundColor: '#e8e8e0', height: 160, marginBottom: 12 },
  skeletonLine: { backgroundColor: '#e8e8e0', height: 12, borderRadius: 6, margin: '8px 14px', width: '80%' },

  emptyState: { textAlign: 'center', padding: '60px 0', color: '#888' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },

  ctaBanner: { position: 'relative', borderRadius: 20, overflow: 'hidden', height: 320, marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ctaBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  ctaOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(10,30,15,0.78)', zIndex: 1 },
  ctaContent: { position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 48px' },
  ctaTitle: { color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 },
  ctaDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0, lineHeight: 1.8 },

  footer: { backgroundColor: '#111', borderRadius: 20, padding: '40px 48px 24px', color: '#fff' },
  footerTop: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  footerLogo: { fontSize: 20, fontWeight: 700, marginBottom: 14 },
  footerTagline: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 260 },
  socials: { display: 'flex', gap: 8 },
  socialIcon: { width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
  footerColHead: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', marginBottom: 14 },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10, cursor: 'pointer' },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.4)' },
};