import './Footer.css';

export default function Footer() {
  return (
    <footer className="eco-footer">
      <div className="eco-footer__inner">
        {/* Brand */}
        <div className="eco-footer__brand">
          <h3 className="eco-footer__logo">Ecovan</h3>
          <p className="eco-footer__tagline">
            Menghubungkan pengelolaan sampah dengan dampak nyata melalui
            inovasi, komunitas, dan aksi berkelanjutan untuk masa depan yang
            lebih hijau.
          </p>
          <div className="eco-footer__socials">
            {['f', 'T', 'X', 'IG', 'G'].map((s) => (
              <span key={s} className="eco-footer__social">{s}</span>
            ))}
          </div>
        </div>

        {/* Navigasi */}
        <div className="eco-footer__col">
          <h4>NAVIGASI</h4>
          {['Waste Tracker', 'AI Recommendation', 'Eco Marketplace', 'Community'].map((l) => (
            <a key={l} href="#" className="eco-footer__link">{l}</a>
          ))}
        </div>

        {/* Impact */}
        <div className="eco-footer__col">
          <h4>IMPACT</h4>
          {['Impact Dashboard', 'Tree Contribution', 'Eco Mission', 'Growth Tracker'].map((l) => (
            <a key={l} href="#" className="eco-footer__link">{l}</a>
          ))}
        </div>

        {/* Legal */}
        <div className="eco-footer__col">
          <h4>LEGAL</h4>
          {['Privacy Policy', 'Terms of Use', 'Data Protection', 'Safety'].map((l) => (
            <a key={l} href="#" className="eco-footer__link">{l}</a>
          ))}
        </div>
      </div>

      <div className="eco-footer__bottom">
        <span>© 2026 Ecovan — From Waste to Impact  Built for a Greener Future</span>
        <div className="eco-footer__bottom-right">
          <span>DESIGN WITH PURPOSE</span>
          <span className="eco-footer__dot">·</span>
          <span>NEUTRAL ORIGIN</span>
        </div>
      </div>
    </footer>
  );
}
