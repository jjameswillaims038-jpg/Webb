// components/Footer.js
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid container">
        <div>
          <h4>NightForge</h4>
          <p>👹 NightForge v1.0 — Forged in Darkness</p>
          <p>Crafted by <strong>Mr Dev</strong></p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>
            <a
              className="footer-whatsapp"
              href="https://wa.me/2349164624021"
              target="_blank"
              rel="noreferrer"
            >
              {/* react-icons will show. If you removed react-icons, the import will fail —
                  but if you don't want to install react-icons, replace the FaWhatsapp element
                  below with the inline SVG (comment/remove the FaWhatsapp line). */}
              <FaWhatsapp style={{ color: '#25D366', fontSize: 18 }} />
              Chat with Dev
            </a>
          </p>
        </div>

        <div>
          <h4>Legal</h4>
          <p><small>Use responsibly.</small></p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NightForge — Mr Dev</span>
      </div>
    </footer>
  );
}
