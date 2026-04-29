// src/pages/Pertukaran.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  scanWaste,
  getCurrentWastes,
  exchangeWaste,
  formatRupiah,
  WASTE_TYPE_LABELS,
} from '../services/wasteApi';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const items = [
    { icon: '⊞', label: 'Dashboard',   to: '/dashboard' },
    { icon: '↔', label: 'Pertukaran',  to: '/pertukaran' },
    { icon: '🛒', label: 'Marketplace', to: '/marketplace' },
    { icon: '📋', label: 'Pesanan',     to: '/pesanan' },
    { icon: '💳', label: 'Pembayaran',  to: '/pembayaran' },
    { icon: '👤', label: 'Profil',      to: '/profil' },
  ];
  return (
    <aside style={S.sidebar}>
      <div style={S.logo}>EcoRuk</div>
      <nav style={S.nav}>
        {items.map((i) => (
          <button
            key={i.to}
            onClick={() => navigate(i.to)}
            style={{ ...S.navItem, ...(path === i.to ? S.navActive : {}) }}
          >
            <span style={S.navIcon}>{i.icon}</span>
            <span>{i.label}</span>
          </button>
        ))}
      </nav>
      <button style={S.logout}>↩ Keluar</button>
    </aside>
  );
};

// ─── Gambar per tipe sampah - pakai picsum dengan seed tetap ─────────────────
// seed tetap = gambar selalu sama, tidak random
const WASTE_IMAGES = {
  pet_plastik:   'https://i.pinimg.com/1200x/de/fc/f7/defcf7773f9d794d63d3fdbcacac8b2a.jpg', // botol plastik PET bening
  serat_kertas:  'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=700&q=80', // tumpukan kertas/kardus
  plastic_fiber: 'https://images.unsplash.com/photo-1611284446314-60a58ac0debb?w=700&q=80', // sampah plastik campur
  plastik:       'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80', // plastik daur ulang
  kardus:        'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=700&q=80', // kardus
};

// Fallback SVG inline jika gambar gagal load
const FallbackCamera = ({ wasteType }) => {
  const colors = { pet_plastik:'#a8d8ea', aluminum:'#b0bec5', serat_kertas:'#d7ccc8', plastic_fiber:'#c5cae9', plastik:'#c8e6c9', kardus:'#bcaaa4' };
  const c = colors[wasteType] || '#c8e6c9';
  return (
    <div style={{ ...S.cameraFrame, display:'flex', alignItems:'center', justifyContent:'center', background:'#111' }}>
      <svg viewBox="0 0 100 200" style={{ width:90, height:180 }}>
        <rect x="38" y="2" width="24" height="18" rx="5" fill={c}/>
        <rect x="35" y="18" width="30" height="20" rx="4" fill={c} opacity=".9"/>
        <rect x="20" y="36" width="60" height="120" rx="14" fill={c} opacity=".85"/>
        <rect x="20" y="60" width="60" height="58" rx="5" fill="rgba(255,255,255,0.25)"/>
        <text x="50" y="88" textAnchor="middle" fontSize="9" fill="#1a4a2e" fontWeight="bold">
          {(WASTE_TYPE_LABELS[wasteType]||'Plastik').split(' ')[0]}
        </text>
        <rect x="22" y="154" width="56" height="20" rx="8" fill={c} opacity=".7"/>
        <rect x="26" y="42" width="10" height="96" rx="5" fill="rgba(255,255,255,0.22)"/>
      </svg>
    </div>
  );
};

