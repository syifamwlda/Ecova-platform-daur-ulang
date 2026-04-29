import { useNavigate } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">
      {/* Background layers */}
      <div className="hero-bg">
        <div className="hero-bg-circle c1"></div>
        <div className="hero-bg-circle c2"></div>
        <div className="hero-bg-dots"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Platform Daur Ulang #1 di Indonesia
        </div>

        <h1 className="hero-title">
          Ubah Sampah<br />
          Menjadi <em>Nilai</em>
        </h1>

        <p className="hero-desc">
          Bergabunglah bersama ribuan warga yang telah mengubah sampah menjadi
          manfaat nyata. Bersama Ecovan, setiap tindakan kecil menciptakan
          dampak besar bagi bumi kita.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Bergabung Sekarang
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button className="btn-secondary">
            <span className="play-icon">▶</span>
            Lihat Cara Kerja
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">+10K</span>
            <span className="stat-label">Ton Sampah Daur Ulang</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">120K+</span>
            <span className="stat-label">Anggota Aktif</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">300+</span>
            <span className="stat-label">Kota Terjangkau</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-card main-card">
          <div className="card-icon">🌱</div>
          <div className="card-text">
            <strong>Sampah Organik</strong>
            <span>Dijemput hari ini</span>
          </div>
          <div className="card-badge green">Aktif</div>
        </div>
        <div className="visual-card side-card">
          <div className="card-icon">♻️</div>
          <div className="card-text">
            <strong>Plastik Botol</strong>
            <span>2.4 kg → Rp 12.000</span>
          </div>
        </div>
        <div className="visual-orb orb1"></div>
        <div className="visual-orb orb2"></div>
        <div className="hero-img-wrap">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80" alt="recycling" />
        </div>
      </div>
    </section>
  )
}
