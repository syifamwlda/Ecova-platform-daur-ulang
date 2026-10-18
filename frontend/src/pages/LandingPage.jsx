import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import './LandingPage.css'

// Program Menanam Tabs Data
const PROGRAM_TABS = [
  {
    num: '01',
    tag: 'Tanam Pohon Mu',
    title: 'Sampahmu, Hutan Masa Depan',
    desc: 'Setiap sampah yang kamu kumpulkan berkontribusi langsung pada penanaman pohon di kawasan hutan yang membutuhkan pemulihan ekosistem.',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80',
    badgeText: 'Setiap 10kg sampah = 1 bibit pohon ditanamkan',
    badgeTitle: 'Tanam Harapanmu',
    ctaText: 'Pelajari Program →',
  },
  {
    num: '02',
    tag: 'Adopsi Pohon',
    title: 'Adopsi Pohon Mandiri',
    desc: 'Pantau pertumbuhan pohon adopsimu secara berkala melalui laporan digital berbasis satelit dan GPS yang transparan.',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80',
    badgeText: 'GPS & Satelit Monitoring Real-time',
    badgeTitle: 'Transparansi Penuh',
    ctaText: 'Lihat Adopsi →',
  },
  {
    num: '03',
    tag: 'Hutan Komunitas',
    title: 'Hutan Bersama Komunitas',
    desc: 'Gotong royong bersama komunitas Ecova menghijaukan kembali pesisir pantai dengan tanaman mangrove penahan abrasi.',
    img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&q=80',
    badgeText: '1.200+ Pohon Mangrove Tertanam',
    badgeTitle: 'Aksi Kolektif',
    ctaText: 'Ikuti Komunitas →',
  },
  {
    num: '04',
    tag: 'Dampak Karbon',
    title: 'Kalkulasi Jejak Karbon',
    desc: 'Ketahui estimasi reduksi jejak karbon yang telah kamu hasilkan dari setiap kilogram sampah yang berhasil didaur ulang.',
    img: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=900&q=80',
    badgeText: 'Emisi Karbon Tereduksi Hingga 45%',
    badgeTitle: 'Net Zero Target',
    ctaText: 'Hitung Karbon →',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [selectedTag1, setSelectedTag1] = useState('Penghijauan Berkelanjutan')
  const [selectedTag2, setSelectedTag2] = useState('Daur Ulang Bersih')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const handleInviteSubmit = (e) => {
    e.preventDefault()
    if (!inviteEmail) return
    setInviteSuccess(true)
    setTimeout(() => {
      setInviteSuccess(false)
      setInviteEmail('')
    }, 4000)
  }

  return (
    <div className="landing-page-root">
      {/* Navbar */}
      <Navbar />

      {/* Hero + Sub-banner + Metrics */}
      <Hero />

      {/* ── SECTION 1: MEMBANGUN AKSI NYATA (BENTO GRID) ── */}
      <section className="section aksi-section" id="about">
        <div className="container">
          <div className="section-title-center">
            <span className="section-pill-label">Aksi & Kontribusi</span>
            <h2 className="section-heading-main">
              Membangun Aksi Nyata Bersama <em className="accent-green">Ecoruk</em>
            </h2>
            <p className="section-subtitle-main">
              Mulai dari langkah kecil di rumahmu, ciptakan dampak raksasa untuk kelestarian bumi bersama.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {/* Bento Card 1: Left Tall Community Card */}
            <div className="bento-card bento-card-tall">
              <img
                src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&q=80"
                alt="Komunitas Daur Ulang"
                className="bento-bg-img"
              />
              <div className="bento-card-overlay">
                <div className="bento-badge-pill">
                  <span className="pill-dot"></span>
                  Komunitas
                </div>
                <h3 className="bento-title">Komunitas Peduli: Waste to Worth Hub</h3>
                <p className="bento-desc">
                  Wadah kolaborasi pemilah sampah dan pegiat lingkungan di kotamu.
                </p>
                <button className="bento-btn-primary" onClick={() => navigate('/login')}>
                  Bergabung
                </button>
              </div>
            </div>

            {/* Bento Right Column */}
            <div className="bento-right-column">
              {/* Row of 2 Small Cards */}
              <div className="bento-row-cards">
                {/* Bento Card 2: White Pilah Mandiri */}
                <div className="bento-card bento-card-light">
                  <div className="bento-icon-tag">🌱</div>
                  <h4 className="bento-small-title">Pilah Dari Diri Sendiri</h4>
                  <p className="bento-small-desc">
                    Langkah kecilmu memilah dari rumah adalah awal rantai daur ulang bersih.
                  </p>
                  <button className="bento-btn-dark" onClick={() => navigate('/login')}>
                    Baca Detail
                  </button>
                </div>

                {/* Bento Card 3: Lime Green Jemput Sampah */}
                <div className="bento-card bento-card-lime">
                  <div className="bento-icon-tag lime-icon">🚚</div>
                  <h4 className="bento-small-title">Jemput Sampah Mudah</h4>
                  <p className="bento-small-desc">
                    Jadwalkan penjemputan gratis langsung di depan pintu rumahmu.
                  </p>
                  <button className="bento-btn-white" onClick={() => navigate('/login')}>
                    Jadwalkan
                  </button>
                </div>
              </div>

              {/* Bento Card 4: Workshop Education Card */}
              <div className="bento-card bento-card-education">
                <div className="education-content">
                  <span className="bento-badge-pill light">Edukasi</span>
                  <h3 className="bento-title">Sampah Bisa Lebih dari Itu</h3>
                  <p className="bento-desc">
                    Pelajari cara mengolah limbah bernilai ekonomis tinggi melalui workshop kami.
                  </p>
                  <button className="bento-btn-primary" onClick={() => navigate('/login')}>
                    Pelajari
                  </button>
                </div>
                <div className="education-media">
                  <img
                    src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80"
                    alt="Edukasi dan Pelatihan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SELAIN MENGOLAH KAMI JUGA MENANAM POHON (ACCORDION) ── */}
      <section className="section proyek-section" id="proyek">
        <div className="container">
          <div className="section-title-center">
            <span className="section-pill-label">Program Hijau</span>
            <h2 className="section-heading-main">
              Selain Mengolah Kami Juga <em className="accent-green">Menanam Pohon</em>
            </h2>
            <p className="section-subtitle-main">
              Setiap sampah yang berhasil diolah dikonversi langsung menjadi bibit pohon untuk memulihkan hutan kritis di Indonesia.
            </p>
          </div>

          {/* Interactive Horizontal Accordion */}
          <div className="accordion-container">
            {PROGRAM_TABS.map((tab, idx) => {
              const isActive = activeTab === idx
              return (
                <div
                  key={tab.num}
                  className={`accordion-item ${isActive ? 'is-expanded' : 'is-collapsed'}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {isActive ? (
                    /* EXPANDED VIEW */
                    <div className="accordion-expanded-view">
                      <div className="accordion-header-row">
                        <span className="accordion-num-badge">{tab.num}</span>
                        <div className="accordion-header-texts">
                          <h3 className="accordion-title">{tab.title}</h3>
                          <p className="accordion-desc">{tab.desc}</p>
                        </div>
                      </div>

                      <div className="accordion-visual-wrapper">
                        <img src={tab.img} alt={tab.title} className="accordion-img" />
                        <div className="accordion-floating-badge">
                          <div className="accordion-badge-icon">🌿</div>
                          <div>
                            <strong>{tab.badgeTitle}</strong>
                            <p>{tab.badgeText}</p>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-footer-row">
                        <button
                          className="accordion-cta-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/login')
                          }}
                        >
                          {tab.ctaText}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* COLLAPSED VIEW */
                    <div className="accordion-collapsed-view">
                      <span className="accordion-collapsed-num">{tab.num}</span>
                      <span className="accordion-collapsed-label">{tab.tag}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ALTERNATING STORIES & INTERACTIVE TAGS ── */}
      <section className="section stories-section" id="features">
        <div className="container">
          {/* Story Row 1: Image Left, Content Right */}
          <div className="story-row">
            <div className="story-media-wrap">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80"
                alt="Tanam Masa Depan"
                className="story-img"
              />
            </div>
            <div className="story-content-wrap">
              <div className="story-icon-box">🌱</div>
              <h3 className="story-title">Mulai dari Sampah, Tumbuhkan Masa Depan</h3>
              <p className="story-desc">
                Dari botol plastik yang kamu kumpulkan hingga pohon rindang yang menaungi bumi, semua berawal dari kepedulian langkah pertamamu hari ini.
              </p>

              {/* Interactive Tags */}
              <div className="story-tags-group">
                {['Penghijauan Berkelanjutan', 'Kontribusi Nyata', 'Bibit Berkualitas'].map((t) => (
                  <button
                    key={t}
                    className={`story-tag-pill ${selectedTag1 === t ? 'active' : ''}`}
                    onClick={() => setSelectedTag1(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story Row 2: Content Left, Image Right */}
          <div className="story-row story-row-reverse">
            <div className="story-content-wrap">
              <div className="story-icon-box recycle-icon">♻️</div>
              <h3 className="story-title">Sampahmu Lebih dari Sekedar Buangan</h3>
              <p className="story-desc">
                Setiap material yang terpilah memiliki siklus hidup baru. Dukung pertumbuhan ekonomi sirkular untuk masa depan bumi dan generasi mendatang.
              </p>

              {/* Interactive Tags */}
              <div className="story-tags-group">
                {['Pengolahan Akurat', 'Daur Ulang Bersih', 'Tracking Real-time'].map((t) => (
                  <button
                    key={t}
                    className={`story-tag-pill ${selectedTag2 === t ? 'active' : ''}`}
                    onClick={() => setSelectedTag2(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="story-media-wrap">
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=700&q=80"
                alt="Daur Ulang Bersih"
                className="story-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THREE ACTION PILLARS ── */}
      <section className="section pillars-section">
        <div className="container">
          <div className="pillars-grid">
            <div className="pillar-card" onClick={() => navigate('/login')}>
              <div className="pillar-icon-box">♻️</div>
              <h4 className="pillar-title">Kelola Sampah</h4>
              <p className="pillar-desc">Pilah dan jadwalkan penjemputan sampahmu dengan cepat langsung dari aplikasi.</p>
            </div>
            <div className="pillar-card" onClick={() => navigate('/login')}>
              <div className="pillar-icon-box">🌳</div>
              <h4 className="pillar-title">Dampak Hijau</h4>
              <p className="pillar-desc">Konversi poin daur ulang menjadi bibit pohon untuk gerakan restorasi alam.</p>
            </div>
            <div className="pillar-card" onClick={() => navigate('/login')}>
              <div className="pillar-icon-box">🤝</div>
              <h4 className="pillar-title">Gerak Bersama</h4>
              <p className="pillar-desc">Terhubung dengan ribuan relawan dan komunitas peduli lingkungan sekitarmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: AJAK & TUMBUH BERSAMA (CTA BANNER) ── */}
      <section className="section cta-banner-section" id="kontak">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-media">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80"
                alt="Bergabung Bersama"
                className="cta-circle-img"
              />
            </div>
            <div className="cta-banner-content">
              <h2 className="cta-heading">
                Ajak & Tumbuh <em className="accent-italic">Bersama</em>
              </h2>
              <p className="cta-desc">
                Ajak teman dan keluargamu bergerak bersama Ecova. Raih bonus saldo dan poin reward untuk setiap aksi daur ulang pertamamu!
              </p>

              <form onSubmit={handleInviteSubmit} className="cta-form">
                <div className="cta-input-wrapper">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Tuliskan Email Kamu..."
                    className="cta-email-input"
                    required
                  />
                  <button type="submit" className="cta-submit-btn">
                    Mulai Sekarang
                  </button>
                </div>
                {inviteSuccess && (
                  <div className="cta-success-toast">
                    🎉 Terima kasih! Tautan pendaftaran telah dikirim ke email kamu.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-dark">
        <div className="container">
          <div className="footer-main-grid">
            {/* Col 1: Brand Info */}
            <div className="footer-brand-col">
              <div className="footer-brand-logo">
                <span className="brand-dot">♻</span>
                <span className="brand-title">Ecova</span>
              </div>
              <p className="footer-brand-desc">
                Platform daur ulang berbasis web dengan sistem reward, eco marketplace, dan kontribusi nyata untuk kelestarian lingkungan.
              </p>
              <div className="footer-social-links">
                <a href="#twitter" aria-label="X">𝕏</a>
                <a href="#instagram" aria-label="Instagram">📸</a>
                <a href="#github" aria-label="GitHub">🐙</a>
                <a href="#linkedin" aria-label="LinkedIn">💼</a>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div className="footer-nav-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#hero">Beranda</a></li>
                <li><a href="#about">Tentang Kami</a></li>
                <li><a href="#proyek">Program Hijau</a></li>
                <li><a href="#features">Aksi Nyata</a></li>
              </ul>
            </div>

            {/* Col 3: Layanan */}
            <div className="footer-nav-col">
              <h4>Layanan</h4>
              <ul>
                <li><a href="#" onClick={() => navigate('/login')}>Jemput Sampah</a></li>
                <li><a href="#" onClick={() => navigate('/login')}>Eco Marketplace</a></li>
                <li><a href="#" onClick={() => navigate('/login')}>Tukar Saldo DANA</a></li>
                <li><a href="#" onClick={() => navigate('/login')}>Adopsi Pohon</a></li>
              </ul>
            </div>

            {/* Col 4: Kontak & Legal */}
            <div className="footer-nav-col">
              <h4>Bantuan</h4>
              <ul>
                <li><a href="#kontak">Hubungi Kami</a></li>
                <li><a href="#">Pusat Bantuan</a></li>
                <li><a href="#">Kebijakan Privasi</a></li>
                <li><a href="#">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© 2026 Ecova — Platform Daur Ulang & Eco Marketplace. Hak Cipta Dilindungi.</p>
            <div className="footer-legal-links">
              <a href="#">Kebijakan Privasi</a>
              <span className="dot-divider">•</span>
              <a href="#">Syarat Penggunaan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}