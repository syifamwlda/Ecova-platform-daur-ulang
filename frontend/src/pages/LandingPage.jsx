import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import './LandingPage.css'

// Feature Card Component
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="feature-card" style={{ '--accent': color }}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

// Step Card Component
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

// Stat Card Component
function ImpactStat({ icon, value, label }) {
  return (
    <div className="impact-stat">
      <span className="impact-icon">{icon}</span>
      <span className="impact-value">{value}</span>
      <span className="impact-label">{label}</span>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing page-enter">
      <Navbar />
      <Hero />

      {/* About Section */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80" alt="recycling team" />
              <div className="about-tag">
                <span>🌍</span>
                <span>Untuk Bumi yang Lebih Baik</span>
              </div>
            </div>
            <div className="about-text">
              <div className="section-label">Tentang Kami</div>
              <h2>Membangun Masa Depan Tanpa Sampah</h2>
              <p>
                Trecycling hadir sebagai solusi cerdas pengelolaan sampah berbasis teknologi.
                Kami menghubungkan warga, pengepul, dan industri daur ulang dalam satu ekosistem
                yang efisien dan transparan.
              </p>
              <p>
                Dengan platform kami, sampah bukan lagi masalah — melainkan sumber daya
                yang dapat diubah menjadi nilai ekonomi sekaligus menjaga kelestarian lingkungan.
              </p>
              <div className="about-points">
                {['Penjemputan terjadwal di depan pintu', 'Harga transparan & fair untuk setiap jenis sampah', 'Laporan dampak lingkungan real-time'].map(p => (
                  <div key={p} className="about-point">
                    <span className="point-check">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Fitur Unggulan</div>
            <h2>Solusi Lengkap Untuk Pengelolaan Sampahmu</h2>
            <p>Teknologi canggih yang memudahkan setiap langkah proses daur ulang</p>
          </div>

          <div className="features-grid">
            <FeatureCard
              icon="📦"
              title="Penjemputan Mudah"
              desc="Jadwalkan penjemputan sampah dari rumah dengan mudah melalui aplikasi. Kurir kami siap datang sesuai waktu yang kamu pilih."
              color="#4a8c5c"
            />
            <FeatureCard
              icon="💰"
              title="Dapatkan Penghasilan"
              desc="Tukarkan sampah daur ulangmu dengan poin dan uang tunai. Semakin banyak daur ulang, semakin banyak penghasilan."
              color="#c9a84c"
            />
            <FeatureCard
              icon="📊"
              title="Lacak Dampakmu"
              desc="Pantau kontribusi lingkunganmu secara real-time. Lihat berapa banyak CO₂ yang berhasil kamu kurangi."
              color="#3d7a5c"
            />
            <FeatureCard
              icon="🤝"
              title="Komunitas Hijau"
              desc="Bergabung dengan komunitas peduli lingkungan. Ikuti tantangan, raih badge, dan bersaing di leaderboard."
              color="#7ab893"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section" id="how">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Cara Kerja</div>
            <h2>Mulai Daur Ulang dalam 3 Langkah</h2>
          </div>

          <div className="steps-grid">
            <StepCard
              num="01"
              title="Daftar & Verifikasi"
              desc="Buat akun gratis, verifikasi email, dan lengkapi profil kamu dalam 2 menit."
            />
            <StepCard
              num="02"
              title="Pilah Sampahmu"
              desc="Pisahkan sampah berdasarkan kategori: organik, plastik, kertas, dan logam."
            />
            <StepCard
              num="03"
              title="Jemput & Tukar"
              desc="Jadwalkan penjemputan dan tukarkan sampahmu dengan poin atau uang tunai."
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section impact-section" id="impact">
        <div className="container">
          <div className="impact-inner">
            <div className="impact-text">
              <div className="section-label light">Dampak Nyata</div>
              <h2>Bersama Kita Ubah Dunia</h2>
              <p>
                Setiap kilogram sampah yang kamu daur ulang berkontribusi pada masa depan
                yang lebih hijau. Ini adalah dampak kolektif komunitas Trecycling.
              </p>
              <button className="btn-primary-green" onClick={() => navigate('/login')}>
                Mulai Berkontribusi
              </button>
            </div>
            <div className="impact-stats-grid">
              <ImpactStat icon="♻️" value="10.4K" label="Ton Sampah Didaur Ulang" />
              <ImpactStat icon="🌳" value="52K+" label="Pohon Setara CO₂ Diselamatkan" />
              <ImpactStat icon="💧" value="8.2M" label="Liter Air Dihemat" />
              <ImpactStat icon="👥" value="120K+" label="Anggota Aktif" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ajak & Tumbuh Bersama</h2>
              <p>Undang teman dan dapatkan bonus poin untuk setiap anggota baru yang bergabung</p>
            </div>
            <div className="cta-actions">
              <input type="email" placeholder="Masukkan email temanmu..." className="cta-input" />
              <button className="cta-btn" onClick={() => navigate('/login')}>
                Undang Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span>♻</span>
                <span>Trecycling</span>
              </div>
              <p>Platform daur ulang cerdas untuk Indonesia yang lebih hijau.</p>
              <div className="footer-socials">
                {['📘', '📸', '🐦', '▶️'].map((s, i) => (
                  <span key={i} className="social-icon">{s}</span>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li>Cara Kerja</li>
                <li>Harga Sampah</li>
                <li>Jadwal Jemput</li>
                <li>Komunitas</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Perusahaan</h4>
              <ul>
                <li>Tentang Kami</li>
                <li>Karier</li>
                <li>Blog</li>
                <li>Press</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Dukungan</h4>
              <ul>
                <li>Pusat Bantuan</li>
                <li>Kebijakan Privasi</li>
                <li>Syarat & Ketentuan</li>
                <li>Kontak</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Trecycling. Dibuat dengan 💚 untuk bumi yang lebih baik.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
