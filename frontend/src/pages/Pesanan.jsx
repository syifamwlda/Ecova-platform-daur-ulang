// src/pages/Pesanan.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'ORD-20260429-001',
    date: '29 Apr 2026, 14:32',
    status: 'Selesai',
    metode: 'OVO',
    items: [
      { name: 'Botol PET Bersih', qty: 12, unit: 'kg', reward: 72000, img: '🧴' },
      { name: 'Kardus Bekas',     qty: 5,  unit: 'kg', reward: 15000, img: '📦' },
    ],
    total: 87000,
    co2: '1.2 kg',
    waste: '17 kg',
    noResi: 'ECO-4829-B',
    tujuan: '081234567890 (OVO)',
  },
  {
    id: 'ORD-20260428-002',
    date: '28 Apr 2026, 09:15',
    status: 'Diproses',
    metode: 'GoPay',
    items: [
      { name: 'Plastik Campur', qty: 8,  unit: 'kg', reward: 32000, img: '♻️' },
      { name: 'Serat Kertas',   qty: 10, unit: 'kg', reward: 30000, img: '📄' },
    ],
    total: 62000,
    co2: '0.9 kg',
    waste: '18 kg',
    noResi: 'ECO-4801-C',
    tujuan: '082199887766 (GoPay)',
  },
  {
    id: 'ORD-20260425-003',
    date: '25 Apr 2026, 16:50',
    status: 'Selesai',
    metode: 'Transfer Bank',
    items: [
      { name: 'Alumunium Bekas', qty: 3, unit: 'kg', reward: 36000, img: '🔩' },
    ],
    total: 36000,
    co2: '0.5 kg',
    waste: '3 kg',
    noResi: 'ECO-4773-A',
    tujuan: 'BCA - 1234567890',
  },
  {
    id: 'ORD-20260420-004',
    date: '20 Apr 2026, 11:00',
    status: 'Gagal',
    metode: 'DANA',
    items: [
      { name: 'Botol PET Bersih', qty: 6, unit: 'kg', reward: 36000, img: '🧴' },
    ],
    total: 36000,
    co2: '0 kg',
    waste: '0 kg',
    noResi: 'ECO-4744-X',
    tujuan: '089900112233 (DANA)',
  },
  {
    id: 'ORD-20260415-005',
    date: '15 Apr 2026, 08:20',
    status: 'Selesai',
    metode: 'OVO',
    items: [
      { name: 'Kardus Bekas',  qty: 20, unit: 'kg', reward: 60000, img: '📦' },
      { name: 'Serat Kertas',  qty: 8,  unit: 'kg', reward: 24000, img: '📄' },
      { name: 'Plastik Campur',qty: 4,  unit: 'kg', reward: 16000, img: '♻️' },
    ],
    total: 100000,
    co2: '2.1 kg',
    waste: '32 kg',
    noResi: 'ECO-4711-S',
    tujuan: '081234567890 (OVO)',
  },
];

const STATUS_STYLE = {
  Selesai:  { bg:'#e8f4ea', color:'#2d7a3a', dot:'#2d7a3a' },
  Diproses: { bg:'#fff3e0', color:'#e65c00', dot:'#e65c00' },
  Gagal:    { bg:'#fdecea', color:'#c0392b', dot:'#c0392b' },
};

const FILTERS = ['Semua', 'Selesai', 'Diproses', 'Gagal'];