// ─── Camera View ──────────────────────────────────────────────────────────────
const CameraView = ({ wasteType, processing }) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc]     = useState(WASTE_IMAGES[wasteType] || WASTE_IMAGES.plastik);

  // Reset error ketika tipe berubah
  useEffect(() => {
    setImgError(false);
    setImgSrc(WASTE_IMAGES[wasteType] || WASTE_IMAGES.plastik);
  }, [wasteType]);

  if (imgError) return <FallbackCamera wasteType={wasteType} />;

  return (
    <div style={S.cameraFrame}>
      <img
        src={imgSrc}
        alt={WASTE_TYPE_LABELS[wasteType] || 'sampah'}
        style={S.cameraImg}
        onError={() => setImgError(true)}
      />
      {/* overlay gelap */}
      <div style={S.camOverlay} />

      {/* scan line animasi */}
      {processing && (
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:4 }}>
          <div style={{ ...S.scanLine, animation:'scanMove 1.2s ease-in-out infinite' }} />
        </div>
      )}

      {/* QR frame corners kuning */}
      <div style={S.qrFrameWrap}>
        <div style={S.qrBox}>
          <div style={{ ...S.corner, top:0, left:0,   borderRight:'none', borderBottom:'none' }} />
          <div style={{ ...S.corner, top:0, right:0,  borderLeft:'none',  borderBottom:'none' }} />
          <div style={{ ...S.corner, bottom:0, left:0,  borderRight:'none', borderTop:'none' }} />
          <div style={{ ...S.corner, bottom:0, right:0, borderLeft:'none',  borderTop:'none' }} />
          <div style={S.qrLabel}>
            {processing ? '⟳ Memindai...' : 'Scan Kode QR'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Pertukaran() {
  const navigate = useNavigate();
  const [scanState,   setScanState]   = useState('ready');
  const [processing,  setProcessing]  = useState(false);
  const [exchanging,  setExchanging]  = useState(false);
  const [collection,  setCollection]  = useState({ items:[], total_weight:0, total_reward:0 });
  const [loadingColl, setLoadingColl] = useState(true);
  const [wasteType,   setWasteType]   = useState('pet_plastik');
  const [lastScanned, setLastScanned] = useState(null);
  const [scanError,   setScanError]   = useState(null);
  const flashRef = useRef(null);

  useEffect(() => { loadCollection(); }, []);

  const loadCollection = async () => {
    setLoadingColl(true);
    try {
      const data = await getCurrentWastes();
      setCollection(data);
    } catch (e) {
      console.error('Collection:', e.message);
    } finally {
      setLoadingColl(false);
    }
  };

  const handleShutter = async () => {
    if (processing) return;
    setProcessing(true);
    setScanError(null);
    setLastScanned(null);
    if (flashRef.current) {
      flashRef.current.style.opacity = '1';
      setTimeout(() => { if (flashRef.current) flashRef.current.style.opacity = '0'; }, 150);
    }
    try {
      const weight = parseFloat((Math.random() * 1.2 + 0.2).toFixed(2));
      const res = await scanWaste({ waste_type: wasteType, weight });
      setLastScanned(res.data);
      await loadCollection();
    } catch (e) {
      setScanError(e.message || 'Scan gagal, coba lagi');
    } finally {
      setProcessing(false);
    }
  };

  const handleExchange = async () => {
    if (exchanging || !collection.items.length) return;
    setExchanging(true);
    try {
      const res = await exchangeWaste();
      sessionStorage.setItem('pending_reward', res.total_reward);
      navigate('/pembayaran');
    } catch (e) {
      alert(e.message || 'Gagal menukar');
    } finally {
      setExchanging(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes scanMove { 0%,100%{top:4%} 50%{top:88%} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <Sidebar />

      <main style={S.main}>
        <h1 style={S.pageTitle}>Tukar Sampahmu dengan Sekali Scan</h1>
        <p style={S.pageDesc}>
          Kelola sampah dengan cara yang lebih mudah dan praktis melalui sistem QR.
          Scan di lokasi tersedia untuk mendapatkan poin dan reward.
        </p>

        {/* Step cards */}
        <div style={S.steps}>
          {[
            { icon:'📷', title:'Scan QR Code',       desc:'Kunjungi lokasi atau mitra, lalu scan QR untuk memulai proses penukaran.' },
            { icon:'📍', title:'Kunjungi Drop Point', desc:'Cari titik pengumpulan terdekat untuk menukarkan sampahmu secara langsung.' },
            { icon:'🎁', title:'Dapatkan Poin',       desc:'Gunakan poin untuk reward, produk, atau berkontribusi penanaman pohon.' },
          ].map((s) => (
            <div key={s.title} style={S.stepCard}>
              <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
              <strong style={{ fontSize:13, color:'#1a1a1a', display:'block', marginBottom:6 }}>{s.title}</strong>
              <p style={{ fontSize:12, color:'#888', margin:0, lineHeight:1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Content row */}
        <div style={S.contentRow}>

          {/* LEFT */}
          <div>
            {/* READY */}
            {scanState === 'ready' && (
              <div style={S.readyCard}>
                <img
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80"
                  alt="Daur ulang"
                  style={S.readyImg}
                />
                <div style={S.readyContent}>
                  <h2 style={S.readyTitle}>Siap Untuk Scan?</h2>
                  <p style={S.readyDesc}>
                    Klik tombol <strong>"Scan Sampahmu"</strong> izinkan penggunaan kamera
                    kami akan mendeteksi sampah hasil kamu yang telah diberikan kepada kami
                  </p>
                  <button style={S.startBtn} onClick={() => { setScanState('scanning'); setScanError(null); setLastScanned(null); }}>
                    <span>⬛</span> Scan Sampahmu
                  </button>
                </div>
              </div>
            )}

            {/* SCANNING */}
            {scanState === 'scanning' && (
              <div style={S.scanCard}>
                <div ref={flashRef} style={S.flash} />

                <div style={S.scanHead}>
                  <div>
                    <div style={S.scanTitle}>Scan Kode QR</div>
                    <div style={S.scanSub}>
                      Scan kode QR di lokasi penukaran untuk mencatat sampahmu secara otomatis
                      dan memulai proses penukaran dengan cepat.
                    </div>
                  </div>
                  <button
                    style={S.closeBtn}
                    onClick={() => { setScanState('ready'); setScanError(null); setLastScanned(null); }}
                  >✕</button>
                </div>

                <CameraView wasteType={wasteType} processing={processing} />

                <div style={{ marginTop:14, marginBottom:10 }}>
                  <span style={S.typeLabel}>Tipe Sampah:</span>
                  <div style={S.typeRow}>
                    {Object.entries(WASTE_TYPE_LABELS).slice(0, 5).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => { setWasteType(k); setScanError(null); }}
                        style={{ ...S.typeBtn, ...(wasteType === k ? S.typeBtnOn : {}) }}
                      >{v}</button>
                    ))}
                  </div>
                </div>

                {scanError   && <div style={S.errBox}>⚠ {scanError}</div>}
                {lastScanned && (
                  <div style={{ ...S.okBox, animation:'fadeIn 0.3s ease' }}>
                    ✅ Scan berhasil! <strong>{WASTE_TYPE_LABELS[lastScanned.waste_type]}</strong>{' '}
                    {lastScanned.weight}kg → <strong style={{ color:'#7dd87d' }}>{formatRupiah(lastScanned.reward_value)}</strong>
                  </div>
                )}

                <div style={S.shutterRow}>
                  <button
                    style={{ ...S.shutterOuter, opacity: processing ? 0.4 : 1 }}
                    onClick={handleShutter}
                    disabled={processing}
                  >
                    <div style={S.shutterInner}>{processing ? '⟳' : '●'}</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Collection */}
          <div style={S.collCard}>
            <div style={S.collHead}>
              <span style={S.collBadge}>MENGUMPULKAN</span>
              <span style={{ fontSize:12, color:'#aaa' }}>{collection.items.length} item</span>
            </div>

            {loadingColl ? (
              <div style={S.centerMsg}>Memuat koleksi...</div>
            ) : collection.items.length === 0 ? (
              <div style={{ textAlign:'center', padding:'28px 0' }}>
                <div style={{ fontSize:38, marginBottom:10 }}>♻️</div>
                <div style={{ fontSize:14, color:'#555', marginBottom:4 }}>Belum ada sampah</div>
                <div style={{ fontSize:12, color:'#aaa' }}>Scan sampahmu untuk memulai</div>
              </div>
            ) : (
              <>
                <div style={S.itemList}>
                  {collection.items.map((it) => (
                    <div key={it.id} style={S.item}>
                      <div style={S.itemL}>
                        <div style={S.dot} />
                        <div>
                          <div style={S.itemName}>{WASTE_TYPE_LABELS[it.waste_type] || it.waste_type}</div>
                          <div style={S.itemMeta}>{it.weight} kg terkumpul</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={S.itemRwd}>{formatRupiah(it.reward_value)}</div>
                        <div style={{ fontSize:10, color:'#aaa', textTransform:'capitalize' }}>{it.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.hasilBox}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#2d7a3a', marginBottom:8 }}>Hasil Scan</div>
                  <p style={{ fontSize:11, color:'#666', margin:'0 0 8px', lineHeight:1.5 }}>
                    Produk berhasil di-scan. Reward dihitung berdasarkan berat dan jenis sampah.
                  </p>
                  <div style={S.sumRow}><span>Total berat</span><strong>{collection.total_weight} kg</strong></div>
                  <div style={S.sumRow}><span>Estimasi reward</span><strong style={{ color:'#2d7a3a' }}>{formatRupiah(collection.total_reward)}</strong></div>
                </div>
              </>
            )}

            <button
              style={{ ...S.exchBtn, opacity: !collection.items.length || exchanging ? 0.4 : 1 }}
              onClick={handleExchange}
              disabled={!collection.items.length || exchanging}
            >
              {exchanging ? 'Memproses...' : `Tukarkan ${formatRupiah(collection.total_reward)}`}
            </button>
          </div>
        </div>

        {/* Protokol */}
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#1a1a1a', margin:'0 0 6px' }}>Persiapan Protokol Pengolahan</h2>
          <p style={{ color:'#888', fontSize:14, margin:'0 0 20px' }}>Alur persiapan sampah sebelum diproses</p>
          <div style={S.protoGrid}>
            {[
              { icon:'💧', t:'Bilas',       d:'Bersihkan sisa isi dalam botol agar tidak terkontaminasi dan kualitas daur ulang tetap baik.' },
              { icon:'🏷',  t:'Lepas Label', d:'Lepaskan label plastik/kertas agar proses daur ulang lebih efisien dan nilai lebih tinggi.' },
              { icon:'🔧', t:'Pipihkan',    d:'Tekan atau menghancurkan botol agar lebih hemat ruang saat dikumpulkan.' },
              { icon:'🗂',  t:'Kategori',    d:'Mengelompokkan sampah berdasarkan jenis material untuk memudahkan proses pengolahan.' },
            ].map((p) => (
              <div key={p.t} style={S.protoCard}>
                <div style={{ fontSize:26, marginBottom:10 }}>{p.icon}</div>
                <strong style={{ fontSize:13, color:'#1a1a1a', display:'block', marginBottom:6 }}>{p.t}</strong>
                <p style={{ fontSize:12, color:'#888', margin:0, lineHeight:1.5 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
    
  );
}


const S = {
  page:     { display:'flex', minHeight:'100vh', backgroundColor:'#f5f5f0', fontFamily:'"Inter","Segoe UI",sans-serif' },
  sidebar:  { width:220, minHeight:'100vh', backgroundColor:'#1a4a2e', display:'flex', flexDirection:'column', padding:'24px 0', position:'sticky', top:0, flexShrink:0 },
  logo:     { color:'#fff', fontSize:22, fontWeight:700, padding:'0 24px 32px' },
  nav:      { display:'flex', flexDirection:'column', gap:4, flex:1 },
  navItem:  { display:'flex', alignItems:'center', gap:12, padding:'12px 24px', background:'none', border:'none', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:14, textAlign:'left' },
  navActive:{ backgroundColor:'rgba(255,255,255,0.15)', color:'#fff' },
  navIcon:  { fontSize:16, width:20, textAlign:'center' },
  logout:   { margin:'16px 24px 0', padding:'10px 16px', background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:14, textAlign:'left' },

  main:      { flex:1, padding:'32px 40px', overflowY:'auto' },
  pageTitle: { fontSize:24, fontWeight:700, color:'#1a1a1a', margin:'0 0 8px' },
  pageDesc:  { color:'#666', fontSize:14, margin:'0 0 28px', maxWidth:600 },

  steps:    { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 },
  stepCard: { backgroundColor:'#fff', borderRadius:12, padding:20 },

  contentRow: { display:'grid', gridTemplateColumns:'1fr 300px', gap:24, marginBottom:40, alignItems:'start' },

  readyCard:    { backgroundColor:'#fff', borderRadius:16, overflow:'hidden', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:260 },
  readyImg:     { width:'100%', height:'100%', objectFit:'cover', display:'block' },
  readyContent: { padding:30, display:'flex', flexDirection:'column', justifyContent:'center', gap:16 },
  readyTitle:   { fontSize:21, fontWeight:700, color:'#1a1a1a', margin:0 },
  readyDesc:    { fontSize:13, color:'#666', margin:0, lineHeight:1.6 },
  startBtn:     { display:'inline-flex', alignItems:'center', gap:8, padding:'12px 22px', backgroundColor:'#2d7a3a', color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:14, cursor:'pointer' },

  scanCard:  { backgroundColor:'#1a1a1a', borderRadius:16, padding:22, position:'relative', color:'#fff' },
  flash:     { position:'absolute', inset:0, backgroundColor:'#fff', opacity:0, transition:'opacity 0.1s', pointerEvents:'none', zIndex:30, borderRadius:16 },
  scanHead:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, gap:12 },
  scanTitle: { fontSize:18, fontWeight:700, marginBottom:4 },
  scanSub:   { fontSize:11, color:'rgba(255,255,255,0.5)', lineHeight:1.5, maxWidth:420 },
  closeBtn:  { flexShrink:0, width:32, height:32, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.12)', border:'none', color:'#fff', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' },

  cameraFrame:  { borderRadius:12, overflow:'hidden', position:'relative', height:320 },
  cameraImg:    { width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'brightness(0.7)' },
  camOverlay:   { position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,transparent 25%,transparent 75%,rgba(0,0,0,0.4) 100%)', pointerEvents:'none', zIndex:2 },
  scanLine:     { position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#f5c842,#f5c842,transparent)', boxShadow:'0 0 14px 2px rgba(245,200,66,0.7)', zIndex:5 },
  qrFrameWrap:  { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 },
  qrBox:        { width:190, height:190, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' },
  corner:       { position:'absolute', width:24, height:24, border:'3px solid #f5c842', borderRadius:3 },
  qrLabel:      { position:'absolute', bottom:-28, fontSize:12, color:'rgba(245,200,66,0.9)', whiteSpace:'nowrap', fontWeight:600, letterSpacing:0.5 },

  typeLabel: { fontSize:11, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:8 },
  typeRow:   { display:'flex', flexWrap:'wrap', gap:7 },
  typeBtn:   { padding:'6px 13px', borderRadius:20, border:'1px solid rgba(255,255,255,0.2)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:11 },
  typeBtnOn: { backgroundColor:'#2d7a3a', borderColor:'#2d7a3a', color:'#fff', fontWeight:600 },

  errBox: { padding:'9px 14px', backgroundColor:'rgba(220,50,50,0.18)', border:'1px solid rgba(220,50,50,0.25)', borderRadius:8, color:'#ff8080', fontSize:12, marginTop:10 },
  okBox:  { padding:'9px 14px', backgroundColor:'rgba(45,122,58,0.22)', border:'1px solid rgba(45,122,58,0.3)', borderRadius:8, color:'#7dd87d', fontSize:12, marginTop:10 },

  shutterRow:   { display:'flex', justifyContent:'center', paddingTop:14 },
  shutterOuter: { width:68, height:68, borderRadius:'50%', background:'transparent', border:'3px solid rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'opacity 0.2s' },
  shutterInner: { width:52, height:52, borderRadius:'50%', backgroundColor:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:'#1a1a1a', fontWeight:700 },

  collCard:  { backgroundColor:'#fff', borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:12 },
  collHead:  { display:'flex', justifyContent:'space-between', alignItems:'center' },
  collBadge: { fontSize:10, fontWeight:700, letterSpacing:1, color:'#fff', backgroundColor:'#2d7a3a', padding:'3px 10px', borderRadius:20 },
  centerMsg: { textAlign:'center', padding:'20px 0', color:'#aaa', fontSize:14 },
  itemList:  { display:'flex', flexDirection:'column', gap:8, maxHeight:220, overflowY:'auto' },
  item:      { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', backgroundColor:'#f9f9f6', borderRadius:10 },
  itemL:     { display:'flex', alignItems:'center', gap:10 },
  dot:       { width:8, height:8, borderRadius:'50%', backgroundColor:'#2d7a3a', flexShrink:0 },
  itemName:  { fontSize:12, fontWeight:600, color:'#1a1a1a' },
  itemMeta:  { fontSize:11, color:'#aaa' },
  itemRwd:   { fontSize:13, fontWeight:700, color:'#2d7a3a' },
  hasilBox:  { backgroundColor:'#f0f7f1', borderRadius:10, padding:12 },
  sumRow:    { display:'flex', justifyContent:'space-between', fontSize:12, color:'#555', marginTop:6 },
  exchBtn:   { padding:13, backgroundColor:'#2d7a3a', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer', width:'100%', transition:'opacity 0.2s' },

  protoGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 },
  protoCard: { backgroundColor:'#fff', borderRadius:12, padding:20 },
};