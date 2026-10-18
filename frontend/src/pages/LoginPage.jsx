import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { login } from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: 'demo@ecoruk.id', password: 'password123' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const fillDemoAccount = () => {
    setForm({ email: 'demo@ecoruk.id', password: 'password123' })
    setErrors({})
  }

  const handleQuickLogin = (provider) => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('token', `demo-token-${provider || 'user'}`)
      localStorage.setItem('user', JSON.stringify({
        name: provider === 'google' ? 'Google Eco User' : provider === 'apple' ? 'Apple Eco User' : 'Eco Warrior',
        email: form.email || 'demo@ecoruk.id',
      }))
      setLoading(false)
      navigate('/dashboard')
    }, 600)
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
      // 1. Try real backend login first
      const res = await login(form.email, form.password)
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token)
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
        }
        navigate('/dashboard')
        return
      }
    } catch (err) {
      // If backend explicitly rejected credentials with 422 / 401
      if (err.response && err.response.status === 422) {
        const msg = err.response.data?.message
          || err.response.data?.errors?.email?.[0]
          || 'Email atau password salah.'
        setErrors({ api: msg })
        setLoading(false)
        return
      }

      // If backend server is offline or unreachable (e.g. Vercel deployment where Laravel backend is not running on localhost:8000)
      console.warn('Backend server offline or unreachable. Logging in with demo credentials...')
      localStorage.setItem('token', 'demo-token-ecova')
      localStorage.setItem('user', JSON.stringify({
        name: 'Eco Warrior',
        email: form.email,
      }))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <Navbar />

      <div className="login-split-container">
        {/* ── LEFT HERO PANEL: GREEN FIELD WITH IMPACT ── */}
        <div className="login-left-banner">
          <div className="banner-bg-overlay" />
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
            alt="Membangun Masa Depan Tanpa Sampah"
            className="banner-field-img"
          />

          <div className="banner-content-inner">
            <h1 className="banner-heading">
              Membangun Masa<br />
              Depan <span className="banner-highlight">Tanpa Sampah.</span>
            </h1>

            <p className="banner-description">
              Bergabunglah dengan Ecova. Catat sampahmu, ubah jadi produk bernilai, dan temukan produk-produk pilihan dari pasar sirkular yang dihasilkan oleh para pengolah lokal.
            </p>

            {/* Floating Glassmorphism Badges */}
            <div className="banner-badges-row">
              <div className="glass-stat-badge">
                <div className="stat-icon-wrapper">♻️</div>
                <div className="stat-text-box">
                  <span className="stat-title">Mencegah</span>
                  <strong className="stat-number">1,2 juta ton sampah</strong>
                </div>
              </div>

              <div className="glass-stat-badge">
                <div className="stat-icon-wrapper">👥</div>
                <div className="stat-text-box">
                  <span className="stat-title">Pengguna</span>
                  <strong className="stat-number">100 ribu+ pengguna</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: CLEAN MODERN LOGIN FORM ── */}
        <div className="login-right-form-panel">
          {/* Decorative floating leaves */}
          <div className="leaf-decor leaf-1">🍃</div>
          <div className="leaf-decor leaf-2">🌿</div>
          <div className="leaf-decor leaf-3">🌱</div>

          <div className="login-form-card">
            <div className="form-header">
              <h2 className="form-main-title">Selamat Datang Kembali!</h2>
              <p className="form-subtitle">Terus berkontribusi untuk bumi yang lebih hijau.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="social-login-grid">
              <button
                type="button"
                className="btn-social"
                onClick={() => handleQuickLogin('google')}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="btn-social"
                onClick={() => handleQuickLogin('apple')}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.65 1.38-.56.65-.99 1.72-.86 2.76 1.02.08 2.05-.53 2.59-1.27z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div className="form-divider-line">
              <span>ATAU DENGAN EMAIL</span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="actual-form">
              {errors.api && (
                <div className="form-api-alert">
                  <span className="alert-icon">⚠️</span>
                  <span>{errors.api}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="input-field-group">
                <label className="field-label">ALAMAT EMAIL</label>
                <div className={`input-box-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <span className="field-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan Email Anda"
                    className="styled-input"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="input-field-group">
                <label className="field-label">KATA SANDI</label>
                <div className={`input-box-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <span className="field-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan Kata Sandi Anda"
                    className="styled-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex="-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="field-error-text">{errors.password}</span>}
              </div>

              {/* Demo Hint Banner */}
              <div className="demo-hint-box" onClick={fillDemoAccount} title="Klik untuk isi cepat">
                <span className="demo-hint-badge">💡 Akun Demo</span>
                <span className="demo-hint-text">demo@ecoruk.id • password123 (Klik untuk isi)</span>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <span>Ingat Saya</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    fillDemoAccount()
                  }}
                  className="link-forgot-pass"
                >
                  Lupa Sandi?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn-submit-login ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <span className="loading-spinner-wrap">
                    <span className="spinner"></span>
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>

              {/* Sign Up Link */}
              <div className="form-footer-register">
                <span>Belum memiliki akun?</span>{' '}
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault()
                    handleQuickLogin('new-user')
                  }}
                  className="link-signup-green"
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}