// ─── formatRupiah ─────────────────────────────────────────────────────────────
const fRp = (n) =>
  'Rp ' + Number(n).toLocaleString('id-ID');

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, expanded, onToggle }) => {
  const st = STATUS_STYLE[order.status] || STATUS_STYLE.Diproses;
  const navigate = useNavigate();

  return (
    <div style={{ ...S.orderCard, borderLeft: `4px solid ${st.dot}` }}>
      {/* Header row */}
      <div style={S.orderHead} onClick={onToggle}>
        <div style={{ display:'flex', alignItems:'center', gap:14, flex:1, minWidth:0 }}>
          <div style={{ ...S.orderIcon, backgroundColor: st.bg, color: st.dot }}>📋</div>
          <div style={{ minWidth:0 }}>
            <div style={S.orderId}>{order.id}</div>
            <div style={S.orderDate}>{order.date}</div>
          </div>
        </div>

        <div style={S.orderMeta}>
          {/* Status badge */}
          <span style={{ ...S.statusBadge, backgroundColor: st.bg, color: st.color }}>
            <span style={{ ...S.statusDot, backgroundColor: st.dot }} />
            {order.status}
          </span>

          {/* Metode */}
          <span style={S.metodeBadge}>{order.metode}</span>

          {/* Total */}
          <span style={{ ...S.orderTotal, color: st.dot }}>{fRp(order.total)}</span>

          {/* Chevron */}
          <span style={{ ...S.chevron, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={S.orderBody}>
          <div style={S.orderDivider} />

          {/* Items */}
          <div style={S.itemsGrid}>
            {order.items.map((it, idx) => (
              <div key={idx} style={S.itemRow}>
                <div style={S.itemEmoji}>{it.img}</div>
                <div style={{ flex:1 }}>
                  <div style={S.itemName}>{it.name}</div>
                  <div style={S.itemMeta}>{it.qty} {it.unit}</div>
                </div>
                <div style={{ ...S.itemReward, color: st.dot }}>{fRp(it.reward)}</div>
              </div>
            ))}
          </div>

          <div style={S.orderDivider} />

          {/* Detail info grid */}
          <div style={S.detailInfoGrid}>
            <div style={S.detailBlock}>
              <div style={S.detailBlockLabel}>No. Resi</div>
              <div style={S.detailBlockValue}>{order.noResi}</div>
            </div>
            <div style={S.detailBlock}>
              <div style={S.detailBlockLabel}>Tujuan Pembayaran</div>
              <div style={S.detailBlockValue}>{order.tujuan}</div>
            </div>
            <div style={S.detailBlock}>
              <div style={S.detailBlockLabel}>Sampah Terkelola</div>
              <div style={{ ...S.detailBlockValue, color:'#2d7a3a' }}>♻ {order.waste}</div>
            </div>
            <div style={S.detailBlock}>
              <div style={S.detailBlockLabel}>CO₂ Dikurangi</div>
              <div style={{ ...S.detailBlockValue, color:'#2d7a3a' }}>🌱 {order.co2}</div>
            </div>
          </div>

          <div style={S.orderDivider} />

          {/* Footer row */}
          <div style={S.orderFooter}>
            <div style={S.totalRow}>
              <span style={{ fontSize:13, color:'#888' }}>Total Reward Diterima</span>
              <span style={{ fontSize:18, fontWeight:800, color: st.dot }}>{fRp(order.total)}</span>
            </div>

            <div style={S.actionBtns}>
              {order.status === 'Selesai' && (
                <button style={S.btnDownload}>⬇ Unduh Bukti</button>
              )}
              {order.status === 'Gagal' && (
                <button
                  style={S.btnRetry}
                  onClick={() => navigate('/pembayaran')}
                >
                  ↺ Coba Lagi
                </button>
              )}
              {order.status === 'Diproses' && (
                <button
                  style={S.btnDetail}
                  onClick={() => navigate('/konfirmasi-pembayaran', {
                    state: {
                      transaction: {
                        id: order.id,
                        status: 'Diproses',
                        metode: order.metode,
                        tujuan: order.tujuan,
                        tanggal: order.date,
                        nominal: order.total,
                      }
                    }
                  })}
                >
                  → Lihat Konfirmasi
                </button>
              )}
              <button style={S.btnGhost}>📋 Detail Lengkap</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = ({ orders }) => {
  const done  = orders.filter(o => o.status === 'Selesai').length;
  const proc  = orders.filter(o => o.status === 'Diproses').length;
  const fail  = orders.filter(o => o.status === 'Gagal').length;
  const total = orders.filter(o => o.status === 'Selesai').reduce((a,b) => a + b.total, 0);
  const waste = orders.filter(o => o.status === 'Selesai').reduce((a,b) => a + parseFloat(b.waste), 0);

  const stats = [
    { label:'Total Pesanan', value: orders.length, sub:'semua waktu', icon:'📋', color:'#1a4a2e' },
    { label:'Berhasil',      value: done,            sub:'transaksi',  icon:'✓',  color:'#2d7a3a' },
    { label:'Diproses',      value: proc,            sub:'menunggu',   icon:'⟳',  color:'#e65c00' },
    { label:'Total Reward',  value: fRp(total),       sub:'diterima',   icon:'💰', color:'#2d7a3a' },
    { label:'Sampah Kelola', value: `${waste} kg`,   sub:'CO₂ saved',  icon:'♻', color:'#2d7a3a' },
  ];

  return (
    <div style={S.statsBar}>
      {stats.map((st, i) => (
        <div key={i} style={S.statCard}>
          <div style={{ ...S.statIcon, color: st.color }}>{st.icon}</div>
          <div style={{ ...S.statValue, color: st.color }}>{st.value}</div>
          <div style={S.statLabel}>{st.label}</div>
          <div style={S.statSub}>{st.sub}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Pesanan() {
  const [filter,   setFilter]   = useState('Semua');
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = MOCK_ORDERS
    .filter(o => filter === 'Semua' || o.status === filter)
    .filter(o =>
      search === '' ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.metode.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(it => it.name.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .order-card-enter { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      <Sidebar />

      <main style={S.main}>
        {/* Top bar */}
        <div style={S.topBar}>
          <div style={S.searchWrap}>
            <span style={{ fontSize:14, color:'#aaa' }}>🔍</span>
            <input
              style={S.searchInput}
              placeholder="Cari ID pesanan, metode, atau jenis sampah..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:14, padding:0 }}
                onClick={() => setSearch('')}
              >✕</button>
            )}
          </div>
          <div style={S.userInfo}>
            <span style={{ fontSize:18, cursor:'pointer' }}>🔔</span>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#1a1a1a' }}>Budi Santoso</div>
              <div style={{ fontSize:11, color:'#888' }}>budisantoso@gmail.com</div>
            </div>
            <div style={S.avatar}>BS</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={S.breadcrumb}>
          <span style={S.breadcrumbLink}>Dashboard</span>
          <span style={S.breadcrumbSep}>›</span>
          <span style={S.breadcrumbCurrent}>Pesanan</span>
        </div>

        {/* Page header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={S.pageTitle}>Riwayat Pesanan</h1>
          <p style={S.pageDesc}>Pantau semua transaksi dan status pengiriman reward kamu</p>
        </div>

        {/* Stats */}
        <StatsBar orders={MOCK_ORDERS} />

        {/* Filter tabs */}
        <div style={S.filterRow}>
          <div style={S.filterTabs}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ ...S.filterTab, ...(filter === f ? S.filterTabOn : {}) }}
              >
                {f}
                <span style={{
                  ...S.filterCount,
                  backgroundColor: filter === f ? '#1a4a2e' : '#e8e8e0',
                  color: filter === f ? '#fff' : '#888',
                }}>
                  {f === 'Semua'
                    ? MOCK_ORDERS.length
                    : MOCK_ORDERS.filter(o => o.status === f).length}
                </span>
              </button>
            ))}
          </div>

          <div style={S.sortWrap}>
            <span style={{ fontSize:12, color:'#aaa' }}>Urutkan:</span>
            <select style={S.sortSelect}>
              <option>Terbaru</option>
              <option>Terlama</option>
              <option>Terbesar</option>
            </select>
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
            <div style={{ fontSize:16, fontWeight:600, color:'#444', marginBottom:6 }}>
              Tidak ada pesanan ditemukan
            </div>
            <div style={{ fontSize:13, color:'#aaa' }}>
              {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada pesanan dengan status ini'}
            </div>
          </div>
        ) : (
          <div style={S.orderList}>
            {filtered.map((order, idx) => (
              <div
                key={order.id}
                style={{ animation:`fadeUp 0.3s ease ${idx * 0.05}s forwards`, opacity:0 }}
              >
                <OrderCard
                  order={order}
                  expanded={expanded === order.id}
                  onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Eco summary banner */}
        <div style={S.ecoBanner}>
          <div style={S.ecoBannerLeft}>
            <div style={S.ecoBannerIcon}>🌳</div>
            <div>
              <div style={S.ecoBannerTitle}>Kontribusi Lingkunganmu</div>
              <div style={S.ecoBannerDesc}>
                Berkat aktivitasmu, kamu telah mengelola sampah dan mengurangi emisi karbon secara nyata.
              </div>
            </div>
          </div>
          <div style={S.ecoBannerStats}>
            <div style={S.ecoBannerStat}>
              <div style={S.ecoBannerStatVal}>52 kg</div>
              <div style={S.ecoBannerStatLbl}>Sampah Terkelola</div>
            </div>
            <div style={S.ecoBannerStatDivider} />
            <div style={S.ecoBannerStat}>
              <div style={S.ecoBannerStatVal}>4.8 kg</div>
              <div style={S.ecoBannerStatLbl}>CO₂ Dikurangi</div>
            </div>
            <div style={S.ecoBannerStatDivider} />
            <div style={S.ecoBannerStat}>
              <div style={S.ecoBannerStatVal}>3 pohon</div>
              <div style={S.ecoBannerStatLbl}>Setara Tanam</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={S.footer}>
          <div style={S.footerTop}>
            <div>
              <div style={S.footerLogo}>Ecova</div>
              <p style={S.footerTagline}>
                Menghubungkan pengelolaan sampah dengan dampak nyata melalui
                inovasi, komunitas, dan aksi berkelanjutan untuk masa depan yang lebih hijau.
              </p>
              <div style={{ display:'flex', gap:8 }}>
                {['f','tt','x','ig','g'].map(s => (
                  <div key={s} style={S.socialIcon}>{s}</div>
                ))}
              </div>
            </div>
            {[
              { heading:'NAVIGASI', links:['Waste Tracker','AI Recommendation','Eco Marketplace','Community'] },
              { heading:'IMPACT',   links:['Impact Dashboard','Tree Contribution','Eco Mission','Growth Tracker'] },
              { heading:'LEGAL',    links:['Privacy Policy','Terms of Use','Data Protection','Safety'] },
            ].map(col => (
              <div key={col.heading}>
                <div style={S.footerColHead}>{col.heading}</div>
                {col.links.map(l => <div key={l} style={S.footerLink}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={S.footerBottom}>
            <span>© 2026 Ecova — From Waste to Impact  Built for a Greener Future</span>
            <div style={{ display:'flex', gap:24 }}>
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
const S = {
  page:    { display:'flex', minHeight:'100vh', backgroundColor:'#f0efe8', fontFamily:'"DM Sans","Segoe UI",sans-serif' },
  sidebar: { width:220, minHeight:'100vh', backgroundColor:'#1a4a2e', display:'flex', flexDirection:'column', padding:'24px 0', position:'sticky', top:0, flexShrink:0 },
  logo:    { color:'#fff', fontSize:22, fontWeight:700, padding:'0 24px 32px', letterSpacing:'-0.5px' },
  nav:     { display:'flex', flexDirection:'column', gap:2, flex:1 },
  navItem: { display:'flex', alignItems:'center', gap:12, padding:'12px 24px', background:'none', border:'none', color:'rgba(255,255,255,0.65)', cursor:'pointer', fontSize:14, textAlign:'left' },
  navActive:{ backgroundColor:'rgba(255,255,255,0.12)', color:'#fff' },
  navIcon: { fontSize:16, width:20, textAlign:'center' },
  logout:  { margin:'16px 24px 0', padding:'10px 16px', background:'none', border:'none', color:'rgba(255,255,255,0.55)', cursor:'pointer', fontSize:14, textAlign:'left' },

  main:      { flex:1, padding:'0 40px 60px', overflowY:'auto' },

  topBar:    { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 0 24px' },
  searchWrap:{ display:'flex', alignItems:'center', gap:10, backgroundColor:'#fff', borderRadius:10, padding:'10px 16px', width:340, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  searchInput:{ border:'none', outline:'none', fontSize:13, color:'#555', backgroundColor:'transparent', width:'100%' },
  userInfo:  { display:'flex', alignItems:'center', gap:12 },
  avatar:    { width:40, height:40, borderRadius:'50%', backgroundColor:'#1a4a2e', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 },

  breadcrumb:       { display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#888', marginBottom:16 },
  breadcrumbLink:   { color:'#2d7a3a', cursor:'pointer', fontWeight:500 },
  breadcrumbSep:    { color:'#ccc' },
  breadcrumbCurrent:{ color:'#444' },

  pageTitle: { fontSize:26, fontWeight:700, color:'#1a1a1a', margin:'0 0 4px' },
  pageDesc:  { fontSize:13, color:'#888', margin:0 },

  // Stats
  statsBar:  { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:28 },
  statCard:  { backgroundColor:'#fff', borderRadius:14, padding:'16px 18px' },
  statIcon:  { fontSize:20, marginBottom:8 },
  statValue: { fontSize:20, fontWeight:800, marginBottom:2 },
  statLabel: { fontSize:12, fontWeight:600, color:'#1a1a1a', marginBottom:2 },
  statSub:   { fontSize:11, color:'#aaa' },

  // Filter
  filterRow:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  filterTabs:  { display:'flex', gap:8 },
  filterTab:   { display:'inline-flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:24, border:'1.5px solid #e0e0d8', backgroundColor:'#fff', color:'#666', fontSize:13, fontWeight:500, cursor:'pointer' },
  filterTabOn: { backgroundColor:'#e8f4ea', borderColor:'#2d7a3a', color:'#1a4a2e', fontWeight:700 },
  filterCount: { fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:12 },
  sortWrap:    { display:'flex', alignItems:'center', gap:8 },
  sortSelect:  { padding:'8px 12px', borderRadius:8, border:'1.5px solid #e0e0d8', backgroundColor:'#fff', fontSize:12, color:'#555', outline:'none', cursor:'pointer' },

  // Order list
  orderList: { display:'flex', flexDirection:'column', gap:14, marginBottom:32 },

  // Order card
  orderCard: { backgroundColor:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' },
  orderHead: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', cursor:'pointer', gap:12 },
  orderIcon: { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 },
  orderId:   { fontSize:14, fontWeight:700, color:'#1a1a1a' },
  orderDate: { fontSize:12, color:'#aaa', marginTop:2 },
  orderMeta: { display:'flex', alignItems:'center', gap:14, flexShrink:0 },

  statusBadge: { display:'inline-flex', alignItems:'center', gap:5, padding:'4px 11px', borderRadius:20, fontSize:12, fontWeight:600 },
  statusDot:   { width:6, height:6, borderRadius:'50%' },
  metodeBadge: { fontSize:12, color:'#666', backgroundColor:'#f5f5f0', padding:'4px 10px', borderRadius:8 },
  orderTotal:  { fontSize:15, fontWeight:800, minWidth:90, textAlign:'right' },
  chevron:     { fontSize:14, color:'#aaa', transition:'transform 0.2s', display:'inline-block' },

  // Order body (expanded)
  orderBody:    { padding:'0 22px 20px' },
  orderDivider: { borderTop:'1px solid #f0f0e8', margin:'14px 0' },

  itemsGrid: { display:'flex', flexDirection:'column', gap:8 },
  itemRow:   { display:'flex', alignItems:'center', gap:12, padding:'8px 12px', backgroundColor:'#f9f9f6', borderRadius:10 },
  itemEmoji: { fontSize:20, width:32, textAlign:'center', flexShrink:0 },
  itemName:  { fontSize:13, fontWeight:600, color:'#1a1a1a' },
  itemMeta:  { fontSize:11, color:'#aaa', marginTop:1 },
  itemReward:{ fontSize:14, fontWeight:700, flexShrink:0 },

  detailInfoGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 },
  detailBlock:      { backgroundColor:'#f9f9f6', borderRadius:10, padding:'10px 12px' },
  detailBlockLabel: { fontSize:10, color:'#aaa', fontWeight:600, letterSpacing:0.5, marginBottom:4 },
  detailBlockValue: { fontSize:13, fontWeight:600, color:'#1a1a1a' },

  orderFooter: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 },
  totalRow:    { display:'flex', flexDirection:'column', gap:3 },
  actionBtns:  { display:'flex', gap:10, alignItems:'center' },

  btnDownload: { padding:'9px 18px', backgroundColor:'#e8f4ea', color:'#2d7a3a', border:'none', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer' },
  btnRetry:    { padding:'9px 18px', backgroundColor:'#fdecea', color:'#c0392b', border:'none', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer' },
  btnDetail:   { padding:'9px 18px', backgroundColor:'#fff3e0', color:'#e65c00', border:'none', borderRadius:8, fontWeight:600, fontSize:12, cursor:'pointer' },
  btnGhost:    { padding:'9px 18px', backgroundColor:'transparent', color:'#888', border:'1.5px solid #e0e0d8', borderRadius:8, fontWeight:500, fontSize:12, cursor:'pointer' },

  emptyState: { textAlign:'center', padding:'60px 0', color:'#888' },

  // Eco banner
  ecoBanner:         { backgroundColor:'#1a4a2e', borderRadius:20, padding:'28px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:24, marginBottom:40 },
  ecoBannerLeft:     { display:'flex', alignItems:'flex-start', gap:16 },
  ecoBannerIcon:     { fontSize:36, lineHeight:1 },
  ecoBannerTitle:    { fontSize:16, fontWeight:700, color:'#fff', marginBottom:6 },
  ecoBannerDesc:     { fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.6, maxWidth:380 },
  ecoBannerStats:    { display:'flex', alignItems:'center', backgroundColor:'rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden', flexShrink:0 },
  ecoBannerStat:     { padding:'16px 28px', textAlign:'center' },
  ecoBannerStatVal:  { fontSize:20, fontWeight:800, color:'#a8e6b8', marginBottom:4 },
  ecoBannerStatLbl:  { fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:0.3 },
  ecoBannerStatDivider:{ width:1, backgroundColor:'rgba(255,255,255,0.12)', alignSelf:'stretch' },

  // Footer
  footer:       { backgroundColor:'#173319', borderRadius:20, padding:'40px 48px 24px', color:'#fff' },
  footerTop:    { display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, paddingBottom:32, borderBottom:'1px solid rgba(255,255,255,0.1)' },
  footerLogo:   { fontSize:20, fontWeight:700, marginBottom:14 },
  footerTagline:{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.7, margin:'0 0 16px', maxWidth:260 },
  socialIcon:   { width:32, height:32, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.7)', cursor:'pointer' },
  footerColHead:{ fontSize:11, fontWeight:700, letterSpacing:1, color:'rgba(255,255,255,0.5)', marginBottom:14 },
  footerLink:   { fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:10, cursor:'pointer' },
  footerBottom: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:20, fontSize:11, color:'rgba(255,255,255,0.4)' },
};