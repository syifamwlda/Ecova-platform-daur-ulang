import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { login } from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [pwStrength, setPwStrength] = useState(0)
  const [focused, setFocused] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (name === 'password') {
      let score = 0
      if (value.length >= 6) score++
      if (value.length >= 10) score++
      if (/[A-Z]/.test(value)) score++
      if (/[0-9]/.test(value)) score++
      if (/[^A-Za-z0-9]/.test(value)) score++
      setPwStrength(value.length === 0 ? 0 : score)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!form.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setErrors({})
    try {
      const res = await login(form.email, form.password)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.email?.[0]
        || 'Email atau password salah.'
      setErrors({ api: msg })
    } finally {
      setLoading(false)
    }
  }

  const strengthLabels = ['', 'Lemah', 'Kurang', 'Cukup', 'Kuat', 'Sangat Kuat']
  const strengthColors = ['', '#e05555', '#e07c55', '#e0b255', '#7ab839', '#2d6b46']

  return (
    <div className="login-page page-enter">
      <Navbar />

      {/* Left panel */}
      <div className="login-panel">
        <div className="panel-overlay" />
        <img
          src="https://images.openai.com/static-rsc-4/HrlSAfeXZ7qCC7l1tz7MOL9z9lgdSPd1Dg8S5qCNRk3kykHtb5ZxwtJGwVYM1btZyWbBfalINLaxeoL4rzqzFXotXw1TLPSNY30ndSVMVemfpxFsebwacRvbV0PA9VBpFZKsH-PihyEbzElgljSA_f6Ojjp_3XOCbWHV5bhHU_y0_3ck2ANTRZjgijtSMoh6?purpose=fullsize"
          alt="eco background"
          className="panel-img"
        />
        <div className="panel-blob panel-blob--1" />
        <div className="panel-blob panel-blob--2" />
        <div className="panel-content">
          <div className="panel-logo">
            <div className="panel-logo-icon">♻</div>
            <span>Ecova</span>
          </div>

          <div className="panel-quote-card">
            <div className="panel-quote-bar" />
            <blockquote className="panel-quote">
              "Setiap tindakan kecilmu hari ini adalah investasi terbesar untuk bumi anak cucumu."
            </blockquote>
          </div>

          <div className="panel-stats">
            <div className="panel-stat">
              <strong>10K+</strong>
              <span>Ton Didaur Ulang</span>
            </div>
            <div className="panel-stat">
              <strong>120K</strong>
              <span>Anggota Aktif</span>
            </div>
            <div className="panel-stat">
              <strong>98%</strong>
              <span>Kepuasan User</span>
            </div>
          </div>

          <div className="panel-trust">
            <span className="panel-trust-dot" />
            <span>Platform daur ulang terpercaya sejak 2020</span>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="login-form-side">
        <div className="login-form-wrap">
          <button className="back-btn" onClick={() => navigate('/')}>
            <span className="back-btn-arrow">←</span>
            Kembali ke Beranda
          </button>

          <div className="login-header">
            <h1>Selamat Datang <span className="wave">👋</span></h1>
            <p>Masuk untuk mulai berkontribusi bagi lingkungan</p>
          </div>

          {errors.api && (
            <div className="api-error">
              <span className="api-error-icon">⚠</span>
              {errors.api}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={`form-group ${errors.email ? 'has-error' : ''} ${focused === 'email' ? 'is-focused' : ''} ${form.email ? 'is-filled' : ''}`}>
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="1" y="2.5" width="13" height="10" rx="2" />
                    <path d="M1 5l6.5 4.5L14 5" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="email@contoh.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="error-msg">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password ? 'has-error' : ''} ${focused === 'password' ? 'is-focused' : ''} ${form.password ? 'is-filled' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="2" y="7" width="11" height="7" rx="2" />
                    <path d="M5 7V5a2.5 2.5 0 015 0v2" />
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="strength-segment"
                        style={{ background: i <= pwStrength ? strengthColors[pwStrength] : undefined }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColors[pwStrength] }}>
                    {strengthLabels[pwStrength]}
                  </span>
                </div>
              )}

              {errors.password && <span className="error-msg">⚠ {errors.password}</span>}
            </div>

            <div className="form-extras">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-link">Lupa password?</a>
            </div>

            <button type="submit" className={`submit-btn ${loading ? 'is-loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Memproses...
                </span>
              ) : (
                <span className="btn-text">
                  Masuk Sekarang
                  <span className="btn-arrow">→</span>
                </span>
              )}
            </button>
          </form>

          <div className="divider"><span>atau masuk dengan</span></div>

          <div className="social-login">
            <button className="social-btn">
              <span className="g-circle">G</span>
              Masuk dengan Google
            </button>
          </div>

          <p className="register-prompt">
            Belum punya akun?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>
              Daftar gratis
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}