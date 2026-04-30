import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLanding = location.pathname === '/'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${!isLanding ? 'solid' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">♻</span>
          <span className="logo-text">Ecova</span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>Tentang</a></li>
          <li><a href="#features" onClick={() => setMenuOpen(false)}>Fitur</a></li>
          <li><a href="#how" onClick={() => setMenuOpen(false)}>Cara Kerja</a></li>
          <li><a href="#impact" onClick={() => setMenuOpen(false)}>Dampak</a></li>
        </ul>

        <button className="navbar-cta" onClick={() => navigate('/login')}>
          Bergabung Sekarang
        </button>
      </div>
    </nav>
  )
}
