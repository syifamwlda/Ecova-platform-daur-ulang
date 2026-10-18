import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './Pertukaran.css';

export default function Pertukaran() {
  const navigate = useNavigate();

  // State for basket items
  const [basket, setBasket] = useState([
    { id: 1, name: 'PET Botol Plastik', detail: '120 gram/botol', price: 550, weight: '+0,8 kg', icon: '♻️' },
    { id: 2, name: 'Plastik Cup', detail: '24 gram/cup', price: 650, weight: '+0,2 kg', icon: '🥤' },
  ]);

  const [scanning, setScanning] = useState(false);
  const [scanToast, setScanToast] = useState(null);

  // Compute total price
  const totalPrice = basket.reduce((acc, item) => acc + item.price, 0);

  // Interactive scanner shutter click
  const handleShutterScan = () => {
    if (scanning) return;
    setScanning(true);

    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        name: 'Kaleng Minuman Aluminium',
        detail: '15 gram/kaleng',
        price: 450,
        weight: '+0,15 kg',
        icon: '🥫',
      };
      setBasket((prev) => [...prev, newItem]);
      setScanning(false);
      setScanToast('✓ Berhasil memindai Kaleng Minuman Aluminium (+Rp 450)!');
      setTimeout(() => setScanToast(null), 3500);
    }, 1200);
  };

  const handleCheckout = () => {
    navigate('/konfirmasi-pembayaran', {
      state: {
        total: totalPrice,
        itemsCount: basket.length,
      },
    });
  };

  return (
    <div className="pertukaran-layout-root">
      <Sidebar />

      <main className="pertukaran-main-content">
        {/* ── TOP HEADER ── */}
        <div className="pertukaran-header">
          <h1 className="pertukaran-title">Tukar Sampahmu dengan Sekali Scan</h1>
          <p className="pertukaran-subtitle">
            Kelola sampah dengan cara yang lebih mudah dan praktis melalui scan barcode. Cukup arahkan kamera pada barcode yang tersedia, lalu lakukan verifikasi jenis sampah langsung untuk mendapatkan poin. Poin tersebut bisa kamu gunakan untuk berbelanja produk ramah lingkungan kami, mulai dari mendapatkan produk reward hingga voucher diskon belanja di marketplace.
          </p>
        </div>

        {/* ── THREE STEP CARDS ── */}
        <div className="pertukaran-steps-grid">
          <div className="pertukaran-step-card">
            <div className="step-card-icon-wrap">⊞</div>
            <h3 className="step-card-title">Scan QR Code</h3>
            <p className="step-card-desc">
              Kunjungi drop point / mitra yang terdekat, lalu lakukan scan QR untuk memulai proses penukaran sampah nyata kamu.
            </p>
          </div>

          <div className="pertukaran-step-card">
            <div className="step-card-icon-wrap">📍</div>
            <h3 className="step-card-title">Kunjungi Drop Point</h3>
            <p className="step-card-desc">
              Kunjungi titik pengumpulan atau mitra terdekat untuk menyerahkan sampah yang sudah terverifikasi.
            </p>
          </div>

          <div className="pertukaran-step-card">
            <div className="step-card-icon-wrap">🎁</div>
            <h3 className="step-card-title">Dapatkan Reward</h3>
            <p className="step-card-desc">
              Dapatkan poin untuk menukarkannya menjadi produk eco atau voucher diskon belanja ramah lingkungan.
            </p>
          </div>
        </div>

        {/* ── SCANNER & BASKET ── */}
        <div className="scanner-basket-grid">
          {/* Scanner Viewport */}
          <div className="scanner-viewport-card">
            <img
              src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=900&q=80"
              alt="Scan Barcode Kemasan"
              className="scanner-bg-img"
            />
            <div className="scanner-overlay-gradient" />

            <div className="scanner-top-bar">
              <div className="scanner-header-texts">
                <h3 className="scanner-title">Scan Kode QR</h3>
                <p className="scanner-subtitle">
                  Scan barcode pada kemasan untuk verifikasi jenis sampah secara otomatis dan mulai proses penukaran dengan cepat.
                </p>
              </div>
              <button
                type="button"
                className="btn-close-scanner"
                onClick={() => setScanToast('Arahkan kamera ke kemasan sampah')}
              >
                ✕
              </button>
            </div>

            {/* Viewfinder Center with Yellow Frame */}
            <div className="scanner-viewfinder-center">
              <span className="viewfinder-corner corner-tl" />
              <span className="viewfinder-corner corner-tr" />
              <span className="viewfinder-corner corner-bl" />
              <span className="viewfinder-corner corner-br" />
              <span className="laser-scan-line" />
            </div>

            {/* Shutter Button Bottom */}
            <div className="scanner-bottom-trigger">
              <button
                type="button"
                className="btn-shutter-circle"
                onClick={handleShutterScan}
                disabled={scanning}
                title="Tekan untuk memindai barcode"
              >
                <div className="shutter-inner-ring" />
              </button>
              <span className="shutter-hint-text">
                {scanning ? '⟳ Memindai barcode...' : 'Tekan tombol untuk memindai sampah'}
              </span>
              {scanToast && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.9)',
                  color: '#FFF',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '4px'
                }}>
                  {scanToast}
                </div>
              )}
            </div>
          </div>

          {/* Basket Summary Card */}
          <div className="basket-summary-card">
            <div>
              <div className="basket-card-header">
                <h3 className="basket-card-title">Kumpulan Saat Ini</h3>
                <span className="basket-verified-tag">BERHASIL DISCAN</span>
              </div>

              {/* Items List */}
              <div className="basket-items-list">
                {basket.map((item) => (
                  <div key={item.id} className="basket-item-row">
                    <div className="item-left-meta">
                      <span className="item-icon">{item.icon}</span>
                      <div>
                        <strong className="item-title">{item.name}</strong>
                        <div className="item-unit">{item.detail}</div>
                      </div>
                    </div>
                    <div className="item-right-price">
                      <span className="price-main">Rp {item.price.toLocaleString('id-ID')}</span>
                      <span className="weight-add">{item.weight}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eco Tip Banner */}
              <div className="eco-tip-banner">
                <div className="eco-tip-title">
                  <span>🍃</span> ECO TIP
                </div>
                <p className="eco-tip-desc">
                  Pastikan sampah bersih, kering dan tidak tercampur. Hal ini penting untuk mempermudah daur ulang dan proses penukaran.
                </p>
              </div>
            </div>

            {/* Complete Button */}
            <button
              type="button"
              className="btn-complete-exchange"
              onClick={handleCheckout}
            >
              Selesaikan (Rp {totalPrice.toLocaleString('id-ID')})
            </button>
          </div>
        </div>

        {/* ── DAMPAK VERIFIKASI ── */}
        <div className="dampak-verifikasi-card">
          <h2 className="dampak-section-title">Dampak Verifikasi</h2>
          <div className="dampak-rows-container">
            {/* Row 1: Karbon Teralihkan */}
            <div className="dampak-item-row">
              <div className="dampak-info-left">
                <div className="dampak-icon-box">♻️</div>
                <div>
                  <h4 className="dampak-heading">Karbon Teralihkan: 6850ml</h4>
                  <p className="dampak-desc">
                    Angka ini menunjukkan estimasi jejak emisi karbon yang berhasil dihindarkan. Setiap botol PET 600ml yang didaur ulang berkontribusi mengurangi emisi karbon setara dengan pembakaran 150ml bensin atau emisi pendingin 1 jam.
                  </p>
                </div>
              </div>
              <div className="dampak-stat-pill-box">
                <span className="dampak-stat-val">92%</span>
                <span className="dampak-stat-sub">SUSTAINABILITY</span>
              </div>
              <div className="dampak-stat-pill-box">
                <span className="dampak-stat-val">A+</span>
                <span className="dampak-stat-sub">EFISIENSI ENERGI</span>
              </div>
            </div>

            {/* Row 2: Konservasi Cadangan Minyak */}
            <div className="dampak-item-row">
              <div className="dampak-info-left">
                <div className="dampak-icon-box orange">💧</div>
                <div>
                  <h4 className="dampak-heading">Konservasi Cadangan Minyak</h4>
                  <p className="dampak-desc">
                    Minyak adalah bahan baku utama plastik baru. Setiap 1kg plastik daur ulang dapat menghemat hingga 2 liter minyak mentah. Ini membantu menjaga cadangan energi fosil yang tidak terbarukan untuk masa depan generasi mendatang.
                  </p>
                </div>
              </div>
              <div className="dampak-stat-pill-box">
                <span className="dampak-stat-val">418,420</span>
                <span className="dampak-stat-sub">GLOBAL IMPACT</span>
              </div>
              <div className="dampak-stat-pill-box">
                <span className="dampak-stat-val">Rp 2.380</span>
                <span className="dampak-stat-sub">ESTIMASI NILAI</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KERJAKAN TUGAS HARIAN ── */}
        <div className="tasks-section-wrapper">
          <div className="tasks-section-header">
            <h2 className="tasks-section-title">Kerjakan Tugas Harian Dan Claim Rewardnya</h2>
            <p className="tasks-section-sub">Tingkatkan penghasilanmu dengan menyelesaikan tugas harianmu.</p>
          </div>

          <div className="tasks-cards-grid">
            {/* Task Card 1: Featured Dark */}
            <div className="task-card-item dark-featured">
              <div>
                <div className="task-card-top">
                  <span className="task-icon">🎯</span>
                  <span className="task-pill-badge">AKTIF HARI INI</span>
                </div>
                <h3 className="task-title">Kumpulkan & Verifikasi 5 PET Botol</h3>
                <p className="task-desc">
                  Kumpulkan dan scan minimal 5 botol plastik PET ke drop point Ecova terdekat. Dapatkan bonus poin ekstra dan badge eksklusif.
                </p>
              </div>
              <div className="task-footer-row">
                <div className="task-reward-info">
                  <span className="reward-label">Hadiah</span>
                  <span className="reward-val">Rp 2.500</span>
                </div>
                <span className="task-progress-indicator">3/5</span>
              </div>
            </div>

            {/* Task Card 2: Weekend Bonus */}
            <div className="task-card-item">
              <div>
                <div className="task-card-top">
                  <span className="task-icon">👤</span>
                  <span className="task-pill-badge">BONUS MINGGUAN</span>
                </div>
                <h3 className="task-title">Bonus Khusus Weekend: Aluminum Bonus</h3>
                <p className="task-desc">
                  Setiap akhir pekan, kumpulkan kaleng aluminium dan nikmati kenaikan nilai tukar hingga 15% lebih tinggi dari hari biasa.
                </p>
              </div>
              <div className="task-footer-row">
                <div className="task-reward-info">
                  <span className="reward-label">Persentase</span>
                  <span className="reward-val">15%</span>
                </div>
                <span className="task-progress-indicator">↗</span>
              </div>
            </div>

            {/* Task Card 3: Monthly Special */}
            <div className="task-card-item">
              <div>
                <div className="task-card-top">
                  <span className="task-icon">🏆</span>
                  <span className="task-pill-badge">SPESIAL BULANAN</span>
                </div>
                <h3 className="task-title">Tantangan Progresif: Fiber Master 2026</h3>
                <p className="task-desc">
                  Kumpulkan kategori serat kertas hingga 20kg dalam periode satu bulan. Raih status Fiber Master dan reward voucher belanja.
                </p>
              </div>
              <div className="task-footer-row">
                <div className="task-reward-info">
                  <span className="reward-label">Progres</span>
                  <span className="reward-val" style={{ fontSize: '13px' }}>12.4 / 20 kg</span>
                </div>
                <span className="task-progress-indicator">↑</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAPAN PERINGKAT (LEADERBOARD) ── */}
        <div className="leaderboard-section-wrapper">
          <div className="tasks-section-header">
            <h2 className="tasks-section-title">Rangking Poin Di Papan Peringkat</h2>
            <p className="tasks-section-sub">Top kontributor bulan ini. Apakah namamu juga ada di sini?</p>
          </div>

          <div className="leaderboard-cards-grid">
            {/* Rank 1 */}
            <div className="leaderboard-card-item">
              <span className="rank-badge-pill rank-01">RANK 01</span>
              <div className="user-avatar-circle avatar-green">R</div>
              <strong className="user-name">Rizky K</strong>
              <span className="user-id-code">ID: #29402</span>
              <div className="user-total-box">
                <span className="total-tag-label">TOTAL PENGUMPULAN</span>
                <span className="total-amount-bold">Rp 280 jt-an</span>
              </div>
              <span className="leaderboard-footer-stats">320 transaksi • 150 kg</span>
            </div>

            {/* Rank 2 */}
            <div className="leaderboard-card-item">
              <span className="rank-badge-pill rank-02">RANK 02</span>
              <div className="user-avatar-circle avatar-gray">R</div>
              <strong className="user-name">Rico W</strong>
              <span className="user-id-code">ID: #19842</span>
              <div className="user-total-box">
                <span className="total-tag-label">TOTAL PENGUMPULAN</span>
                <span className="total-amount-bold">Rp 190 jt-an</span>
              </div>
              <span className="leaderboard-footer-stats">240 transaksi • 120 kg</span>
            </div>

            {/* Rank 3 */}
            <div className="leaderboard-card-item">
              <span className="rank-badge-pill rank-03">RANK 03</span>
              <div className="user-avatar-circle avatar-orange">Y</div>
              <strong className="user-name">Yrumm</strong>
              <span className="user-id-code">ID: #11029</span>
              <div className="user-total-box">
                <span className="total-tag-label">TOTAL PENGUMPULAN</span>
                <span className="total-amount-bold">Rp 40 jt-an</span>
              </div>
              <span className="leaderboard-footer-stats">160 transaksi • 80 kg</span>
            </div>

            {/* Rank 4 */}
            <div className="leaderboard-card-item">
              <span className="rank-badge-pill rank-04">RANK 04</span>
              <div className="user-avatar-circle avatar-red">T</div>
              <strong className="user-name">Tara R</strong>
              <span className="user-id-code">ID: #08211</span>
              <div className="user-total-box">
                <span className="total-tag-label">TOTAL PENGUMPULAN</span>
                <span className="total-amount-bold">Rp 10 jt-an</span>
              </div>
              <span className="leaderboard-footer-stats">40 transaksi • 20 kg</span>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <Footer />
      </main>
    </div>
  );
}