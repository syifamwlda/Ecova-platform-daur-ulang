import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
// ─── Badge data ───────────────────────────────────────────────────────────────
const BADGES = [
  { icon: '♻', label: 'PELOPOR\nEKOLOGI',       color: '#c8e6c9', iconColor: '#2d7a3a', active: true  },
  { icon: '✓', label: 'PENETRAL\nKARBON',        color: '#a5d6a7', iconColor: '#1b5e20', active: true  },
  { icon: '🛒', label: 'MAESTRO\nMARKETPLACE',   color: '#ffcc80', iconColor: '#e65100', active: true  },
  { icon: '🔔', label: 'PENJAGA\nHUTAN',          color: '#e0e0e0', iconColor: '#9e9e9e', active: false },
  { icon: '≋',  label: 'SAHABAT\nLAUT',           color: '#b3e5fc', iconColor: '#0277bd', active: true  },
  { icon: '🌱', label: 'PENANAM\nPOHON',           color: '#dcedc8', iconColor: '#558b2f', active: true  },
  { icon: '♲',  label: 'PENDAUR\nULANG',           color: '#ffe0b2', iconColor: '#ef6c00', active: true  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Profil() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name:     'Budi Santoso',
    username: '@budi_santoso17',
    email:    'budisantoso@gmail.com',
    kota:     'Bandung',
    bio:      'Pecinta lingkungan & daur ulang aktif sejak 2022.',
  });
  const [draft, setDraft] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...draft });
    setEditing(false);
  };

  // XP progress
  const currentXP = 550 - 220; // 330 / 550
  const xpPct = Math.round((330 / 550) * 100);

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xpFill  { from{width:0} to{width:${xpPct}%} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <Sidebar />

      <main style={S.main}>

        {/* ── Hero / Cover ── */}
        <div style={S.heroWrap} className="fade-up">
          {/* Cover image */}
          <div style={S.coverImg}>
            <img
              src="https://images.openai.com/static-rsc-4/_nM9mg3sv2fxklRs5RcfgaVzcnKRoVD3zrc0TAxDsEalItkzEKxoMSlJA3-eH6y6ubLSoNd2rYnuAVV7yogxjLP2det_ZdDCTafk94PZBT1Rl2m4YTqhTVZH5GJlxdofwyylVwyHCVQeTASoQTNLxzjJz2GtRMu9p1YM0CsOXcAxliXw_Yd_EZ74cDz_yzXr?purpose=fullsize"
              alt="cover"
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
            />
            <div style={S.coverOverlay} />
          </div>

          {/* Avatar + info */}
          <div style={S.heroContent}>
            <div style={S.avatarWrap}>
              <div style={S.avatarRing}>
                <div style={S.avatarInner}>
                  <span style={{ fontSize:32, color:'#fff' }}>👤</span>
                </div>
              </div>
              <div style={S.avatarOnline} />
            </div>
            <div>
              <div style={S.heroName}>{user.name}</div>
              <div style={S.heroUsername}>{user.username}</div>
            </div>
          </div>

          {/* Edit button */}
          {!editing ? (
            <button style={S.editBtn} onClick={() => { setDraft({ ...user }); setEditing(true); }}>
              Edit ✏
            </button>
          ) : (
            <div style={{ position:'absolute', top:16, right:16, display:'flex', gap:8 }}>
              <button style={S.saveBtn} onClick={handleSave}>Simpan ✓</button>
              <button style={S.cancelBtn} onClick={() => setEditing(false)}>Batal</button>
            </div>
          )}
        </div>

        {/* ── Edit form ── */}
        {editing && (
          <div style={S.editForm} className="fade-up">
            <div style={S.editFormTitle}>✏ Edit Profil</div>
            <div style={S.editGrid}>
              {[
                { key:'name',     label:'Nama Lengkap', type:'text' },
                { key:'username', label:'Username',     type:'text' },
                { key:'email',    label:'Email',        type:'email' },
                { key:'kota',     label:'Kota',         type:'text' },
              ].map(f => (
                <div key={f.key} style={S.formField}>
                  <label style={S.formLabel}>{f.label}</label>
                  <input
                    type={f.type}
                    value={draft[f.key]}
                    onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
                    style={S.formInput}
                  />
                </div>
              ))}
              <div style={{ ...S.formField, gridColumn:'1 / -1' }}>
                <label style={S.formLabel}>Bio</label>
                <textarea
                  value={draft.bio}
                  onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                  style={{ ...S.formInput, height:72, resize:'vertical' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Profil Pejuang Dampak ── */}
        <div style={{ padding:'32px 0 4px' }} className="fade-up">
          <h1 style={S.sectionBigTitle}>Profil Pejuang Dampak</h1>
          <p style={S.sectionBigDesc}>
            Kamu sudah hemat 48 kg CO₂ bulan ini. Terus semangat untuk mencapai peringkat 'Penjaga Hutan'!
          </p>
        </div>

        {/* ── Stat cards row ── */}
        <div style={S.statRow} className="fade-up">

          {/* CO2 card */}
          <div style={S.statCard}>
            <div style={S.statCardTop}>
              <span style={{ ...S.statCardBadge, color:'#2d7a3a' }}>🌿 OFFSET CO2</span>
              <svg style={S.statDecor} viewBox="0 0 80 70" fill="none">
                <ellipse cx="50" cy="35" rx="40" ry="38" fill="#e8f4ea" opacity="0.7"/>
                <ellipse cx="60" cy="25" rx="28" ry="30" fill="#c8e6c9" opacity="0.5"/>
              </svg>
            </div>
            <div style={S.statBigNum}>48 <span style={S.statUnit}>kg</span></div>
            <div style={S.statFooter}>
              <span style={S.statChange}>4.8% dari bulan lalu</span>
              <span style={S.statTarget}>Target: 1 ton</span>
            </div>
            <div style={S.statBarTrack}>
              <div style={{ ...S.statBarFill, width:'4.8%', backgroundColor:'#2d7a3a' }} />
            </div>
          </div>

          {/* Sampah dicegah */}
          <div style={S.statCard}>
            <div style={S.statCardTop}>
              <span style={{ ...S.statCardBadge, color:'#0277bd' }}>≋ SAMPAH DICEGAH KE LAUT</span>
              <svg style={S.statDecor} viewBox="0 0 80 70" fill="none">
                <ellipse cx="50" cy="35" rx="40" ry="38" fill="#e3f2fd" opacity="0.7"/>
                <ellipse cx="60" cy="25" rx="28" ry="30" fill="#b3e5fc" opacity="0.5"/>
              </svg>
            </div>
            <div style={S.statBigNum}>2.400 <span style={S.statUnit}>unit</span></div>
            <div style={S.statFooter}>
              <span style={S.statChange}>40% dari bulan lalu</span>
              <span style={S.statTarget}>Target: 5.000 unit</span>
            </div>
            <div style={S.statBarTrack}>
              <div style={{ ...S.statBarFill, width:'48%', backgroundColor:'#0277bd' }} />
            </div>
          </div>

          {/* Peringkat card */}
          <div style={{ ...S.statCard, backgroundColor:'#1a4a2e', color:'#fff', position:'relative', overflow:'hidden' }}>
            {/* Big decorative medal */}
            <div style={S.medalDecor}>🏅</div>
            <span style={{ ...S.statCardBadge, color:'rgba(255,255,255,0.6)' }}>🏆 PERINGKAT SAAT INI</span>
            <div style={{ fontSize:28, fontWeight:800, color:'#a8e6b8', margin:'10px 0 4px' }}>Eco-Pathfinder</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:20 }}>Top 5% di kotamu</div>

            {/* XP bar */}
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span>Level 5</span>
              <span>Level 6 : 550 xp dibutuhkan</span>
            </div>
            <div style={{ height:8, borderRadius:8, backgroundColor:'rgba(255,255,255,0.15)', overflow:'hidden' }}>
              <div style={{
                height:'100%',
                width: `${xpPct}%`,
                backgroundColor:'#a8e6b8',
                borderRadius:8,
                animation:'xpFill 1s ease 0.3s forwards',
              }} />
            </div>
          </div>
        </div>

        {/* ── Pencapaian & Lencana ── */}
        <section style={{ marginBottom:40 }} className="fade-up">
          <h2 style={S.sectionTitle}>Pencapaian &amp; Lencana</h2>
          <div style={S.badgeCard}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ ...S.badgeItem, opacity: b.active ? 1 : 0.4 }}>
                <div style={{ ...S.badgeCircle, backgroundColor: b.color }}>
                  <span style={{ fontSize:22, color: b.iconColor }}>{b.icon}</span>
                </div>
                <div style={S.badgeLabel}>
                  {b.label.split('\n').map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Riwayat Aktivitas ── */}
        <section style={{ marginBottom:40 }} className="fade-up">
          <h2 style={S.sectionTitle}>Riwayat Aktivitas</h2>
          <div style={S.activityList}>
            {[
              { icon:'♻', text:'Scan 12 kg PET Plastik',         date:'29 Apr 2026', reward:'Rp 72.000', color:'#2d7a3a' },
              { icon:'💳', text:'Penarikan saldo via OVO',         date:'28 Apr 2026', reward:'-Rp 87.000', color:'#e65c00' },
              { icon:'🛒', text:'Pembelian produk eco di Marketplace', date:'25 Apr 2026', reward:'-Rp 45.000', color:'#c0392b' },
              { icon:'🌱', text:'Misi harian selesai: 5 PET Botol', date:'24 Apr 2026', reward:'+500 XP',   color:'#2d7a3a' },
              { icon:'♻', text:'Scan 8 kg Kardus Bekas',          date:'22 Apr 2026', reward:'Rp 24.000', color:'#2d7a3a' },
            ].map((a, i) => (
              <div key={i} style={S.activityRow}>
                <div style={{ ...S.activityIcon, color: a.color }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{a.text}</div>
                  <div style={{ fontSize:11, color:'#aaa', marginTop:2 }}>{a.date}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color: a.color }}>{a.reward}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
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
            <span>© 2026 Ecoruk — From Waste to Impact  Built for a Greener Future</span>
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
  page:    { display:'flex', minHeight:'100vh', backgroundColor:'#e8f0e8', fontFamily:'"DM Sans","Segoe UI",sans-serif' },
  sidebar: { width:175, minHeight:'100vh', backgroundColor:'#2d7a3a', display:'flex', flexDirection:'column', padding:'28px 0', position:'sticky', top:0, flexShrink:0 },
  logo:    { color:'#fff', fontSize:22, fontWeight:800, padding:'0 24px 40px', fontStyle:'italic' },
  nav:     { display:'flex', flexDirection:'column', gap:2, flex:1 },
  navItem: { display:'flex', alignItems:'center', gap:12, padding:'13px 24px', background:'none', border:'none', color:'rgba(255,255,255,0.75)', cursor:'pointer', fontSize:13, textAlign:'left' },
  navActive:{ backgroundColor:'rgba(0,0,0,0.15)', color:'#fff', fontWeight:600 },
  navIcon: { fontSize:15, width:18, textAlign:'center' },
  logout:  { display:'flex', alignItems:'center', gap:10, margin:'16px 24px 0', padding:'12px 0', background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:13, textAlign:'left' },

  main: { flex:1, padding:'0 36px 60px', overflowY:'auto', maxWidth:'calc(100vw - 175px)' },

  // Hero
  heroWrap:    { position:'relative', borderRadius:20, overflow:'hidden', marginTop:28, marginBottom:28, height:200 },
  coverImg:    { position:'absolute', inset:0 },
  coverOverlay:{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' },
  heroContent: { position:'absolute', bottom:20, left:24, display:'flex', alignItems:'center', gap:16, zIndex:2 },
  avatarWrap:  { position:'relative' },
  avatarRing:  { width:72, height:72, borderRadius:'50%', border:'3px solid #2d7a3a', padding:3, backgroundColor:'#fff' },
  avatarInner: { width:'100%', height:'100%', borderRadius:'50%', backgroundColor:'#c8e6c9', display:'flex', alignItems:'center', justifyContent:'center' },
  avatarOnline:{ position:'absolute', bottom:4, right:4, width:14, height:14, borderRadius:'50%', backgroundColor:'#4caf50', border:'2px solid #fff' },
  heroName:    { fontSize:20, fontWeight:800, color:'#fff', textShadow:'0 1px 4px rgba(0,0,0,0.4)' },
  heroUsername:{ fontSize:13, color:'rgba(255,255,255,0.75)', marginTop:2 },
  editBtn:     { position:'absolute', top:16, right:16, zIndex:3, padding:'8px 18px', backgroundColor:'rgba(255,255,255,0.92)', border:'none', borderRadius:20, fontWeight:700, fontSize:13, cursor:'pointer', color:'#1a1a1a', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' },
  saveBtn:     { padding:'8px 18px', backgroundColor:'#2d7a3a', border:'none', borderRadius:20, fontWeight:700, fontSize:13, cursor:'pointer', color:'#fff', zIndex:3 },
  cancelBtn:   { padding:'8px 18px', backgroundColor:'rgba(255,255,255,0.85)', border:'none', borderRadius:20, fontWeight:600, fontSize:13, cursor:'pointer', color:'#555', zIndex:3 },

  // Edit form
  editForm:      { backgroundColor:'#fff', borderRadius:16, padding:'22px 28px', marginBottom:24, boxShadow:'0 2px 10px rgba(0,0,0,0.06)' },
  editFormTitle: { fontSize:15, fontWeight:700, color:'#1a1a1a', marginBottom:16 },
  editGrid:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  formField:     { display:'flex', flexDirection:'column', gap:5 },
  formLabel:     { fontSize:11, fontWeight:600, color:'#888', letterSpacing:0.5, textTransform:'uppercase' },
  formInput:     { padding:'10px 14px', border:'1.5px solid #e0e0d8', borderRadius:10, fontSize:13, color:'#1a1a1a', outline:'none', fontFamily:'inherit' },

  // Profil section
  sectionBigTitle: { fontSize:30, fontWeight:800, color:'#1a4a2e', margin:'0 0 8px', letterSpacing:'-0.5px' },
  sectionBigDesc:  { fontSize:14, color:'#555', margin:'0 0 24px', lineHeight:1.6, maxWidth:620 },

  // Stat cards
  statRow:  { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18, marginBottom:36 },
  statCard: { backgroundColor:'#fff', borderRadius:18, padding:'20px 22px', position:'relative', overflow:'hidden' },
  statCardTop:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 },
  statCardBadge:{ fontSize:11, fontWeight:700, letterSpacing:0.5 },
  statDecor:    { position:'absolute', right:-10, top:-10, width:80, height:70, pointerEvents:'none' },
  statBigNum:   { fontSize:42, fontWeight:900, color:'#1a1a1a', lineHeight:1, margin:'6px 0 12px' },
  statUnit:     { fontSize:18, fontWeight:500, color:'#888' },
  statFooter:   { display:'flex', justifyContent:'space-between', fontSize:11, color:'#aaa', marginBottom:8 },
  statChange:   { color:'#2d7a3a', fontWeight:600 },
  statTarget:   {},
  statBarTrack: { height:5, borderRadius:5, backgroundColor:'#f0f0e8', overflow:'hidden' },
  statBarFill:  { height:'100%', borderRadius:5, transition:'width 1s ease' },
  medalDecor:   { position:'absolute', right:-8, bottom:-8, fontSize:80, opacity:0.18, pointerEvents:'none', userSelect:'none' },

  // Badges
  sectionTitle: { fontSize:18, fontWeight:700, color:'#1a1a1a', margin:'0 0 16px' },
  badgeCard:    { backgroundColor:'#fff', borderRadius:18, padding:'24px 28px', display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 },
  badgeItem:    { display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', transition:'transform 0.15s' },
  badgeCircle:  { width:60, height:60, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' },
  badgeLabel:   { fontSize:9, fontWeight:700, letterSpacing:0.5, color:'#555', textAlign:'center', lineHeight:1.4, textTransform:'uppercase' },

  // Activity
  activityList: { backgroundColor:'#fff', borderRadius:18, padding:'6px 0', overflow:'hidden' },
  activityRow:  { display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom:'1px solid #f5f5f0' },
  activityIcon: { width:36, height:36, borderRadius:10, backgroundColor:'#f5f5f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 },

  // Footer
  footer:       { backgroundColor:'#1c3520', borderRadius:20, padding:'40px 48px 24px', color:'#fff', marginTop:8 },
  footerTop:    { display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, paddingBottom:32, borderBottom:'1px solid rgba(255,255,255,0.1)' },
  footerLogo:   { fontSize:20, fontWeight:800, marginBottom:14, fontStyle:'italic' },
  footerTagline:{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.7, margin:'0 0 16px', maxWidth:260 },
  socialIcon:   { width:34, height:34, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.7)', cursor:'pointer' },
  footerColHead:{ fontSize:11, fontWeight:700, letterSpacing:1, color:'rgba(255,255,255,0.5)', marginBottom:14 },
  footerLink:   { fontSize:13, color:'rgba(255,255,255,0.75)', marginBottom:10, cursor:'pointer' },
  footerBottom: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:20, fontSize:11, color:'rgba(255,255,255,0.4)' },
};