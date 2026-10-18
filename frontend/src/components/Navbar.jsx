import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLanding = location.pathname === '/'

  return (
    <header className={`navbar-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.57-.88 1.78 1.78 0 0 0 0-1.78l-3.95-6.84" />
              <path d="M16.8 5H7.2a1.8 1.8 0 0 0-1.57.89 1.78 1.78 0 0 0 0 1.78l1.6 2.77" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="brand-name">Ecova</span>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-nav-links ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <li><a href="#hero" onClick={() => setMenuOpen(false)}>Beranda</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>Tentang Kami</a></li>
          <li><a href="#proyek" onClick={() => setMenuOpen(false)}>Program Hijau</a></li>
          <li><a href="#features" onClick={() => setMenuOpen(false)}>Aksi Nyata</a></li>
          <li><a href="#kontak" onClick={() => setMenuOpen(false)}>Kontak</a></li>
        </ul>

        {/* CTA Button */}
        <div className="navbar-actions">
          <button className="navbar-cta-pill" onClick={() => navigate('/login')}>
            Gabung Sekarang
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            className={`navbar-hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  )
}
