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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on type
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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

  return (
    <div className="login-page page-enter">
      <Navbar />

      {/* Left panel - decorative */}
      <div className="login-panel">
        <div className="panel-overlay"></div>
        <img
          src="https://i.pinimg.com/736x/c2/92/a1/c292a15c40601048aecd56aa95ff86a9.jpg"
          alt="eco background"
          className="panel-img"
        />
        <div className="panel-content">
          <div className="panel-logo">
            <span>♻</span>
            <span>Ecovan</span>
          </div>
          <blockquote className="panel-quote">
            "Setiap tindakan kecilmu hari ini adalah investasi terbesar untuk bumi anak cucumu."
          </blockquote>
          <div className="panel-stats">
            <div className="panel-stat">
              <strong>10K+</strong>
              <span>Ton Didaur Ulang</span>
            </div>
            <div className="panel-stat">
              <strong>120K</strong>
              <span>Anggota Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="login-form-side">
        <div className="login-form-wrap">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Kembali ke Beranda
          </button>

          <div className="login-header">
            <h1>Selamat Datang</h1>
            <p>Masuk untuk mulai berkontribusi bagi lingkungan</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="error-msg">⚠ {errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && (
                <span className="error-msg">⚠ {errors.password}</span>
              )}
            </div>

            <div className="form-extras">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-link">Lupa password?</a>
            </div>

            {errors.api && (
              <div className="api-error">⚠ {errors.api}</div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Memproses...
                </span>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <div className="divider">
            <span>atau</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span>G</span> Masuk dengan Google
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
