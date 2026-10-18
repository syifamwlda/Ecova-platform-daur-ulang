import { useNavigate } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero-section" id="hero">
      <div className="hero-wrapper">
        {/* Main Hero Split */}
        <div className="hero-grid">
          {/* Left Column: Text & CTA */}
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="badge-pulse"></span>
              ECOVA — PLATFORM DAUR ULANG DIGITAL
            </div>

            <h1 className="hero-title">
              Turn Waste<br />
              Into <span className="hero-title-highlight">Worth</span>
            </h1>

            <p className="hero-description">
              Platform pengolahan sampah digital yang membantu masyarakat mendaur ulang sampah plastik & limbah rumah tangga menjadi nilai ekonomi yang berkelanjutan.
            </p>

            {/* Avatar Social Proof */}
            <div className="hero-social-proof">
              <div className="avatar-group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                  alt="Member 1"
                  className="avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Member 2"
                  className="avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                  alt="Member 3"
                  className="avatar-img"
                />
              </div>
              <span className="social-proof-text">
                <strong>1,2k+ Anggota</strong> telah bergabung daur ulang bersama
              </span>
            </div>
          </div>

          {/* Right Column: Visual with Floating Badges */}
          <div className="hero-visual-container">
            <div className="hero-art-card">
              {/* Main Visual Image */}
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80"
                alt="Ecova Recycling Visual"
                className="hero-main-img"
              />

              {/* Floating Badge 1 - Top Left */}
              <div className="floating-badge badge-top-left">
                <div className="badge-icon-box">🎁</div>
                <div className="badge-text-box">
                  <strong>Kompensasi dan reward</strong>
                  <p>Sampah dikonversi menjadi saldo & poin</p>
                </div>
              </div>

              {/* Floating Badge 2 - Bottom Right */}
              <div className="floating-badge badge-bottom-right">
                <div className="badge-icon-box">⚡</div>
                <div className="badge-text-box">
                  <strong>Daur Ulang Lebih Cepat</strong>
                  <p>Jemput langsung ke rumahmu oleh tim mitra</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-hero 2-Column Banner */}
        <div className="hero-subbanner">
          <div className="subbanner-left">
            <h2 className="subbanner-title">
              <span className="highlight-lime">Sampah</span> Jadi Lebih Berarti Dan Berguna
            </h2>
          </div>
          <div className="subbanner-right">
            <p className="subbanner-desc">
              Gerakan peduli lingkungan bukan sekadar wacana. Melalui sistem terpadu Ecova, setiap kilogram sampah yang kamu kumpulkan berkontribusi langsung pada kelestarian alam dan bernilai nyata bagi kehidupan sehari-hari.
            </p>
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="metrics-banner">
          <div className="metrics-intro">
            <h3>Total Sampah Dari Semua Anggota</h3>
          </div>
          <div className="metrics-stats">
            <div className="metric-item">
              <span className="metric-label">Sampah Terkelola</span>
              <span className="metric-value">+10 Ton</span>
            </div>
            <div className="metric-separator"></div>
            <div className="metric-item">
              <span className="metric-label">Pohon Tertanam</span>
              <span className="metric-value">125.700</span>
            </div>
            <div className="metric-separator"></div>
            <div className="metric-item">
              <span className="metric-label">Total Mitra</span>
              <span className="metric-value">700+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
