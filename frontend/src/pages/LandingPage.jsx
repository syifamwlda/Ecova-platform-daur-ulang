import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import './LandingPage.css'

function FeatureCard({ icon, title, desc, active }) {
  return (
    <div className={`feature-card ${active ? 'active' : ''}`}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function StepCard({ num, title, desc }) {
  return (
    <div className="step-card">
      <div className="step-num">{num}</div>
      <div className="step-content">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  )
}

function ImpactStat({ icon, value, label }) {
  return (
    <div className="impact-stat">
      <span className="impact-icon">{icon}</span>
      <span className="impact-value">{value}</span>
      <span className="impact-label">{label}</span>
    </div>
  )
}

const PROYEK_TABS = [
  {
    num: '01',
    tag: 'Tanam Pohon Mu',
    title: 'Sampahmu, Hutan Masa Depan',
    desc: 'Setiap sampah yang kamu kumpulkan berkontribusi langsung pada penanaman pohon di kawasan hutan yang membutuhkan pemulihan ekosistem.',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80',
    pillIcon: '🌱',
    pillLabel: 'Gabung Gerakan Tanam Pohon Mu',
  },
  {
    num: '02',
    tag: 'Impact Tindakan',
    title: 'Impact Tindakan',
    desc: 'Lihat dampak nyata dari setiap aksi daur ulangmu dalam angka dan visualisasi yang mudah dipahami oleh semua orang.',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80',
    pillIcon: '📊',
    pillLabel: 'Lihat Dampak Nyatamu',
  },
  {
    num: '03',
    tag: 'Soil Achievement',
    title: 'Soil Achievement',
    desc: 'Raih pencapaian tanah sehat dengan berkontribusi pada program pemulihan lahan kritis di seluruh Indonesia.',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80',
    pillIcon: '🌍',
    pillLabel: 'Pulihkan Lahan Kritis',
  },
  {
    num: '04',
    tag: 'Eco Impact',
    title: 'Eco Impact',
    desc: 'Ukur dampak ekologis totalmu dan bandingkan dengan komunitas lain yang bergabung di platform kami.',
    img: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=900&q=80',
    pillIcon: '♻️',
    pillLabel: 'Bandingkan Eco Impact',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="landing page-enter">
      <Navbar />
      <Hero />

      <section className="section aksi-section" id="about">
        <div className="container">

          <div className="aksi-header">
            <div className="section-label">Proyek Dari Kami</div>
            <h2>Membangun Aksi Nyata Bersama <em>Ecovan</em></h2>
            <p>Yang Guru Menggugah Semangat, Sebarnya Jadi Sesuatu yang Berguna dan Berarti</p>
          </div>

          {/* Baris atas: foto besar + 2 kartu kanan */}
          <div className="aksi-top-grid">
            <div className="aksi-img-wrap">
              <img src="https://i.pinimg.com/736x/1e/3b/3e/1e3b3e0e0c84b18ff64c212a4a97e0dc.jpg" alt="recycling" />
            </div>
            <div className="aksi-cards-col">
              <div className="aksi-card">
                <div className="aksi-card-eyebrow">Jadi Diri Sendiri</div>
                <p>Pilah sampah mulai dari diri sendiri. Hal kecil yang kamu lakukan hari ini berdampak besar untuk masa depan bumi.</p>
                <button className="aksi-btn" onClick={() => navigate('/login')}>Baca Detail</button>
              </div>
              <div className="aksi-card">
                <div className="aksi-card-eyebrow">Jadi Hasil Galeri</div>
                <p>Wujudkan kreasi dari limbah dengan mengubah sampah menjadi karya seni yang bernilai ekonomi tinggi.</p>
                <button className="aksi-btn" onClick={() => navigate('/login')}>Baca Detail</button>
              </div>
            </div>
          </div>

          {/* Baris bawah: 2 kartu lebar */}
          <div className="aksi-bottom-grid">
            <div className="aksi-wide-card">
              <div className="aksi-wide-img">
                <img src="https://i.pinimg.com/736x/9f/82/56/9f825616a6918b5b8a3638081894f4dc.jpg" alt="komunitas" />
              </div>
              <div className="aksi-wide-body">
                <span className="aksi-eyebrow-tag">Komunitas</span>
                <h3>Komunitas Ecovan Waste to Worth Hub</h3>
                <p>Forum para penggerak perubahan dan pemilah sampah terbaik. Bergabung dan berbagi pengalaman bersama komunitas kami.</p>
                <button className="aksi-outline-btn" onClick={() => navigate('/login')}>Bergabung</button>
              </div>
            </div>
            <div className="aksi-wide-card aksi-wide-dark">
              <div className="aksi-wide-body">
                <span className="aksi-eyebrow-tag light">Edukasi</span>
                <h3>Sampah Bisa <em>Lebih dari Itu</em></h3>
                <p>Pelajari cara mengolah berbagai jenis sampah menjadi produk bernilai tinggi yang dapat dijual dan menambah penghasilan.</p>
                <button className="aksi-outline-btn light" onClick={() => navigate('/login')}>Bergabung</button>
              </div>
              <div className="aksi-wide-img">
                <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700&q=80" alt="edukasi" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PROYEK MENANAM ─────────────────────────────────────────────── */}
      <section className="section proyek-section" id="proyek">
        <div className="container">
          <div className="proyek-header">
            <div className="section-label">Proyek Menanam</div>
            <h2>Selain Mengolah Kami Juga <em>Menanam Pohon</em></h2>
            <p>Tata hanya menggugah sampah dari program kami untuk menanam pohon yang menjaga ekosistem kita dan generasi mendatang.</p>
          </div>

          <div className="proyek-tabs-wrap">
            {PROYEK_TABS.map((tab, i) => (
              <div
                key={tab.num}
                className={`proyek-tab ${activeTab === i ? 'proyek-tab-active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {activeTab === i ? (
                  /* ── EXPANDED STATE ── */
                  <>
                    <div className="proyek-tab-numrow">
                      <span className="proyek-tab-num">{tab.num}</span>
                    </div>
                    <div className="proyek-tab-inner">
                      <div className="proyek-tab-img-wrap">
                        <img src={tab.img} alt={tab.title} />
                        <div className="proyek-img-pill">
                          <span className="pill-icon">{tab.pillIcon}</span>
                          <div>
                            <strong>{tab.pillLabel}</strong>
                            <small>Bersama Masa Depan</small>
                          </div>
                        </div>
                      </div>
                      <div className="proyek-tab-desc">
                        <span className="proyek-tab-tag">{tab.tag}</span>
                        <h3>{tab.title}</h3>
                        <p>{tab.desc}</p>
                        <button
                          className="proyek-tab-cta"
                          onClick={(e) => { e.stopPropagation(); navigate('/login') }}
                        >
                          Pelajari Program →
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ── COLLAPSED STATE ── */
                  <>
                    <span className="proyek-tab-num collapsed">{tab.num}</span>
                    <span className="proyek-tab-vert-label">{tab.tag}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Fitur Unggulan</div>
            <h2>Solusi Lengkap Untuk Pengelolaan Sampahmu</h2>
            <p>Teknologi canggih yang memudahkan setiap langkah proses daur ulang</p>
          </div>
          <div className="features-grid">
            <FeatureCard icon="📦" title="Penjemputan Mudah"    desc="Jadwalkan penjemputan sampah dari rumah dengan mudah melalui aplikasi. Kurir kami siap datang sesuai waktu yang kamu pilih." />
            <FeatureCard icon="💰" title="Dapatkan Penghasilan" desc="Tukarkan sampah daur ulangmu dengan poin dan uang tunai. Semakin banyak daur ulang, semakin banyak penghasilan." active />
            <FeatureCard icon="📊" title="Lacak Dampakmu"       desc="Pantau kontribusi lingkunganmu secara real-time. Lihat berapa banyak CO₂ yang berhasil kamu kurangi." />
            <FeatureCard icon="🤝" title="Komunitas Hijau"      desc="Bergabung dengan komunitas peduli lingkungan. Ikuti tantangan, raih badge, dan bersaing di leaderboard." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="section how-section" id="how">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Cara Kerja</div>
            <h2>Mulai Daur Ulang dalam 3 Langkah</h2>
          </div>
          <div className="steps-grid">
            <StepCard num="01" title="Daftar & Verifikasi" desc="Buat akun gratis, verifikasi email, dan lengkapi profil kamu dalam 2 menit." />
            <StepCard num="02" title="Pilah Sampahmu"      desc="Pisahkan sampah berdasarkan kategori: organik, plastik, kertas, dan logam." />
            <StepCard num="03" title="Jemput & Tukar"      desc="Jadwalkan penjemputan dan tukarkan sampahmu dengan poin atau uang tunai." />
          </div>
        </div>
      </section>

      {/* ── IMPACT ─────────────────────────────────────────────────────── */}
      <section className="section impact-section" id="impact">
        <div className="container">
          <div className="impact-inner">
            <div className="impact-text">
              <div className="section-label light">Dampak Nyata</div>
              <h2>Bersama Kita Ubah Dunia</h2>
              <p>Setiap kilogram sampah yang kamu daur ulang berkontribusi pada masa depan yang lebih hijau.</p>
              <button className="btn-primary-green" onClick={() => navigate('/login')}>Mulai Berkontribusi</button>
            </div>
            <div className="impact-stats-grid">
              <ImpactStat icon="♻️" value="10.4K" label="Ton Sampah Didaur Ulang" />
              <ImpactStat icon="🌳" value="52K+"  label="Pohon Setara CO₂ Diselamatkan" />
              <ImpactStat icon="💧" value="8.2M"  label="Liter Air Dihemat" />
              <ImpactStat icon="👥" value="120K+" label="Anggota Aktif" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ajak & Tumbuh Bersama</h2>
              <p>Undang teman dan dapatkan bonus poin untuk setiap anggota baru yang bergabung</p>
            </div>
            <div className="cta-actions">
              <input type="email" placeholder="Masukkan email temanmu..." className="cta-input" />
              <button className="cta-btn" onClick={() => navigate('/login')}>Undang Sekarang</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo"><span>♻</span><span>Ecovan</span></div>
              <p>Platform daur ulang cerdas untuk Indonesia yang lebih hijau.</p>
              <div className="footer-socials">
                {['📘','📸','🐦','▶️'].map((s,i) => <span key={i} className="social-icon">{s}</span>)}
              </div>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <ul><li>Cara Kerja</li><li>Harga Sampah</li><li>Jadwal Jemput</li><li>Komunitas</li></ul>
            </div>
            <div className="footer-col">
              <h4>Perusahaan</h4>
              <ul><li>Tentang Kami</li><li>Karier</li><li>Blog</li><li>Press</li></ul>
            </div>
            <div className="footer-col">
              <h4>Dukungan</h4>
              <ul><li>Pusat Bantuan</li><li>Kebijakan Privasi</li><li>Syarat & Ketentuan</li><li>Kontak</li></ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Ecovan. Dibuat dengan 💚 untuk bumi yang lebih baik.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}